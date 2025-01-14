/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { CToaster, CToast, CToastClose, CToastBody, CToastHeader } from '@coreui/react-pro'

const ToastManager = ({ toasts, removeToast }) => {
  return (
    <CToaster placement="top-end">
      {toasts.map((toast) => (
        <CToast
          key={toast.id} // Use a unique identifier, e.g., `toast.id`, instead of `index`
          visible
          autohide={3000}
          onClose={() => removeToast(toast.id)} // Pass `toast.id` to identify which toast to remove
        >
          <CToastHeader closeButton>
            <svg
              className="rounded me-2"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
              role="img"
              aria-label={`${toast.type} icon`}
            >
              <rect
                width="100%"
                height="100%"
                fill={toast.type === 'success' ? '#198754' : '#8f3937'}
              ></rect>
            </svg>
            <div className="fw-bold me-auto">{toast.header}</div>
          </CToastHeader>
          <CToastBody>{toast.message}</CToastBody>
        </CToast>
      ))}
    </CToaster>
  )
}

export default ToastManager
