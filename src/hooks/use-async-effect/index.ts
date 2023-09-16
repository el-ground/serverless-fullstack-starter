import React from 'react'

export const useAsyncEffect = (
  func: () => Promise<(() => Promise<void>) | void>,
  deps: React.DependencyList,
) => {
  return React.useEffect(() => {
    let cleaner: (() => Promise<void>) | void
    let cleaned = false
    const wrapper = async () => {
      cleaner = await func()
      if (cleaned && cleaner) {
        await cleaner()
      }
    }

    wrapper()

    // cleaner
    return () => {
      ;(async () => {
        cleaned = true
        if (cleaner) {
          await cleaner()
        }
      })()
    }
    // eslint-disable-next-line
  }, deps)
}
