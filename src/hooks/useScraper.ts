// src/hooks/useScraper.ts
import { useState, useEffect, useCallback } from 'react'
import {
  getScraperHistory,
  getScraperSources,
  runScraper as apiRunScraper,
  toggleScraperSource as apiToggleSource
} from '../services/api/admin.scraper'
import type { ScraperSource, ScraperRun } from '../types'

export const useScraper = () => {
  const [sources, setSources] = useState<ScraperSource[]>([])
  const [runs, setRuns] = useState<ScraperRun[]>([])
  const [loadingSources, setLoadingSources] = useState(true)
  const [loadingRuns, setLoadingRuns] = useState(true)
  const [runningMode, setRunningMode] = useState<'fast' | 'slow' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchSources = useCallback(async () => {
    setLoadingSources(true)
    try {
      const data = await getScraperSources()
      setSources(data)
      setError(null)
    } catch (e: any) {
      setError(e.message || 'Error cargando fuentes')
    } finally {
      setLoadingSources(false)
    }
  }, [])

  const fetchHistory = useCallback(async () => {
    setLoadingRuns(true)
    try {
      const resp = await getScraperHistory(1, 20)
      setRuns(resp.data)
    } finally {
      setLoadingRuns(false)
    }
  }, [])

  const run = async (mode: 'fast' | 'slow') => {
    setRunningMode(mode)
    setError(null)
    try {
      await apiRunScraper(mode)
      setTimeout(fetchHistory, 2000)
    } catch (e: any) {
      setError(e.message || 'Error al ejecutar scraper')
      setRunningMode(null)
    }
  }

  const toggleSource = async (id: string, enabled: boolean) => {
    try {
      await apiToggleSource(id, enabled)
      setSources(prev => prev.map(s => s.id === id ? { ...s, enabled } : s))
    } catch (e: any) {
      setError(e.message || 'Error actualizando fuente')
    }
  }

  useEffect(() => {
    fetchSources()
    fetchHistory()
  }, [fetchSources, fetchHistory])

  // Polling cada 5s mientras hay ejecución activa
  useEffect(() => {
    if (!runningMode) return
    const interval = setInterval(fetchHistory, 5000)
    return () => clearInterval(interval)
  }, [runningMode, fetchHistory])

  return {
    sources,
    runs,
    loadingSources,
    loadingRuns,
    runningMode,
    error,
    run,
    toggleSource,
    refreshSources: fetchSources,
    refreshHistory: fetchHistory
  }
}
