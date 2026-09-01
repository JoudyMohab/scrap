import type { GCalStatus } from '../../hooks/useGoogleCalendar'
import { formatRelativeShort } from '../../lib/date'

interface ConnectCalendarCardProps {
  status: GCalStatus
  error: string | null
  lastSyncedAt: string | null
  isSyncing?: boolean
  onConnect: () => void
  onDisconnect: () => void
  onSync: () => void
  compact?: boolean
}

export function ConnectCalendarCard({
  status,
  error,
  lastSyncedAt,
  isSyncing,
  onConnect,
  onDisconnect,
  onSync,
  compact,
}: ConnectCalendarCardProps) {
  const noClientId = !import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (status === 'connected') {
    return (
      <div
        className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border ${compact ? 'px-3 py-2.5' : 'px-4 py-3'}`}
        style={{ borderColor: 'var(--line)' }}
      >
        <span className="text-sm" style={{ color: 'var(--ink)' }}>
          Google Calendar connected <span style={{ color: 'var(--accent)' }}>✓</span>
        </span>
        {isSyncing ? (
          <span className="font-hand text-base" style={{ color: 'var(--ink-dim)' }}>
            loading your schedule…
          </span>
        ) : (
          lastSyncedAt && (
            <span className="text-xs" style={{ color: 'var(--ink-dim)' }}>
              synced {formatRelativeShort(lastSyncedAt)}
            </span>
          )
        )}
        <div className="ml-auto flex items-center gap-3">
          <button onClick={onSync} className="text-xs underline decoration-dotted underline-offset-2" style={{ color: 'var(--ink-dim)' }}>
            sync now
          </button>
          <button onClick={onDisconnect} className="text-xs underline decoration-dotted underline-offset-2" style={{ color: 'var(--ink-dim)' }}>
            disconnect
          </button>
        </div>
        {error && (
          <p className="font-hand w-full text-base" style={{ color: 'var(--accent)' }}>
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      className={`rounded-md border border-dashed text-center ${compact ? 'px-4 py-4' : 'px-6 py-8'}`}
      style={{ borderColor: 'var(--line-strong)' }}
    >
      <p className="font-hand text-lg" style={{ color: 'var(--ink-dim)' }}>
        {error && status !== 'connecting' ? error : 'your schedule is hiding from us.'}
      </p>
      {noClientId ? (
        <p className="mx-auto mt-2 max-w-xs text-xs" style={{ color: 'var(--ink-dim)' }}>
          calendar connection isn't configured yet — add VITE_GOOGLE_CLIENT_ID to .env (see .env.example).
        </p>
      ) : (
        <button
          onClick={onConnect}
          disabled={status === 'connecting'}
          className="mt-3 rounded-full px-4 py-2 text-sm font-medium transition-transform active:scale-95 disabled:opacity-60"
          style={{ background: 'var(--accent)', color: 'var(--color-paper)' }}
        >
          {status === 'connecting' ? 'connecting…' : 'Connect Google Calendar'}
        </button>
      )}
    </div>
  )
}
