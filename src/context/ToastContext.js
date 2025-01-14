/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from 'react'
import ToastManager from 'src/views/modals/ToastManager'

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, header, type, autohide) => {
    setToasts((prevToasts) => [...prevToasts, { message, header, type, autohide }])
  }

  const removeToast = (index) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastManager toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}
