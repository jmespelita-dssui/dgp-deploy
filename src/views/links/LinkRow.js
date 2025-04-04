/* eslint-disable react/prop-types */
import { cilLink, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCol, CLink, CPopover, CRow } from '@coreui/react-pro'
import React, { useState } from 'react'
import { useToast } from 'src/context/ToastContext'
import LinkModal from '../modals/LinkModal'
import ConfirmClose from '../modals/ConfirmClose'

const LinkRow = ({ isEdit, link, saveLink, type, onDelete }) => {
  const { addToast } = useToast()
  const [visible, setVisible] = useState(false)
  const [visibleConfirmClose, setVisibleConfirmClose] = useState(false)
  const body = {
    title: 'Delete link',
    text: `Are you sure you want to delete link "${link.label}"?`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link.url)
      addToast('Link copied!', 'Links', 'success')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleDelete = () => {
    saveLink('delete', link)
    // () => console.log(link)
  }
  return (
    <>
      <ConfirmClose
        visible={visibleConfirmClose}
        body={body}
        onCancel={() => setVisibleConfirmClose(false)}
        onContinue={handleDelete}
      />
      <LinkModal
        visible={visible}
        onClose={() => setVisible(false)}
        action={'edit'}
        link={link}
        saveLink={saveLink}
        type={type}
      />

      {link && (
        <CRow>
          {isEdit ? (
            <CCol md={2} className="d-grid gap-1 d-md-flex justify-content-md-end">
              <CPopover content={'Delete'} placement="top" trigger={['hover', 'focus']}>
                <CIcon
                  icon={cilTrash}
                  className="trash link-controls"
                  onClick={() => setVisibleConfirmClose(true)}
                />
              </CPopover>
              <CPopover content={'Edit'} placement="top" trigger={['hover', 'focus']}>
                <CIcon
                  icon={cilPencil}
                  className="edit link-controls"
                  onClick={() => setVisible(true)}
                />
              </CPopover>
              <CPopover content={'Copy link'} placement="top" trigger={['hover', 'focus']}>
                <CIcon icon={cilLink} className="copy link-controls" onClick={copyToClipboard} />
              </CPopover>
            </CCol>
          ) : (
            <CCol md={1}>
              <CPopover content={'Copy'} placement="top" trigger={['hover', 'focus']}>
                <CIcon icon={cilLink} className="copy link-controls" onClick={copyToClipboard} />
              </CPopover>
            </CCol>
          )}

          <CCol className="mb-3">
            <CLink href={link.url} target="_blank">
              {link.label}
            </CLink>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default LinkRow
