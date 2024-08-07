import type { DiscordLoginPopupParams, SuccessResponse, ErrorResponse } from './types'
import { generateAuthUrl, isAccessTokenResponse, isCodeResponse, isErrorResponse } from './utils'

export const discordLoginPopup = ({
  popupWidth = 700,
  popupHeight = 800,
  clientId,
  redirectUri = window.location.origin,
  scopes = ['identify'],
  responseType = 'token',
  onStart,
  onError,
  onSuccess,
  onClose,
}: DiscordLoginPopupParams) => {
  const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${popupWidth},height=${popupHeight},left=${
    window.innerWidth / 2 - popupWidth / 2
  },top=${window.innerHeight / 2 - popupHeight / 2}`

  const url = generateAuthUrl({ clientId, responseType, redirectUri, scopes })

  const popup = window.open(url, 'Discord Auth', params)

  typeof onStart === 'function' && onStart()

  const discordLoginMessageInterval = window.setInterval(() => {
    popup!.postMessage({ params: { responseType }, source: 'open-auth-discord' }, window?.location?.origin || '*')
  }, 500)

  const closeTimer = window.setInterval(function () {
    if (popup?.closed) {
      window.clearInterval(closeTimer)
      typeof onClose === 'function' && onClose()
    }
  }, 500)

  window.addEventListener(
    'message',
    (event: { data: SuccessResponse | ErrorResponse }) => {
      let closePopup = false
      const eventData = event.data
      if (isAccessTokenResponse(eventData) || isCodeResponse(eventData)) {
        typeof onSuccess === 'function' && onSuccess(eventData)
        closePopup = true
      } else if (isErrorResponse(eventData)) {
        typeof onError === 'function' && onError(eventData)
        closePopup = true
      }

      if (closePopup) {
        window.clearInterval(closeTimer)
        window.clearInterval(discordLoginMessageInterval)
        popup!.close()
      }
    },
    false
  )
}
