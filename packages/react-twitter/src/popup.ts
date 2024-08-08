import type { CodeResponse, TwitterLoginPopupParams } from './types.ts'
import { generateAuthUrl, getQueryAndHash } from './utils.ts'

export function popupTwitterLogin({
  clientId,
  popupWidth = 700,
  popupHeight = 800,
  scopes = ['users.read'],
  onStart,
  onError,
  onSuccess,
  onClose,
}: TwitterLoginPopupParams) {
  const popupLeft = window.innerWidth / 2 - popupWidth / 2
  const popupTop = window.innerHeight / 2 - popupHeight / 2
  const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`

  const { url, codeVerifier } = generateAuthUrl({ clientId, scopes })

  const popup = window.open(url, 'open-auth-twitter', params)

  onStart()

  const checkTimer = window.setInterval(() => {
    if (!popup) {
      return
    }
    console.log('twitter popup closed:', popup.closed)
    if (popup.closed) {
      window.clearInterval(checkTimer)
      onClose()
      return
    }
    try {
      if (popup.window.origin !== window.origin) {
        return
      }
    } catch (e) {
      console.error(e)
      return
    }

    try {
      const { error, code } = parseRedirectURI(popup.window.location)
      if (code) {
        onSuccess({ ...code, code_verifier: codeVerifier })
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
  }, 1000)
}

function parseRedirectURI(location: Location): { error?: string, code?: CodeResponse } {
  const params = getQueryAndHash(location)
  const error = params.get('error')
  if (error) {
    return { error }
  }
  const code = params.get('code')
  if (code) {
    return {
      code: {
        code,
        grant_type: 'authorization_code',
        redirect_uri: location.origin,
      },
    }
  }

  return {}
}
