// src/hooks/useFraudAlerts.ts

import { useState, useCallback, useEffect } from 'react'
import { fraudAlertService } from '../services/fraudAlertService'
import type {
  FraudAlertFilterRequestDTO,
  FraudAlertResponseDTO,
  Severity,
  AlertType,
  PagedResponse
} from '../types/fraudAlert'

interface UseFraudAlertsOptions {
  autoFetch?: boolean
  initialPage?: number
  initialSize?: number
}

interface UseFraudAlertsReturn {
  alerts: FraudAlertResponseDTO[]
  loading: boolean
  error: string | null
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  filters: FraudAlertFilterRequestDTO
  setFilters: React.Dispatch<React.SetStateAction<FraudAlertFilterRequestDTO>>
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  fetchAlerts: () => Promise<void>
  refresh: () => Promise<void>
  clearFilters: () => void
}

export const useFraudAlerts = (
  options: UseFraudAlertsOptions = {}
): UseFraudAlertsReturn => {
  const { autoFetch = true, initialPage = 0, initialSize = 10 } = options

  const [alerts, setAlerts] = useState<FraudAlertResponseDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialSize)
  const [filters, setFilters] = useState<FraudAlertFilterRequestDTO>({})

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fraudAlertService.searchAlerts(
        filters,
        currentPage,
        pageSize
      )

      setAlerts(response.content)
      setTotalElements(response.totalElements)
      setTotalPages(response.totalPages)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar alertas'
      setError(message)
      console.error('Erro ao buscar alertas:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage, pageSize])

  const refresh = useCallback(async () => {
    await fetchAlerts()
  }, [fetchAlerts])

  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(0)
  }, [])

  const setPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchAlerts()
    }
  }, [autoFetch, fetchAlerts])

  return {
    alerts,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    filters,
    setFilters,
    setPage,
    setPageSize,
    fetchAlerts,
    refresh,
    clearFilters
  }
}

export default useFraudAlerts