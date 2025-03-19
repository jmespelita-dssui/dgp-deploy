/* eslint-disable react/prop-types */
import { CCard, CCardBody, CCardHeader, CContainer } from '@coreui/react-pro'
import React, { useEffect, useState } from 'react'
import CorrDisplay from './CorrDisplay'
import moment from 'moment'
import { createAxiosInstance, getAccessToken } from 'src/util/axiosUtils'

const Correspondence = ({ corr }) => {
  const [createdBy, setCreatedBy] = useState('')

  useEffect(() => {
    const getCreatedByUsername = async () => {
      try {
        const token = await getAccessToken()
        const axiosInstance = createAxiosInstance(token)
        const createdByPromise = await axiosInstance.get(`systemusers(${corr._createdby_value})`)
        setCreatedBy(createdByPromise.data.fullname)
      } catch (e) {
        console.log(e)
      }
    }
    getCreatedByUsername()
  }, [])

  return (
    <>
      <CCard className="mb-4 mt-5">
        <CCardHeader>
          <h5>{corr.cr9b3_type}</h5>
          <h6>{moment(corr.cr9b3_date).format('DD/MM/YYYY')}</h6>
        </CCardHeader>
        <CCardBody>
          <CorrDisplay richText={corr.cr9b3_message} />
        </CCardBody>
      </CCard>
      <div className="text-end">
        <figcaption className="blockquote-footer">
          Logged by {createdBy} on{' '}
          <cite title="Source Title">{moment(corr.createdon).format('DD/MM/YYYY HH:mm')}</cite>
        </figcaption>
      </div>
    </>
  )
}

export default Correspondence
