import React from 'react'
import { useForceUpdate } from 'hooks/use-force-update'

/*
    setters and array different.
*/
const emptyList: any[] = []
export const useRefList = <T,>(
  length: number,
): [T[], ((value: T) => void)[]] => {
  /*
        returns list of refs
    */

  const forceUpdate = useForceUpdate() // not a big fan
  const elementsBox = React.useRef<T[]>(emptyList as T[])

  /*
    1. on length change, re-arrange the elements. good.
    2. return callback ref list
*/

  const setterList = React.useMemo(() => {
    const setterList: ((value: T) => void)[] = []
    for (let i = 0; i < length; i += 1) {
      setterList.push((value: T) => {
        const newElements = [...elementsBox.current]
        newElements[i] = value
        elementsBox.current = newElements
        forceUpdate()
      })
    }
    return setterList
  }, [length, forceUpdate])

  return [elementsBox.current, setterList]
}
