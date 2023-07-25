import React from 'react'

export const useGetIsMounted = () => {
  const isMountedRef = React.useRef(true)
  const getIsMounted = React.useCallback(() => isMountedRef.current, [])
  React.useEffect(() => {
    // case for re-mount..?
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])
  return getIsMounted
}
