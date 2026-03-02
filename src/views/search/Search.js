import React, { useEffect, useState } from 'react'
import { CButton, CFormInput, CListGroup, CListGroupItem } from '@coreui/react-pro'

import { highlightMatch, unifiedSearch } from 'src/services/unifiedSearchService'
import { getColumnName, getLabelColor, getPratica } from 'src/services/praticaService'
import moment from 'moment'
import DOMPurify from 'dompurify'
import { useAccessRights } from 'src/hooks/useAccessRights'
import Pratica from '../pratica/Pratica'
import { filterPratiche } from 'src/services/accessService'
import LoadingOverlay from '../modals/LoadingOverlay'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState('')
  const [selectedPratica, setSelectedPratica] = useState()
  const [permittedPratiche, setPermittedPratiche] = useState([])
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const { assignedPratiche, defaultAccess, loading: accessLoading } = useAccessRights()

  useEffect(() => {
    filterPratiche(assignedPratiche, false).then(({ permittedPratiche }) => {
      setPermittedPratiche(permittedPratiche)
    })
  }, [accessLoading, defaultAccess, assignedPratiche])

  useEffect(() => {
    const run = async () => {
      if (!query) return setResults([])
      const data = await unifiedSearch(query, permittedPratiche)
      setResults(data)
    }

    const delay = setTimeout(run, 300)
    return () => clearTimeout(delay)
  }, [query])

  const purifyText = (richText) => {
    let cleanHtml = DOMPurify.sanitize(richText, {
      ALLOWED_TAGS: ['p'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'style'],
    })

    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  }

  const setNewPratica = async (pratID) => {
    setLoadingOverlay(true)
    // setVisible(false)
    const startTime = Date.now()
    try {
      console.log(pratID)
      const newPratica = await getPratica(pratID)
      // console.log(newPratica)

      setLabel(getLabelColor(newPratica.cr9b3_categoria))
      setSelectedPratica(newPratica)
    } catch {
      console.log('error opening related pratica')
    } finally {
      const elapsed = Date.now() - startTime
      const delay = Math.max(1500 - elapsed, 0)
      setTimeout(() => {
        // setVisible(true)
        setLoadingOverlay(false)
      }, delay)
    }
  }

  return (
    <div>
      <LoadingOverlay loading={loadingOverlay} />

      <Pratica
        visible={visible}
        onClose={() => {
          setVisible(false)
          setLoadingOverlay(false)
        }}
        pratica={selectedPratica}
        // praticheList={!isArchive ? praticheList : archiveList}
        permittedPratiche={permittedPratiche}
        label={label}
        // refresh={() => setRefreshKey((prevKey) => prevKey + 1)}
        setNewPratica={setNewPratica}
      />
      <CFormInput
        placeholder="Cerca..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        size="lg"
      />
      <CListGroup className="mt-3">
        {results.length > 0 ? (
          results.map((item, idx) => (
            <CListGroupItem className="p-3" key={idx}>
              <small className="float-end text-medium-emphasis">
                Data di creazione: {moment(item.pratica.createdon).format('DD/MM/YY')}
              </small>
              <CButton
                color="link"
                onClick={() => {
                  setSelectedPratica(item.pratica)
                  setVisible(true)
                }}
              >
                <h5>
                  {item.pratica.cr9b3_protno} - {item.pratica.cr9b3_titolo}
                </h5>
              </CButton>
              <CListGroup flush>
                {item.matches.map((match, i) => (
                  <CListGroupItem className="pb-2" key={i}>
                    <strong>{getColumnName(match.column)}</strong>
                    {match.type === 'pratica' ? (
                      <>
                        <div>{highlightMatch(match.text, query)}</div>
                      </>
                    ) : (
                      <>{purifyText(match.text)}</>
                    )}
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CListGroupItem>
          ))
        ) : query.length !== '' ? (
          <>
            <p className="m-3">Nessun risultato trovato.</p>
          </>
        ) : (
          ''
        )}
      </CListGroup>
    </div>
  )
}

export default Search
