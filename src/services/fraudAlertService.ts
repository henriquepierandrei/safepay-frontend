// src/services/fraudAlertService.ts

import type {
  FraudAlertFilterRequestDTO,
  FraudAlertResponseDTO,
  PagedResponse
} from '../types/fraudAlert'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

class FraudAlertService {
  private baseUrl: string

  constructor() {
    this.baseUrl = `${API_BASE_URL}/fraud-alerts`
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('token')
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP Error: ${response.status}`)
    }

    return response.json()
  }

  async searchAlerts(
    filters: FraudAlertFilterRequestDTO,
    page: number = 0,
    size: number = 10
  ): Promise<PagedResponse<FraudAlertResponseDTO>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })

    return this.request<PagedResponse<FraudAlertResponseDTO>>(
      `/search?${queryParams}`,
      {
        method: 'POST',
        body: JSON.stringify(filters),
      }
    )
  }

  async getAlertById(id: string): Promise<FraudAlertResponseDTO> {
    return this.request<FraudAlertResponseDTO>(`/${id}`)
  }

  async updateAlertStatus(
    id: string,
    status: string
  ): Promise<FraudAlertResponseDTO> {
    return this.request<FraudAlertResponseDTO>(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  async getRecentAlerts(limit: number = 10): Promise<FraudAlertResponseDTO[]> {
    return this.request<FraudAlertResponseDTO[]>(`/recent?limit=${limit}`)
  }

  async getAlertStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    bySeverity: Record<string, number>
  }> {
    return this.request(`/stats`)
  }
}

export const fraudAlertService = new FraudAlertService()
export default fraudAlertService