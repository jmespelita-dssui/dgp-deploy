import { useState, useCallback } from 'react'
import { searchDataverse } from '../services/dataverseSearchService'

export const useGlobalSearch = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    setLoading(true)

    try {
      const data = await searchDataverse(query)
      setResults(data.value || [])
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, search }
}
