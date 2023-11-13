import React from 'react'
import { useForceUpdate } from '@hooks/use-force-update'
import { useBoxedCallback } from '@hooks/use-boxed-callback'

export type ObjectFieldEditor<T> = (
  k: keyof T | T,
  vOrSkipUpdate?: T[keyof T] | boolean,
  skipUpdate?: boolean,
) => void

// TODO bad!
const useSetObjectHelper = <T>(
  setState: (value: T, skipUpdate?: boolean) => void,
  valueBox: React.MutableRefObject<T>,
): ObjectFieldEditor<T> => {
  return React.useCallback<ObjectFieldEditor<T>>(
    (k, vOrSkipUpdate, skipUpdateOrUndefined) => {
      let newData
      let skipUpdate
      if (typeof k === `string`) {
        const v = vOrSkipUpdate as T[keyof T]
        skipUpdate = skipUpdateOrUndefined
        newData = {
          ...valueBox.current,
          [k]: v,
        }
        /*
        newData = {
          ...valueBox.current,
          [k]: v,
        }
        */
      } else if (typeof k === `object`) {
        skipUpdate = vOrSkipUpdate as boolean | undefined
        newData = {
          ...k,
        }
      } else {
        throw new Error(`useSetObjectHelper parameter not supported : ${k}`)
      }
      setState(newData, skipUpdate)
    },
    [setState, valueBox],
  )
}

export type SynchronousStateSetter<T> = (value: T, skipUpdate?: boolean) => void

/*
  Synchronous state : subsequent setStates are reflected!
*/
export const useSynchronousState = <T>(
  defaultValue: T,
  updateStateOnDefaultValueChange = false,
): [
  React.MutableRefObject<T>,
  SynchronousStateSetter<T>,
  ObjectFieldEditor<T>,
] => {
  const valueBox = React.useRef(defaultValue)
  const forceUpdate = useForceUpdate()

  // if this setState is called within render, the forceUpdate should suspend until end of render!
  const setState = useBoxedCallback<SynchronousStateSetter<T>>(
    (value: T, skipUpdate?: boolean) => {
      if (value !== valueBox.current) {
        valueBox.current = value
        if (!skipUpdate) {
          forceUpdate()
        }
      }
    },
    [forceUpdate],
  )

  React.useMemo(() => {
    if (updateStateOnDefaultValueChange) {
      setState(defaultValue, true) // defaultValue change renders anyway.
    }
  }, [setState, defaultValue, updateStateOnDefaultValueChange])

  // syntactic sugar
  const setObjectStateHelper = useSetObjectHelper(setState, valueBox)

  return [valueBox, setState, setObjectStateHelper]
}
