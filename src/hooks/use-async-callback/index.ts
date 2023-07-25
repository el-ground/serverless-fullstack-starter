import React, { DependencyList } from 'react'
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const useAsyncCallback = <ArgsType extends any[], ReturnType>(
  func: (...args: ArgsType) => Promise<ReturnType>,
  deps: DependencyList,
) => {
  // eslint-disable-next-line
  return React.useCallback((...args: ArgsType) => func(...args), deps)
}
