import type { DiscordLoginPopupParams, ErrorResponse, SuccessResponse } from './types.ts'
import { generateAuthUrl, isAccessTokenResponse, isCodeResponse, isErrorResponse } from './utils.ts'

export const popupDiscordLogin = ({
  clientId,
  popupWidth = 700,
  popupHeight = 800,
  scopes = ['identify'],
  responseType = 'token',
  onStart,
  onError,
  onSuccess,
  onClose,
}: DiscordLoginPopupParams) => {
  const popupLeft = window.innerWidth / 2 - popupWidth / 2
  const popupTop = window.innerHeight / 2 - popupHeight / 2
  const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`

  const url = generateAuthUrl({ clientId, responseType, scopes })

  const popup = window.open(url, 'open-auth-discord', params)

  onStart()

  const discordLoginMessageInterval = window.setInterval(() => {
    popup!.postMessage({ params: { responseType }, source: 'open-auth-discord' }, window?.location?.origin || '*')
  }, 500)

  const closeTimer = window.setInterval(function () {
    if (popup?.closed) {
      window.clearInterval(closeTimer)
      onClose()
    }
  }, 500)

  window.addEventListener(
    'message',
    (event: { data: SuccessResponse | ErrorResponse }) => {
      let closePopup = false
      const eventData = event.data
      if (isAccessTokenResponse(eventData) || isCodeResponse(eventData)) {
        onSuccess(eventData)
        closePopup = true
      } else if (isErrorResponse(eventData)) {
        onError(eventData)
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
