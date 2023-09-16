import React from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Func<TArgs extends any[], R> = (...args: TArgs) => R | null

export type DownHandle<
  TArgs extends any[] = [],
  R = void,
> = React.MutableRefObject<Func<TArgs, R> | null>

export const useDownHandle = <TArgs extends any[] = [], R = void>(): [
  DownHandle<TArgs, R>,
  Func<TArgs, R>,
] => {
  const handle = React.useRef<Func<TArgs, R> | null>(null)

  const call = React.useCallback((...args: TArgs) => {
    if (!handle.current) {
      console.error(`Unregistered down handle!`)
      return null
    }

    return handle.current(...args)
  }, [])

  return [handle, call]
}

export const useRegisterDownHandle = <TArgs extends any[] = [], R = void>(
  handle: DownHandle<TArgs, R> | undefined | null,
  method: Func<TArgs, R>,
  dependencies: React.DependencyList,
) => {
  // eslint-disable-next-line
  const wrappedCallback = React.useCallback(method, dependencies)

  React.useEffect(() => {
    if (handle) {
      // eslint-disable-next-line
      handle.current = wrappedCallback
    }
  }, [handle, wrappedCallback])
}
