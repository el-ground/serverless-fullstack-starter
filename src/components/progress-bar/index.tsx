'use client'

import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import { useSearchParams, usePathname } from 'next/navigation'
import './_nprogress.scss'
import { hookRefreshesWith } from '@/src/util/hook-refreshes-with'

// https://github.com/vercel/next.js/discussions/42016#discussioncomment-7360917

const shouldStartAnimation = (e: MouseEvent | KeyboardEvent) => {
  // Check if it's a left mouse click without any keyboard modifiers
  if (
    (e as MouseEvent).button === 0 &&
    !(e as MouseEvent).ctrlKey &&
    !(e as MouseEvent).shiftKey &&
    !(e as MouseEvent).metaKey
  ) {
    return true
  }

  // Check for middle mouse button click
  if ((e as MouseEvent).button === 1) {
    return false
  }

  // Check for right mouse button click
  if ((e as MouseEvent).button === 2) {
    return false
  }

  // Check if it's an accessibility event (e.g., screen reader activation)
  if (e.type === 'click' && (e as MouseEvent).detail === 0) {
    return true
  }

  return false
}

export const ProgressBarBase = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  React.useEffect(() => {
    hookRefreshesWith(searchParams)
    hookRefreshesWith(pathname)
    NProgress.done()
  }, [searchParams, pathname])

  useEffect(() => {
    NProgress.configure({ showSpinner: false, trickleSpeed: 200, speed: 100 })

    const handleAnchorClick = (event: MouseEvent) => {
      if (!shouldStartAnimation(event)) {
        return
      }

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
  }, [])

  return null
}

export const ProgressBar = () => {
  return (
    <React.Suspense>
      <ProgressBarBase />
    </React.Suspense>
  )
}
