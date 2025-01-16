/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { CModal, CModalBody, CSpinner } from '@coreui/react-pro'

const LoadingOverlay = ({ loading }) => {
  useEffect(() => {
    const modalElement = document.getElementById('loading-overlay')

    if (loading && modalElement) {
      // When the modal opens, focus on the modal itself
      modalElement.focus()

      // Trap focus inside the modal (optional, depending on your accessibility needs)
      modalElement.setAttribute('tabindex', '-1')
    } else if (!loading) {
      // Reset focus to a safe element outside the modal when it's closed
      document.body.focus()
    }
  }, [loading])

  return (
    <CModal
      visible={loading}
      backdrop="static" // static to prevent closing by clicking outside
      aria-labelledby="loading-overlay"
      aria-describedby="loading-overlay"
      keyboard={false}
      alignment="center"
      variant="grow"
      id="loading-overlay" // Ensure modal has an id for accessibility
      tabIndex="-1" // Make the modal itself focusable
      inert={loading ? 'true' : undefined} // Use inert instead of aria-hidden to prevent interaction while visible
    >
      <CModalBody className="text-center">
        <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Saving...</p>
      </CModalBody>
    </CModal>
  )
}

export default LoadingOverlay
