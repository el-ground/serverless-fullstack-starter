import React from 'react'
import { useStateRef } from '@hooks/use-state-ref'
import { useGetter } from '@hooks/use-getter'
import { useIsSSR } from '@hooks/use-is-ssr'

/*
    re-renders when element array changes. 
    acts like pipelines :)
    the array reference tracks change.
*/
export const useIntersectionObserver = <T extends HTMLElement>(
  elementsOrElement: (T | null)[] | (T | null),
  onIntersectionObserve: (
    entries: IntersectionObserverEntry[],
    /*
      entry : {
        boundingClientRect,
        intersectionRatio,
        intersectionRect,
        isIntersecting,
        rootBounds,
        target,
        time
      }
    */
    observer: IntersectionObserver,
  ) => void,
  root: HTMLElement | null | `body`,
  rootMargin: string,
  threshold: number,
) => {
  const isSSR = useIsSSR()
  const intersectionObserverBox = useStateRef<IntersectionObserver | null>(null)
  const getElementsOrElement = useGetter(elementsOrElement)
  const lastElementsBox = React.useRef<(T | null)[] | null>([])

  const getOnIntersectionObserve = useGetter(onIntersectionObserve)
  React.useMemo(() => {
    if (isSSR) {
      return
    }

    intersectionObserverBox.current?.disconnect()
    intersectionObserverBox.current = null
    lastElementsBox.current = []

    if (!root) {
      return
    }

    intersectionObserverBox.current = new IntersectionObserver(
      (...args) => getOnIntersectionObserve()(...args),
      {
        root: root === `body` ? null : root,
        rootMargin,
        threshold,
      },
    )

    const elementsOrElement = getElementsOrElement()
    let elements
    if (!Array.isArray(elementsOrElement)) {
      elements = [elementsOrElement]
    } else {
      elements = elementsOrElement
    }

    elements.forEach((element) => {
      if (element) {
        intersectionObserverBox.current?.observe(element)
      }
    })

    lastElementsBox.current = [...elements]

    //
  }, [
    getElementsOrElement,
    isSSR,
    root,
    rootMargin,
    threshold,
    getOnIntersectionObserve,
    intersectionObserverBox,
  ])

  /*
    on component unmount, remove intersectionObserver
  */
  React.useEffect(() => {
    return () => {
      intersectionObserverBox.current?.disconnect()
      intersectionObserverBox.current = null
    }
  }, [intersectionObserverBox])

  /*
    on elements mount!!
  */
  React.useMemo(() => {
    if (intersectionObserverBox) {
      /*
        if new, observe
      */

      let elements: (T | null)[]
      if (!Array.isArray(elementsOrElement)) {
        elements = [elementsOrElement]
      } else {
        elements = elementsOrElement
      }

      elements.forEach((element) => {
        if (element) {
          /*
            observe only what's new
          */
          if (!(lastElementsBox.current || []).includes(element)) {
            intersectionObserverBox.current?.observe(element)
          }
        }
      })

      /*
        if removed, unobserve.
      */
      if (lastElementsBox.current) {
        lastElementsBox.current.forEach((lastElement) => {
          if (lastElement && !elements.includes(lastElement)) {
            intersectionObserverBox.current?.unobserve(lastElement)
          }
        })
      }
      lastElementsBox.current = [...elements]
    }
  }, [intersectionObserverBox, elementsOrElement])
}
