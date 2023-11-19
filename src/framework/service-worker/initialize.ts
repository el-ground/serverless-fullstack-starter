'use client'

import { register } from './register'

export const initialize = async () => {
  console.log(`@framework/service-worker: initialize()`)
  await register()
}

if (typeof window !== `undefined`) {
  initialize()
}
