export {}

declare global {
  interface GoogleTokenResponse {
    access_token: string
    expires_in: number
    error?: string
  }

  interface GoogleTokenErrorResponse {
    type: string
    message?: string
  }

  interface GoogleTokenClientConfig {
    client_id: string
    scope: string
    prompt?: string
    callback: (response: GoogleTokenResponse) => void
    error_callback?: (error: GoogleTokenErrorResponse) => void
  }

  interface GoogleTokenClient {
    requestAccessToken(overrideConfig?: { prompt?: string }): void
  }

  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: GoogleTokenClientConfig): GoogleTokenClient
          revoke(token: string, callback: () => void): void
        }
      }
    }
  }
}
