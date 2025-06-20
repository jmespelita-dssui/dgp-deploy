/* eslint-disable react/prop-types */
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCol, CPopover, CRow } from '@coreui/react-pro'
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
    title: 'Confirm',
    text: `Are you sure you want to remove related pratica ${relatedPratica.cr9b3_protno}?`,
  })

  const onContinue = () => {
    setVisibleConfirmClose(false)
    removeRelatedPratica(relatedPratica)
  }

  const verifyAccess = () => {
    if (praticheList.find((prat) => prat.cr9b3_praticaid === relatedPratica.cr9b3_praticaid)) {
      setNewPratica(relatedPratica.cr9b3_praticaid)
    } else {
      addToast('You do not have access to view this pratica.', 'Open Pratica', 'warning', 3000)
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
            <CPopover content={'Remove'} placement="top" trigger={['hover', 'focus']}>
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
            </CPopover>
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
