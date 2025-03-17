/* eslint-disable react/prop-types */
import React from 'react'
import { CContainer } from '@coreui/react-pro'

const CorrDisplay = ({ richText }) => {
  return <div dangerouslySetInnerHTML={{ __html: richText }} />
}

export default CorrDisplay
