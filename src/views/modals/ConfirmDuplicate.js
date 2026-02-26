/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CContainer,
  CListGroup,
  CListGroupItem,
} from '@coreui/react-pro'
import { getPratica } from 'src/services/praticaService'
import apiClient from 'src/util/apiClient'
import moment from 'moment'

const ConfirmDuplicate = ({ visible, onCancel, onContinue, data }) => {
  const [origPratica, setOrigPratica] = useState()

  useEffect(() => {
    console.log(data)

    if (data) {
      getOrigPratica()
    }
  }, [visible])

  const getOrigPratica = async () => {
    const response = await apiClient.get(
      `cr9b3_praticas?$filter=cr9b3_protno eq '${data.pratica.cr9b3_protno}'`,
    )
    console.log('original pratica', response.data.value[0])
    setOrigPratica(response.data.value[0])
  }

  const onSubmit = (e) => {
    e.preventDefault()
    onContinue(data)
  }

  return (
    <CModal visible={visible} alignment="center" backdrop="static">
      <CForm onSubmit={onSubmit}>
        <CModalHeader closeButton={false}>
          <CModalTitle>Crea duplicato</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {origPratica ? (
            <>
              <CContainer className="mt-3">
                Pratica con questo numero di protocollo {origPratica.cr9b3_protno} già esistente.
                Sei sicuro di voler procedere con la creazione della pratica?
              </CContainer>
              <CContainer className="mt-3 mb-3">
                <CListGroup flush>
                  <CListGroupItem>
                    <strong>
                      {origPratica.cr9b3_protno} - {origPratica.cr9b3_titolo}
                    </strong>
                  </CListGroupItem>
                  <CListGroupItem>
                    Istruzioni: {origPratica.cr9b3_istruzionesuperiori}
                  </CListGroupItem>
                  {origPratica.cr9b3_debrief && (
                    <CListGroupItem>Briefing: {origPratica.cr9b3_debrief}</CListGroupItem>
                  )}
                  <CListGroupItem>
                    <small className="float-end text-medium-emphasis">
                      Data di creazione: {moment(origPratica.createdon).format('DD/MM/YY')}
                    </small>
                  </CListGroupItem>
                </CListGroup>
              </CContainer>
            </>
          ) : (
            ''
          )}
          {/* <Summary item={praticheList.find((item) => item.cr9b3_praticaid === pratica)} /> */}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onCancel}>
            Annulla
          </CButton>
          <CButton color="primary" type="submit">
            Continua
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default ConfirmDuplicate
