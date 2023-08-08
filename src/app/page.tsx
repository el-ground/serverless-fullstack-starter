import { SSRHydrationClientComponentExample } from '@/src/components/ssr-hydration-client-component-example'
import { RSCExample } from '@/src/components/rsc-example'

// <RSCExample />
const RootContainer = () => {
  return (
    <>
      <SSRHydrationClientComponentExample />
      <div className="t14">Hello world!!!</div>
    </>
  )
}

export default RootContainer
