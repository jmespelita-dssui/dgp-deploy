/* eslint-disable react/prop-types */
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCol, CPopover, CRow } from '@coreui/react-pro'
import React, { useState } from 'react'
import ConfirmClose from '../modals/ConfirmClose'

const RelatedPraticaRow = ({ relatedPratica, isDeleteMode, removeRelatedPratica }) => {
  const [visibleConfirmClose, setVisibleConfirmClose] = useState(false)
  const [confirmCloseBody, setConfirmCloseBody] = useState({
    title: 'Confirm',
    text: `Are you sure you want to remove related pratica ${relatedPratica.cr9b3_protno}?`,
  })

  const onContinue = () => {
    setVisibleConfirmClose(false)
    removeRelatedPratica(relatedPratica)
  }

  return (
    <>
      <ConfirmClose
        visible={visibleConfirmClose}
        body={confirmCloseBody}
        onCancel={() => setVisibleConfirmClose(false)}
        onContinue={onContinue}
      />
      {/* <CListGroupItem> */}
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
          <CPopover content={'Open'} placement="top" trigger={['hover', 'focus']}>
            <CButton
              className="mt-3"
              variant="ghost"
              color="black"
              onClick={() => {
                // setConfirmAction('archive')
                // setConfirmCloseBody({
                //   ...confirmCloseBody,
                //   text: 'Are you sure you want to archive this pratica?',
                // })
                // showConfirmClose()
              }}
            >
              {relatedPratica.cr9b3_protno} -{' '}
              <span className="text-decoration-underline">{relatedPratica.cr9b3_titolo} </span>
            </CButton>
          </CPopover>
        </CCol>
      </CRow>
      {/* </CListGroupItem> */}
    </>
  )
}

export default RelatedPraticaRow
