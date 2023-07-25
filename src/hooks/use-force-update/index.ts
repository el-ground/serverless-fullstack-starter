import React from 'react'
import { useGetIsMounted } from '@hooks/use-get-is-mounted'

export const useForceUpdate = () => {
  const getIsMounted = useGetIsMounted()

  const valueBox = React.useRef(0)
  const [, setValue] = React.useState(0)
  return React.useCallback(() => {
    if (getIsMounted()) {
      valueBox.current += 1
      setValue(valueBox.current)
    }
  }, [getIsMounted])
}
