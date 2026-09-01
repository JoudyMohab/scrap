const GIS_SRC = 'https://accounts.google.com/gsi/client'
export const CALENDAR_READONLY_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly'

let gisLoadPromise: Promise<void> | null = null

function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  if (gisLoadPromise) return gisLoadPromise

  gisLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GIS_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('failed to load Google sign-in'))
    document.head.appendChild(script)
  })
  return gisLoadPromise
}

export interface TokenResult {
  accessToken: string
  expiresAt: number
}

export async function requestAccessToken(opts: { silent?: boolean } = {}): Promise<TokenResult> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) throw new Error('missing-client-id')

  await loadGis()
  if (!window.google?.accounts?.oauth2) throw new Error('google-sign-in-unavailable')

  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: CALENDAR_READONLY_SCOPE,
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error || 'no-token'))
          return
        }
        resolve({
          accessToken: resp.access_token,
          expiresAt: Date.now() + Number(resp.expires_in || 3600) * 1000,
        })
      },
      error_callback: (err) => {
        reject(new Error(err.type || 'auth-error'))
      },
    })
    client.requestAccessToken({ prompt: opts.silent ? '' : 'consent' })
  })
}

export function revokeAccessToken(token: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.google?.accounts?.oauth2) {
      resolve()
      return
    }
    window.google.accounts.oauth2.revoke(token, () => resolve())
  })
}
