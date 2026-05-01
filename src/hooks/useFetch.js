import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../services/apiClient'

export function useFetch(path, shouldFetch = true) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refetch = useCallback(async () => {
    if (!shouldFetch || !path) return

    setLoading(true)
    setError('')

    try {
      const response = await apiRequest(path)
      setData(response)
    } catch (fetchError) {
      setError(fetchError.message || 'Алдаа гарлаа.')
    } finally {
      setLoading(false)
    }
  }, [path, shouldFetch])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    data,
    setData,
    loading,
    error,
    refetch,
  }
}
