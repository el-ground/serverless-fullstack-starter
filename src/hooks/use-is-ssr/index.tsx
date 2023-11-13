'use client'
import React from 'react'

export const IsSSRContext = React.createContext(true)

export const IsSSRProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSSR, setIsSSR] = React.useState(true)
  React.useEffect(() => {
    if (typeof window !== `undefined`) {
      setIsSSR(false)
    }
  }, [])

  return <IsSSRContext.Provider value={isSSR}>{children}</IsSSRContext.Provider>
}

export const useIsSSR = () => {
  return React.useContext(IsSSRContext)
}
