'use client'
import { get, set } from '@framework/preferences'
import { createUuid } from '@/src/util/uuid'
//

let cachedUniqueInstallationId: string | null = null

export const registerUniqueInstallationId = async () => {
  const prev = await get(`uniqueInstallationId`)

  if (prev) {
    cachedUniqueInstallationId = prev
  } else {
    const uuid = createUuid(20)
    await set(`uniqueInstallationId`, uuid)
    cachedUniqueInstallationId = uuid
  }
}

export const getUniqueInstallationId = (): string => {
  if (!cachedUniqueInstallationId) {
    throw new Error(`UniqueInstallationId not initialized!`)
  }

  return cachedUniqueInstallationId
}

if (typeof window !== `undefined`) {
  registerUniqueInstallationId()
}
