// src/services/api/admin.scraper.ts
import { httpClient } from '../httpClient'
import type { ScraperSource, ScraperRun } from '../../types'

export const runScraper = async (mode: 'fast' | 'slow'): Promise<{ run_id: string }> => {
  const response = await httpClient.post<{ run_id: string }>(
    `/admin/scraper/run?mode=${mode}`
  )
  return response.data
}

export const getScraperHistory = async (
  page = 1,
  limit = 20
): Promise<{ data: ScraperRun[]; pagination: { current_page: number; total_pages: number; limit: number; total_items: number; has_next: boolean; has_prev: boolean } }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })
  const response = await httpClient.get(`/admin/scraper/history?${params.toString()}`)
  return {
    data: response.data.data || [],
    pagination: response.data.pagination || { current_page: 1, total_pages: 1, limit, total_items: 0, has_next: false, has_prev: false }
  }
}

export const getScraperSources = async (): Promise<ScraperSource[]> => {
  const response = await httpClient.get('/admin/scraper/sources')
  return response.data.data || []
}

export const toggleScraperSource = async (
  sourceId: string,
  enabled: boolean
): Promise<void> => {
  await httpClient.patch(`/admin/scraper/sources/${sourceId}?enabled=${enabled}`)
}
