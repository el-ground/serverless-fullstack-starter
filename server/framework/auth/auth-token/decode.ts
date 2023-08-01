import jwt from 'jsonwebtoken'
import { User } from '#types'
import { getAuthPublicKey } from '#framework/auth/key'
import type { AuthTokenPayload, RefreshToken } from './types'
import { ResError } from '#util/error'
import { getRolesAndPermissionsFromUser } from '../roles-and-permissions'
import { readDirectly } from '#framework/database/read'
import { createAuthToken } from './create'

export interface DecodeResult {
  token: string
  payload: AuthTokenPayload
  refreshed: boolean
}

export const decodeAuthTokenNoRefresh = async (
  token: string,
): Promise<DecodeResult> => {
  const publicKey = await getAuthPublicKey()
  // verify will throw
  const payload = jwt.verify(token, publicKey) as AuthTokenPayload
  return {
    token,
    payload,
    refreshed: false,
  }
}

/*
    Throws on unauthorized scenarios.
    Caller must catch and proceed with setting empty token to the client.
*/
export const decodeAuthTokenTryRefresh = async (
  token: string,
): Promise<DecodeResult> => {
  const publicKey = await getAuthPublicKey()

  try {
    const payload = jwt.verify(token, publicKey) as AuthTokenPayload
    // if verification success, proceed!
    return {
      token,
      payload,
      refreshed: false,
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorName: string | undefined = (e as any)?.name
    const errorMessage: string =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any)?.message || `empty-error-message`

    if (errorName !== `TokenExpiredError`) {
      throw new ResError(401, errorMessage)
    }
  }

  // Can only reach here when TokenExpiredError

  // token expired! might need a refresh.
  // decode without throwing on expire :)
  const payload = jwt.verify(token, publicKey, {
    ignoreExpiration: true,
  }) as AuthTokenPayload

  const { userId, refreshTokenId } = payload

  const refreshToken = await readDirectly<RefreshToken>(
    `/refresh-tokens/${refreshTokenId}`,
  )
  if (refreshToken) {
    const {
      userId: refreshTokenUserId,
      revoked,
      expiresAtSeconds,
      createdAtSeconds,
    } = refreshToken

    // normalized below
    const user = await readDirectly<User>(`/users/${userId}`)
    if (!user) {
      throw new ResError(401, `User not found`)
    }

    if (!refreshTokenUserId || refreshTokenUserId !== userId) {
      throw new ResError(401, `refresh-token-user-id-mismatch`)
    }

    if (revoked) {
      throw new ResError(401, `refresh-token-revoked`)
    }

    if (
      !createdAtSeconds ||
      !expiresAtSeconds ||
      expiresAtSeconds <= Date.now() / 1000
    ) {
      throw new ResError(401, `refresh-token-expired`)
    }

    // refresh token not expired = valid user.
    // if more than halfway, create a new refresh token.
    let createNewRefreshToken = false
    if (expiresAtSeconds && createdAtSeconds) {
      const diffSeconds = expiresAtSeconds - createdAtSeconds
      const expireHalfSeconds = createdAtSeconds + Math.floor(diffSeconds / 2)
      if (expireHalfSeconds <= Date.now() / 1000) {
        createNewRefreshToken = true
      }
    }

    const rolesAndPermissions = getRolesAndPermissionsFromUser(user)
    const { token: newToken, payload } = await createAuthToken({
      userId,
      rolesAndPermissions,
      refreshTokenId: createNewRefreshToken ? undefined : refreshTokenId,
      refreshTokenIdToRevoke: createNewRefreshToken
        ? refreshTokenId
        : undefined,
    })
    return {
      token: newToken,
      payload,
      refreshed: true,
    }
  } else {
    throw new ResError(401, `refresh-token-not-found`)
  }
}
