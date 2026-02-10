/* eslint-disable react/prop-types */
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCol, CTooltip, CRow } from '@coreui/react-pro'
import React, { useState } from 'react'
import ConfirmClose from '../modals/ConfirmClose'
import { useToast } from 'src/context/ToastContext'

const RelatedPraticaRow = ({
  relatedPratica,
  isDeleteMode,
  removeRelatedPratica,
  praticheList,
  setNewPratica,
}) => {
  const [visibleConfirmClose, setVisibleConfirmClose] = useState(false)
  const { addToast } = useToast()

  const [confirmCloseBody, setConfirmCloseBody] = useState({
    title: 'Conferma rimozione',
    text: `Sei sicuro di voler rimuovere la pratica correlata ${relatedPratica.cr9b3_protno}?`,
  })

  const onContinue = () => {
    setVisibleConfirmClose(false)
    removeRelatedPratica(relatedPratica)
  }

  const verifyAccess = () => {
    // console.log('RELATED PRATICA', praticheList, relatedPratica.cr9b3_praticaid)
    if (praticheList.find((prat) => prat.cr9b3_praticaid === relatedPratica.cr9b3_praticaid)) {
      setNewPratica(relatedPratica.cr9b3_praticaid)
    } else {
      addToast('Non hai accesso a questa pratica.', 'Visualizza pratica', 'warning', 3000)
    }
  }

  return (
    <>
      <ConfirmClose
        visible={visibleConfirmClose}
        body={confirmCloseBody}
        onCancel={() => setVisibleConfirmClose(false)}
        onContinue={onContinue}
      />
      <CRow>
        {isDeleteMode ? (
          <CCol md={1}>
            <CTooltip content={'Elimina'} placement="top" trigger={['hover', 'focus']}>
              <CButton
                className="mt-3"
                variant="ghost"
                color="primary"
                onClick={() => {
                  //   console.log(relatedPratica.cr9b3_praticaid)
                  setVisibleConfirmClose(true)
                }}
              >
                <CIcon icon={cilTrash} />
              </CButton>
            </CTooltip>
          </CCol>
        ) : (
          ''
        )}

        <CCol className="text-start">
          <CButton
            className="mt-3"
            variant="ghost"
            color="black"
            onClick={() => {
              verifyAccess()
            }}
          >
            {relatedPratica.cr9b3_protno} -{' '}
            <span className="text-decoration-underline">{relatedPratica.cr9b3_titolo} </span>
          </CButton>
        </CCol>
      </CRow>
      {/* </CListGroupItem> */}
    </>
  )
}

export default RelatedPraticaRow
