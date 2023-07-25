import React from 'react'

export const useGetter = <T>(target: T) => {
  const store = React.useRef<T>(target)
  store.current = target
  const get = React.useCallback(() => {
    return store.current
  }, [])
  return get
}
