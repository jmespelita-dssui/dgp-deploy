/* eslint-disable react/prop-types */
import { cilCheck, cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CMultiSelect,
  CPopover,
  CRow,
} from '@coreui/react-pro'
import React, { useEffect, useState } from 'react'
import { assignRelatedTask } from 'src/util/taskUtils'
import { useToast } from 'src/context/ToastContext'
import LoadingOverlay from '../modals/LoadingOverlay'
import RelatedPraticaRow from './RelatedPraticaRow'
import { initializeAxiosInstance } from 'src/util/axiosUtils'

const RelatedPratica = ({ relatedPratiche, praticheList, pratica, refreshRelatedPratiche }) => {
  const [options, setOptions] = useState([])
  const [visibleList, setVisibleList] = useState(false)
  const [filteredPraticheList, setFilteredPraticheList] = useState([])
  const [chosenPratica, setChosenPratica] = useState()
  const [loading, setLoading] = useState(false)
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    let filter = [...relatedPratiche, pratica]
    if (filter.length > 0) {
      filter = filter.map((p) => p.cr9b3_praticaid)
    }
    setFilteredPraticheList(praticheList.filter((p) => !filter.includes(p.cr9b3_praticaid)))
    getOptions()
    setChosenPratica()
  }, [relatedPratiche, visibleList]) // Run when praticheList updates

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setVisibleList(false)
    // console.log(pratica, chosenPratica)
    let isSuccess = await assignRelatedTask(pratica.cr9b3_praticaid, chosenPratica.cr9b3_praticaid)
    if (isSuccess) {
      addToast('Successfully added related pratica.', 'Edit Pratica', 'success', 3000)
      setVisibleList(false)
    } else {
      addToast('Related pratica was not saved.', 'Edit Pratica', 'warning', 3000)
    }
    setLoading(false)
    refreshRelatedPratiche()
  }

  const getOptions = () => {
    if (!filteredPraticheList || !Array.isArray(filteredPraticheList)) {
      console.warn('praticheList is not an array', filteredPraticheList)
      return
    }

    let filteredData = filteredPraticheList.map(
      ({ cr9b3_praticaid, cr9b3_protno, cr9b3_titolo }) => ({
        value: cr9b3_praticaid,
        label: `${cr9b3_protno || 'N/A'} - ${cr9b3_titolo || 'No Title'}`,
      }),
    )

    filteredData = [{ value: '0', label: 'Choose pratica' }, ...filteredData]
    setOptions(filteredData)
  }

  const removeRelatedPratica = async (relatedPratica) => {
    const axiosInstance = await initializeAxiosInstance()
    try {
      setLoading(true)
      let response = await axiosInstance.delete(
        `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_related_pratica(${relatedPratica.cr9b3_praticaid})/$ref`,
      )
      response = await axiosInstance.delete(
        `cr9b3_praticas(${relatedPratica.cr9b3_praticaid})/cr9b3_related_pratica(${pratica.cr9b3_praticaid})/$ref`,
      )
    } catch (error) {
      addToast('Related pratica was not removed.', 'Edit Pratica', 'warning', 3000)
      setLoading(false)
    }
    setLoading(false)
    addToast('Related pratica successfully removed.', 'Edit Pratica', 'success', 3000)
    console.log(pratica.cr9b3_titolo, relatedPratica.cr9b3_titolo)
    refreshRelatedPratiche()
  }

  return (
    <>
      <LoadingOverlay loading={loading} />

      <CModal backdrop="static" alignment="center" visible={visibleList}>
        <CForm onSubmit={onSubmit}>
          <CModalHeader closeButton={false}>
            <CModalTitle>Add related pratica</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer className="mt-3">
              <CFormSelect
                search="global"
                options={options}
                onChange={(e) => {
                  const selectedValue = e.target.value
                  //   const selectedLabel =
                  //     options.find((option) => option.value === selectedValue)?.label || 'Not found'

                  //   console.log('Selected Value:', selectedValue)
                  //   console.log('Selected Label:', selectedLabel)
                  setChosenPratica(
                    praticheList.find((item) => item.cr9b3_praticaid === selectedValue),
                  )
                }}
              />
            </CContainer>
            {/* {chosenPratica ? chosenPratica.cr9b3_titolo : ''} */}
            {chosenPratica ? (
              <CContainer className="mt-3 mb-3">
                <CListGroup flush>
                  <CListGroupItem>
                    <strong>{chosenPratica.cr9b3_titolo} </strong>
                  </CListGroupItem>
                  <CListGroupItem>
                    <strong>Prot. no. {chosenPratica.cr9b3_protno}</strong>
                  </CListGroupItem>
                  <CListGroupItem>
                    Istruzioni: {chosenPratica.cr9b3_istruzionesuperiori}
                  </CListGroupItem>
                  {chosenPratica.cr9b3_debrief && (
                    <CListGroupItem>{chosenPratica.cr9b3_debrief}</CListGroupItem>
                  )}
                </CListGroup>
              </CContainer>
            ) : (
              ''
            )}
            {/* <Summary item={praticheList.find((item) => item.cr9b3_praticaid === chosenPratica)} /> */}
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setVisibleList(false)
                setChosenPratica()
              }}
            >
              Back
            </CButton>
            <CButton color="primary" type="submit" disabled={!chosenPratica}>
              Continue
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <CContainer>
        {relatedPratiche && relatedPratiche.length > 0
          ? relatedPratiche.map((item, index) => (
              <RelatedPraticaRow
                pratica={pratica}
                relatedPratica={item}
                isDeleteMode={isDeleteMode}
                removeRelatedPratica={removeRelatedPratica}
                key={index}
              />
            ))
          : ''}
      </CContainer>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        {relatedPratiche && relatedPratiche.length > 0 ? (
          <CPopover
            content={isDeleteMode ? 'Done' : 'Edit'}
            placement="top"
            trigger={['hover', 'focus']}
          >
            <CButton
              color={isDeleteMode ? 'success' : 'secondary'}
              className="mt-3"
              onClick={() => setIsDeleteMode(!isDeleteMode)}
              variant="ghost"
            >
              {isDeleteMode ? <CIcon icon={cilCheck} /> : <CIcon icon={cilPencil} />}
            </CButton>
          </CPopover>
        ) : (
          ''
        )}

        <CButton color="light" className="mt-3" onClick={() => setVisibleList(!visibleList)}>
          <CIcon icon={cilPlus} className="me-md-2" />
          Add pratica
        </CButton>
      </div>
    </>
  )
}

export default RelatedPratica
