import React from 'react'

import { useCallbackRef } from 'use-callback-ref'
import { useForceUpdate } from '@hooks/use-force-update'

/*
  Potential update within render!!
  If ref assign is used within render, This will fail.
  Don't use stateRef for ref containing values.
  * Only use it for component / element ref, and set them through component render
*/
export const useStateRef = <T>(
  initialValue: T | null = null,
): React.MutableRefObject<T | null> => {
  const forceUpdate = useForceUpdate()
  const prevRef: React.MutableRefObject<T | null> =
    React.useRef<T>(initialValue)

  const ref = useCallbackRef<T>(null, (newRef) => {
    if (newRef !== prevRef.current) {
      prevRef.current = newRef
      forceUpdate()
    }
  })

  return ref
}
