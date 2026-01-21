/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import LinkCard from './LinkCard'

const Links = ({ links, praticaID }) => {
  const [parsedLinks, setParsedLinks] = useState('')
  useEffect(() => {
    if (links) {
      setParsedLinks(JSON.parse(links))
    }
  }, [links])

  const refreshLinks = (newLinks) => {
    setParsedLinks(newLinks)
  }

  return (
    <>
      <LinkCard
        header="RICHIESTA"
        links={parsedLinks}
        type="request"
        praticaID={praticaID}
        refreshLinks={refreshLinks}
      />
      <LinkCard
        header="FOLLOW UP"
        links={parsedLinks}
        type="follow-up"
        praticaID={praticaID}
        refreshLinks={refreshLinks}
      />
    </>
  )
}

export default Links
