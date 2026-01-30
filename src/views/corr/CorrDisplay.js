/* eslint-disable react/prop-types */
import React from 'react'
import DOMPurify from 'dompurify'

const CorrDisplay = ({ richText }) => {
  const cleanHtml = DOMPurify.sanitize(richText, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li', 'a', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'style'],
  })

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
}

export default CorrDisplay
