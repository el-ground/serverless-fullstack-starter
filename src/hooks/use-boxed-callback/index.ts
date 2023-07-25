import React, { DependencyList } from 'react'
import { useGetter } from '@hooks/use-getter'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const useBoxedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: DependencyList,
) => {
  // eslint-disable-next-line
  const callbackWithDeps = React.useCallback(callback, dependencies)
  const getCallbackWithDeps = useGetter(callbackWithDeps)
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const wrapper = React.useRef((...args: any[]) => {
    return getCallbackWithDeps()(...args)
  })

  return wrapper.current
}
