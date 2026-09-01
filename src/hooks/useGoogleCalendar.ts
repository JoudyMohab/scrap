import { useCallback, useEffect, useRef, useState } from 'react'
import type { CalendarEvent, GCalCalendar } from '../types'
import { requestAccessToken, revokeAccessToken } from '../lib/googleAuth'
import { fetchCalendarList, fetchEvents, isAuthError } from '../lib/googleCalendarApi'
import { useLocalStorage } from './useLocalStorage'

export type GCalStatus = 'disconnected' | 'connecting' | 'connected'

const SYNC_RANGE_DAYS = 14

export function useGoogleCalendar() {
  const [status, setStatus] = useState<GCalStatus>('disconnected')
  const [error, setError] = useState<string | null>(null)
  const [calendars, setCalendars] = useState<GCalCalendar[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])

  const [lastSyncedAt, setLastSyncedAt] = useLocalStorage<string | null>('tm.gcal.lastSynced', () => null)
  const [selectedCalendarIds, setSelectedCalendarIds] = useLocalStorage<string[] | null>(
    'tm.gcal.selectedCalendars',
    () => null,
  )
  const [everConnected, setEverConnected] = useLocalStorage<boolean>('tm.gcal.everConnected', () => false)

  // the access token itself never touches localStorage — it lives only in
  // memory for this tab's session, per Google's client-side app guidance.
  const tokenRef = useRef<{ token: string; expiresAt: number } | null>(null)
  const triedSilentReconnect = useRef(false)

  const ensureToken = useCallback(async (opts?: { silent?: boolean }) => {
    const cached = tokenRef.current
    if (cached && cached.expiresAt - 60_000 > Date.now()) return cached.token
    const result = await requestAccessToken({ silent: opts?.silent ?? false })
    tokenRef.current = { token: result.accessToken, expiresAt: result.expiresAt }
    return result.accessToken
  }, [])

  const loadCalendarsAndEvents = useCallback(
    async (token: string, calListOverride?: GCalCalendar[], idsOverride?: string[]) => {
      const list = calListOverride ?? (await fetchCalendarList(token))
      setCalendars(list)

      let chosenIds = idsOverride ?? selectedCalendarIds
      if (chosenIds == null) {
        chosenIds = list.map((c) => c.id)
        setSelectedCalendarIds(chosenIds)
      }
      const chosen = list.filter((c) => chosenIds!.includes(c.id))

      const timeMin = new Date()
      timeMin.setHours(0, 0, 0, 0)
      const timeMax = new Date(timeMin)
      timeMax.setDate(timeMax.getDate() + SYNC_RANGE_DAYS)

      const results = await Promise.all(
        chosen.map((c) => fetchEvents(token, c, timeMin.toISOString(), timeMax.toISOString()).catch(() => [])),
      )
      setEvents(results.flat())
      setLastSyncedAt(new Date().toISOString())
      setError(null)
    },
    [selectedCalendarIds, setSelectedCalendarIds, setLastSyncedAt],
  )

  const connect = useCallback(async () => {
    setStatus('connecting')
    setError(null)
    try {
      const token = await ensureToken({ silent: false })
      setEverConnected(true)
      setStatus('connected')
      await loadCalendarsAndEvents(token)
    } catch {
      setStatus('disconnected')
      setError('could not connect to google calendar.')
    }
  }, [ensureToken, loadCalendarsAndEvents, setEverConnected])

  const sync = useCallback(async () => {
    try {
      const token = await ensureToken({ silent: true })
      await loadCalendarsAndEvents(token, calendars.length ? calendars : undefined)
      setStatus('connected')
    } catch (err) {
      if (isAuthError(err)) {
        setStatus('disconnected')
        setEverConnected(false)
      }
      setError('the calendar refused to cooperate.')
    }
  }, [ensureToken, loadCalendarsAndEvents, calendars, setEverConnected])

  const disconnect = useCallback(() => {
    if (tokenRef.current) revokeAccessToken(tokenRef.current.token)
    tokenRef.current = null
    setStatus('disconnected')
    setCalendars([])
    setEvents([])
    setEverConnected(false)
    setError(null)
  }, [setEverConnected])

  const toggleCalendar = useCallback(
    (id: string) => {
      const current = selectedCalendarIds ?? calendars.map((c) => c.id)
      const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
      setSelectedCalendarIds(next)

      if (status === 'connected') {
        ensureToken({ silent: true })
          .then((token) => loadCalendarsAndEvents(token, calendars, next))
          .catch(() => setError('the calendar refused to cooperate.'))
      }
    },
    [selectedCalendarIds, calendars, status, ensureToken, loadCalendarsAndEvents, setSelectedCalendarIds],
  )

  useEffect(() => {
    if (!everConnected || triedSilentReconnect.current) return
    triedSilentReconnect.current = true
    setStatus('connecting')
    ensureToken({ silent: true })
      .then((token) => {
        setStatus('connected')
        return loadCalendarsAndEvents(token)
      })
      .catch(() => setStatus('disconnected'))
    // deliberately runs once on mount only, guarded by triedSilentReconnect above
  }, [ensureToken, everConnected, loadCalendarsAndEvents])

  return {
    status,
    error,
    calendars,
    events,
    selectedCalendarIds: selectedCalendarIds ?? calendars.map((c) => c.id),
    lastSyncedAt,
    connect,
    disconnect,
    sync,
    toggleCalendar,
  }
}

export type GoogleCalendarStore = ReturnType<typeof useGoogleCalendar>
