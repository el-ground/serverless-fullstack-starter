'use client'

import React from 'react'
import { getSid } from '@/src/hooks/use-auth/common'
import { copy } from '@/src/util/copy'

export const ShareButton = ({
  title,
  path,
  className,
  children,
}: {
  title: string
  path: string
  className?: string
  children: React.ReactNode
}) => {
  const sidCookie = getSid() || ``

  return (
    <button
      className={className || ``}
      type="button"
      onClick={() => {
        const url = new URL(path, location.origin)
        url.searchParams.append(`sid`, sidCookie)
        const urlString = `${url}`

        if (navigator?.share) {
          navigator.share({
            title,
            url: urlString,
          })
        } else {
          copy(urlString, `주소가`)
        }
      }}
    >
      {children}
    </button>
  )
}
