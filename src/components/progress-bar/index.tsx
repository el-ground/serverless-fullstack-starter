'use client'

import { useEffect } from 'react'
import NProgress from 'nprogress'
import './_nprogress.scss'

// https://github.com/vercel/next.js/discussions/42016#discussioncomment-7360917

export const ProgressBar = () => {
  useEffect(() => {
    NProgress.configure({ showSpinner: false, trickleSpeed: 200, speed: 100 })

    const handleAnchorClick = (event: MouseEvent) => {
      const targetUrl = (event.currentTarget as HTMLAnchorElement).href
      const currentUrl = window.location.href
      if (targetUrl && targetUrl !== currentUrl) {
        NProgress.start()
      }
    }

    const handleMutation: MutationCallback = () => {
      const anchorElements: NodeListOf<HTMLAnchorElement> =
        document.querySelectorAll('a[href]')

      anchorElements.forEach((anchor) =>
        anchor.addEventListener('click', handleAnchorClick),
      )
    }

    const mutationObserver = new MutationObserver(handleMutation)

    mutationObserver.observe(document, { childList: true, subtree: true })

    window.history.back = new Proxy(window.history.back, {
      apply: (target, thisArg) => {
        NProgress.done()
        return target.apply(thisArg)
      },
    })

    window.history.replaceState = new Proxy(window.history.replaceState, {
      apply: (
        target,
        thisArg,
        argArray: Parameters<typeof history.replaceState>,
      ) => {
        NProgress.done()
        return target.apply(thisArg, argArray)
      },
    })

    window.history.go = new Proxy(window.history.go, {
      apply: (target, thisArg, argArray: Parameters<typeof history.go>) => {
        NProgress.done()
        return target.apply(thisArg, argArray)
      },
    })

    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (
        target,
        thisArg,
        argArray: Parameters<typeof history.pushState>,
      ) => {
        NProgress.done()
        return target.apply(thisArg, argArray)
      },
    })
  }, [])

  return null
}
