'use client'
import React from 'react'

const DisableOverscrollRefreshHandleContext = React.createContext<
  (enabled: boolean) => void
>(() => {
  /* no-op */
})

export const DisableOverscrollRefreshProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const disableCounterBox = React.useRef(0)

  const disableOverscrollRefreshHandle = React.useCallback(
    (enabled: boolean) => {
      const prevValue = disableCounterBox.current

      if (enabled) {
        disableCounterBox.current += 1
      } else {
        disableCounterBox.current -= 1
      }

      const nextValue = disableCounterBox.current

      if (prevValue === 0 && nextValue !== 0) {
        document.body.classList.toggle(`no-overscroll-refresh`, true)
      } else if (prevValue > 0 && nextValue === 0) {
        document.body.classList.toggle(`no-overscroll-refresh`, false)
      }
    },
    [],
  )

  return (
    <DisableOverscrollRefreshHandleContext.Provider
      value={disableOverscrollRefreshHandle}
    >
      {children}
    </DisableOverscrollRefreshHandleContext.Provider>
  )
}

export const useDisableOverscrollRefresh = (enabled = true) => {
  const disableOverscrollRefreshHandle = React.useContext(
    DisableOverscrollRefreshHandleContext,
  )

  React.useEffect(() => {
    if (enabled) {
      disableOverscrollRefreshHandle(true)
      return () => {
        disableOverscrollRefreshHandle(false)
      }
    }
  }, [enabled, disableOverscrollRefreshHandle])
}
