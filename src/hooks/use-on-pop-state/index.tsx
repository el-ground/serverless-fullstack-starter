'use client'

import React from 'react'
import { useGetter } from '@hooks/use-getter'
import { useBoxedCallback } from '@hooks/use-boxed-callback'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateState = (state: any) => {
  window.history.replaceState(state, ``)
}

const getState = () => {
  return window.history.state
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pushState = (state: any) => {
  window.history.pushState(state, ``)
}

const OnPopStateHandleContext = React.createContext<{
  register: (active: boolean, callback: () => boolean | void) => number
  unregister: (handle: number) => void
  setActive: (handle: number, active: boolean) => void
}>({
  register: () => -1,
  unregister: () => {
    /* no-op */
  },
  setActive: () => {
    /* no-op */
  },
})

let hasInitialHistoryPushed = false

/*
  isInitialState is used to decide whether to add a hidden state to prevent leaving the site.
*/
if (typeof window !== `undefined`) {
  if (!hasInitialHistoryPushed) {
    hasInitialHistoryPushed = true
    console.log(`setting initial state`)
    updateState({ isInitialState: true })
  }
}

let isAnyPopStateHandleAliveGlobal = false

// used in android backbutton to close app;
// if none is alive, we can safely close the app;
export const getIsAnyPopStateHandleAlive = () => {
  return isAnyPopStateHandleAliveGlobal
}

export const OnPopStateProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  /*
        components can register onPopState : 
            intercept : true / false
            
    */

  const callbackCounterBox = React.useRef(0)
  const callbackActiveBox = React.useRef<Record<number, boolean>>({})

  const callbackStackBox = React.useRef<
    { callback: () => boolean | void; handle: number }[]
  >([])

  const onActiveChange = React.useCallback(() => {
    /*
      1. if any active alive
      2. if all inactive
    */

    let isAnyAlive = false
    Object.values(callbackActiveBox.current).forEach((active) => {
      if (active) {
        isAnyAlive = true
      }
    })
    isAnyPopStateHandleAliveGlobal = isAnyAlive

    if (isAnyAlive) {
      /*
        alive 할 때 무조건 push를 하고, 
        back 할 때 살리다가, 마지막 stack 에선 안살리는거 어떰? 
      */
      // any alive
      // if initial state, push dummy state!
      // don't use getState for this.
      // onRouteChange doesn't get triggered for intermediate states, which clears the getState.

      if (window.history.state?.isInitialState) {
        /*
          add a hidden state so that we dont leave this site on backbutton.
          => change current state to a hidden state and
          => push to next state which will be the actual state.
        */

        setTimeout(() => {
          /*
            If the state update happens right after everything mounts,
            the state change is not applied.
            we need to set it back;

            useOnPopState(true, ) on the initial component render will fail otherwise.
          */
          updateState({ isHiddenState: true })

          const nextState = {
            ...getState(),
          }
          delete nextState.isInitialState
          delete nextState.isHiddenState
          pushState(nextState)
        })
      }
    }
  }, [])

  const setActive = React.useCallback(
    (handle: number, active: boolean) => {
      callbackActiveBox.current[handle] = active
      onActiveChange()
    },
    [onActiveChange],
  )

  const onPopStateHandle = React.useMemo(() => {
    return {
      register: (active: boolean, callback: () => boolean | void) => {
        // return number
        const handle = callbackCounterBox.current
        callbackCounterBox.current += 1

        callbackStackBox.current.push({
          callback,
          handle,
        })
        setActive(handle, active)
        return handle
      },
      unregister: (handle: number) => {
        callbackStackBox.current = callbackStackBox.current.filter(
          (e) => e.handle !== handle,
        )

        delete callbackActiveBox.current[handle]
        onActiveChange()
      },
      setActive,
    }
  }, [setActive, onActiveChange])

  const lastHistoryGoCalledAtBox = React.useRef(0)

  const onPopState = React.useCallback((e: PopStateEvent) => {
    if (lastHistoryGoCalledAtBox.current + 250 >= Date.now()) {
      // just leave it!
      // preventing onPopState calling onPopState :)
      return
    }
    let preventPop = false
    for (let i = callbackStackBox.current.length - 1; i >= 0; i -= 1) {
      const { handle, callback } = callbackStackBox.current[i]
      const active = callbackActiveBox.current[handle]
      if (active) {
        const callbackPreventPopResult = callback()

        if (callbackPreventPopResult) {
          preventPop = true
          break
        }
      }
    }

    if (preventPop) {
      // revert popState
      e.preventDefault()
      e.stopImmediatePropagation()
      // this calls onPopState again!!!
      // how to prevent this?
      /*
        hmmm..... need to check for isInitialState??? 
      */
      lastHistoryGoCalledAtBox.current = Date.now()
      window.history.go(1)
    } else if (window.history.state?.isHiddenState) {
      // if initial dummy state, need to go back once more.
      // remove hiddenState to prevent loops
      const newState = {
        ...(window.history.state || {}),
      }
      delete newState.isHiddenState

      window.history.replaceState(newState, ``)
      lastHistoryGoCalledAtBox.current = Date.now()
      window.history.go(-1)
    }
  }, [])

  React.useMemo(() => {
    if (typeof window !== `undefined`) {
      window.addEventListener(`popstate`, onPopState)
    }
  }, [onPopState])

  React.useEffect(() => {
    return () => {
      window.removeEventListener(`popstate`, onPopState)
    }
  }, [onPopState])

  return (
    <OnPopStateHandleContext.Provider value={onPopStateHandle}>
      {children}
    </OnPopStateHandleContext.Provider>
  )
}

export const useOnPopState = (
  active: boolean,
  callback: () => boolean | void,
) => {
  /*
        registers to the context.



    */
  const onPopStateHandle = React.useContext(OnPopStateHandleContext)

  const handleBox = React.useRef<number | null>(null)
  const boxedCallback = useBoxedCallback(callback, [callback])

  /*
    1. get id on register.
    2. update state of the id
  */

  const getActive = useGetter(active)

  React.useEffect(() => {
    if (onPopStateHandle && handleBox.current !== null) {
      onPopStateHandle.setActive(handleBox.current, active)
    }
  }, [onPopStateHandle, active])

  React.useEffect(() => {
    const handle = onPopStateHandle.register(getActive(), boxedCallback)
    handleBox.current = handle

    // unregister on unmount
    return () => {
      if (handleBox.current !== null) {
        onPopStateHandle.unregister(handleBox.current)
      }
    }
  }, [onPopStateHandle, boxedCallback, getActive])
}
