import React from 'react'
import Head from 'next/head'
import '@/src/styles/global/_global-styles.scss'
import type { Metadata, Viewport } from 'next'
import { ErrorBoundary } from '@/src/components/error-boundary'
import { ApolloProvider } from '@/src/framework/apollo/client'
import { ToastProvider } from '@components/toast-provider'
import { PushProvider } from '@hooks/use-push'
import { AuthProvider } from '@hooks/use-auth/client'
import { IsSSRProvider } from '@hooks/use-is-ssr'
import { ProgressBar } from '@components/progress-bar'
// initialize rsc client
import '@framework/apollo/rsc'
import '@util/cookie/rsc'
import '@hooks/use-auth/rsc'
// initialize app methods
import '@framework/app/initialize'
import '@framework/service-worker/initialize'
import { getInjectSafeAreaInsetString } from '@framework/app/inject-safe-area-inset'
import { DisableOverscrollRefreshProvider } from '@hooks/use-disable-overscroll-refresh'

console.log(`NODE_ENV : ${process.env.NODE_ENV}`)

const title = `Serverless fullstack starter`
const description = `Go fullstack!`

export const viewport: Viewport = {
  width: `device-width`,
  height: `device-height`,
  initialScale: 1,
  viewportFit: `cover`,
}

// https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title,
  description,
  manifest: '/manifest.json',
  appleWebApp: {
    statusBarStyle: `black-translucent`,
  },
  openGraph: {
    siteName: title,
    locale: `ko_KR`,
    type: `website`,
    description,
    title,
    images: `/images/og-image.png`,
  },
  robots: `noindex, nofollow`,
  keywords: `serverless, fullstack, starter`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/nanum-gothic/nanum-gothic-400.woff2"
          as="font"
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/fonts/nanum-gothic/nanum-gothic-700.woff2"
          as="font"
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/fonts/nanum-gothic/nanum-gothic-800.woff2"
          as="font"
          type="font/woff2"
        />
      </Head>
      <html lang="kr">
        <head>
          <script
            id="inject-safe-area-inset"
            dangerouslySetInnerHTML={{
              __html: getInjectSafeAreaInsetString(),
            }}
          />
        </head>
        <body>
          <ErrorBoundary>
            <ProgressBar />
            <ApolloProvider>
              <IsSSRProvider>
                <AuthProvider>
                  <PushProvider>
                    <DisableOverscrollRefreshProvider>
                      {children}
                    </DisableOverscrollRefreshProvider>
                  </PushProvider>
                </AuthProvider>
                <ToastProvider />
              </IsSSRProvider>
            </ApolloProvider>
          </ErrorBoundary>
        </body>
      </html>
    </>
  )
}
