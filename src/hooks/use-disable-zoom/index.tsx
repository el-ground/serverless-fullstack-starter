import React from 'react'

export const useDisableZoom = (element: HTMLElement | null) => {
  const [disabled, setDisabled] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (element && disabled) {
      const preventDefault = (e: Event) => {
        e.preventDefault()
      }
      // eslint-disable-next-line
      element.style.touchAction = `none`
      element.addEventListener(`gesturestart`, preventDefault)
      element.addEventListener(`gesturechange`, preventDefault)
      element.addEventListener(`touchstart`, preventDefault)
      element.addEventListener(`touchmove`, preventDefault)

      /*
      const preventDefaultTouchMove = e => {
        const event = e.originalEvent || e
        if (event.scale !== 1) {
          event.preventDefault()
        }
      }

      element.addEventListener(`touchMove`, preventDefaultTouchMove, {
        passive: false,
      }) */

      let viewportElement: HTMLMetaElement | null = null
      const nodeList = document.head.getElementsByTagName(`meta`)
      for (let i = 0; i < nodeList.length; i += 1) {
        if (nodeList[i].name === `viewport`) {
          viewportElement = nodeList[i]
        }
      }

      if (viewportElement) {
        viewportElement.content += `, user-scalable=no`
      }

      return () => {
        element.removeEventListener(`gesturestart`, preventDefault)
        element.removeEventListener(`gesturechange`, preventDefault)
        element.removeEventListener(`touchstart`, preventDefault)
        element.removeEventListener(`touchmove`, preventDefault)
        // eslint-disable-next-line
        element.style.touchAction = `auto`

        // element.removeEventListener(`touchMove`, preventDefaultTouchMove)

        if (viewportElement) {
          viewportElement.content = viewportElement.content.replace(
            `, user-scalable=no`,
            ``,
          )
        }
      }
    }
  }, [element, disabled])

  const disable = React.useCallback(() => {
    setDisabled(true)
  }, [])

  const enable = React.useCallback(() => {
    setDisabled(false)
  }, [])

  return [disable, enable]
}
