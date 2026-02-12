import React, { useState } from 'react'
import { CFormInput, CListGroup, CListGroupItem, CSpinner } from '@coreui/react-pro'

import { useGlobalSearch } from 'src/hooks/useGlobalSearch'

const Search = () => {
  const [query, setQuery] = useState('')
  const { results, loading, search } = useGlobalSearch()

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    search(value)
  }

  return (
    <>
      <CFormInput placeholder="Search..." value={query} onChange={handleChange} />

      {loading && <CSpinner size="sm" />}

      <CListGroup className="mt-3">
        {results.map((item) => (
          <CListGroupItem key={item['@search.score'] + item.id}>
            <strong>{item.name}</strong>
            <div className="text-muted small">{item['@search.score']}</div>
          </CListGroupItem>
        ))}
      </CListGroup>
    </>
  )
}

export default Search
