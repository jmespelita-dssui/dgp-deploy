/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { CModal, CModalBody, CSpinner } from '@coreui/react-pro'

const LoadingOverlay = ({ loading }) => {
  useEffect(() => {
    if (!loading) {
      // Reset focus to a safe element outside the modal
      document.body.focus()
    }
  }, [loading])

  return (
    <CModal
      visible={loading}
      backdrop={true}
      aria-labelledby="loading-overlay"
      aria-describedby="loading-overlay"
      keyboard={false}
      alignment="center"
      variant="grow"
    >
      <CModalBody className="text-center">
        <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Saving...</p>
      </CModalBody>
    </CModal>
  )
}

export default LoadingOverlay
