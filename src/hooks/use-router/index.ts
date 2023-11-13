'use client'
import React from 'react'
import NProgress from 'nprogress'
import { useRouter as useNextRouter } from 'next/navigation'

export const useRouter = () => {
  const nextRouter = useNextRouter()
  const extendedRouter = React.useMemo(() => {
    /*
        Trying to render loading nprogress bar;
        NProgress.done() is called inside pushState / back proxy in components/progress-bar/index.tsx
    */

    const back: typeof nextRouter.back = (...args) => {
      NProgress.start()
      return nextRouter.back(...args)
    }
    const replace: typeof nextRouter.replace = (...args) => {
      NProgress.start()
      return nextRouter.replace(...args)
    }
    const push: typeof nextRouter.push = (...args) => {
      NProgress.start()
      return nextRouter.push(...args)
    }

    return {
      ...nextRouter,
      back,
      replace,
      push,
    }
  }, [nextRouter])

  return extendedRouter
}
