/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

import { CButton, CCol, CContainer, CDatePicker, CForm, CFormInput } from '@coreui/react-pro'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Correspondence from './Correspondence'
import { createAxiosInstance, getAccessToken, initializeAxiosInstance } from 'src/util/axiosUtils'
import moment from 'moment-timezone'

import { useToast } from 'src/context/ToastContext'
import { getCorrs, getUserName } from 'src/util/taskUtils'
import LoadingOverlay from '../modals/LoadingOverlay'
import {
  generateActivityLogEntry,
  getUpdatedActivityLog,
  logActivity,
} from 'src/util/activityLogUtils'

const Correspondences = ({ pratica }) => {
  const [newCorr, setNewCorr] = useState('')
  const [correspondences, setCorrespondences] = useState()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const update = async () => {
      let response = await getCorrs(pratica)
      setCorrespondences(response)
    }
    update()
  }, [])

  // const handleAdd = () => {
  //   setNewCorr('')
  //   setTitle('')
  //   setDate(null)
  // }

  const saveCorr = async () => {
    setLoading(true)
    let logEntry = generateActivityLogEntry({ cr9b3_corrispondenza: title })
    if (newCorr.length > 10000) {
      console.log(newCorr.length)
      addToast(
        'Message exceeds character limit. Keep it short and sweet! Remove any photos or logos.',
        'Add update',
        'warning',
        3000,
      )
      setLoading(false)
      return
    }

    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    // console.log('saving correspondence', newCorr)
    const requestBody = {
      cr9b3_type: title,
      cr9b3_message: newCorr,
      cr9b3_date: date,
    }
    try {
      const response = await axiosInstance.post(
        `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_Pratica_Correspondence?$return=representation`,
        requestBody,
      )
      const whoami = await axiosInstance.get('WhoAmI')
      let logModifier = await getUserName(whoami.data.UserId)
      let latestLogs = await getUpdatedActivityLog(pratica.cr9b3_praticaid)
      console.log(latestLogs)
      // latestLogs = JSON.parse(latestLogs)
      let finalLogEntry

      if (latestLogs) {
        finalLogEntry = [
          ...latestLogs,
          {
            user: logModifier,
            actions: logEntry,
            timestamp: moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss'),
          },
        ]
      } else {
        finalLogEntry = [
          {
            user: logModifier,
            actions: logEntry,
            timestamp: moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss'),
          },
        ]
      }
      console.log('check for logs:', finalLogEntry)
      logActivity(pratica.cr9b3_praticaid, finalLogEntry)
      addToast('Successfully added correspondence.', 'Add update', 'success', 3000)
      // console.log('Successfully added correspondence:', response)
      setNewCorr('')
      setTitle('')
      setDate(null)

      setCorrespondences(await getCorrs(pratica))
      setLoading(false)
      return true
    } catch (error) {
      addToast('Error adding correspondence', 'Add update', 'warning', 3000)
      console.error(
        'Error adding correspondence:',
        error.response ? error.response.data : error.message,
      )
      setLoading(false)
      return false
    }
  }

  return (
    <>
      <LoadingOverlay loading={loading} />
      <CContainer onSubmit={saveCorr}>
        <CForm>
          <CFormInput
            value={title}
            maxLength={100}
            type="text"
            placeholder="Titolo"
            className="mb-3 mt-3"
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            required
          />
          <CCol lg={6}>
            <CDatePicker
              date={date}
              placeholder="Date of correspondence"
              locale="it-IT"
              onDateChange={(e) => {
                setDate(e)
              }}
              className="mb-3"
              required
            />
          </CCol>
          <ReactQuill value={newCorr} onChange={setNewCorr} />
          <CButton color="light" className="mt-3" type="submit" disabled={newCorr.length === 0}>
            <CIcon icon={cilPlus} className="text-body-secondary icon-link" />
            Add correspondence
          </CButton>
        </CForm>
        {correspondences
          ? correspondences.map((value, index) => <Correspondence corr={value} key={index} />)
          : ''}
      </CContainer>
      {/* <CorrDisplay richText={corr} /> */}
    </>
  )
}

export default Correspondences
