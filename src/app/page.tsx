import React from 'react'
import { SSRHydrationClientComponentExample } from '@/src/components/ssr-hydration-client-component-example'
import { RSCExample } from '@/src/components/rsc-example'
import { SubscriptionExample } from '@components/subscription-example'

// <RSCExample />
const RootContainer = () => {
  return (
    <>
      <React.Suspense fallback="loading...">
        <SSRHydrationClientComponentExample />
      </React.Suspense>
      <RSCExample />
      <SubscriptionExample />
      <div className="t14">Hello world!!!</div>
    </>
  )
}

export default RootContainer
