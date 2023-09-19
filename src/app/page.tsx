import React from 'react'
import { SSRHydrationClientComponentExample } from '@/src/components/ssr-hydration-client-component-example'
import { RSCExample } from '@/src/components/rsc-example'

console.log(`page module load`)
// <RSCExample />
const RootContainer = () => {
  console.log(`page compoonent render`)
  return (
    <>
      <React.Suspense fallback="loading...">
        <SSRHydrationClientComponentExample />
      </React.Suspense>
      <RSCExample />
      <div className="t14">Hello world!!!</div>
    </>
  )
}

export default RootContainer
