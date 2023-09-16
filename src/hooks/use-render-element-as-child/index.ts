import React from 'react'

export const useRenderElementAsChild = (
  parent: HTMLElement | null,
  child: HTMLElement | null,
) => {
  React.useEffect(() => {
    if (child && parent) {
      parent.appendChild(child)

      return () => {
        if (child.parentNode === parent) {
          parent.removeChild(child)
        }
      }
    }
  }, [child, parent])
}

/*
    use HTMLElement.isConnected? 
*/
