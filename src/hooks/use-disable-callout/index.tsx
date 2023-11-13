import React from 'react'

export const useDisableCallout = () => {
  React.useEffect(() => {
    document.body.classList.toggle(`no-callout`, true)
    return () => {
      document.body.classList.toggle(`no-callout`, false)
    }
  }, [])
}
