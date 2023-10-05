export interface TokenInstance {
  expired: boolean
  expiredAtSeconds?: number
  uniqueInstallationId: string
  pushToken: string | null
}

export interface UserPushTokenBag {
  userId: string
  tokenInstances: TokenInstance[]
  pushTokenIndex: string[]
  uniqueInstallationIdIndex: string[]
}
