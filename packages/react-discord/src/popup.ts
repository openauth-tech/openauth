import type { DiscordLoginPopupParams, TokenResponse } from './types'
import { generateAuthUrl, getQueryAndHash } from './utils'

export function popupDiscordLogin({
  applicationId,
  popupWidth = 700,
  popupHeight = 800,
  scopes = ['identify'],
  responseType = 'token',
  onStart,
  onError,
  onSuccess,
  onClose,
}: DiscordLoginPopupParams) {
  const popupLeft = window.innerWidth / 2 - popupWidth / 2
  const popupTop = window.innerHeight / 2 - popupHeight / 2
  const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`

  const url = generateAuthUrl({ applicationId, responseType, scopes })

  const popup = window.open(url, 'open-auth-discord', params)

  onStart()

  const checkTimer = window.setInterval(() => {
    if (!popup) {
      return
    }
    if (popup.closed) {
      window.clearInterval(checkTimer)
      onClose()
      return
    }

    try {
      if (popup.window.origin !== window.origin) {
        return
      }
    } catch {
      return
    }

    try {
      const { error, token } = parseRedirectURI(popup.window.location)
      if (token) {
        onSuccess(token)
        popup.close()
      }
      if (error) {
        onError({ error })
        popup.close()
      }
    } catch (error: any) {
      onError({ error: error.message })
      popup.close()
    }
  }, 500)
}

function parseRedirectURI(location: Location): { error?: string, token?: TokenResponse } {
  const params = getQueryAndHash(location)
  const error = params.get('error')
  if (error) {
    return { error }
  }

  const access_token = params.get('access_token')
  if (access_token) {
    const expires_in = params.get('expires_in')
    const token_type = params.get('token_type')
    const scope = params.get('scope')
    return {
      token: {
        access_token,
        expires_in: Number.parseInt(expires_in ?? '0', 10),
        token_type: token_type ?? '',
        scope: scope ? scope.split(' ') : [],
      },
    }
  }

  return {}
}
