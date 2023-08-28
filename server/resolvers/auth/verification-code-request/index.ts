import { GraphQLError } from 'graphql'
import type { MutationResolvers } from '#types'
import { VerificationCodeRequestError, VerificationCodeState } from '#types'
import { validate, sanitize } from '@/schema/auth/verification-code-request'
import crypto from 'node:crypto'
import { CompactEncrypt } from 'jose'
import { create as createUUID } from '#util/uuid'
import jwt from 'jsonwebtoken'
import { sendVerificationCode } from '#services/message-sender/templates/verification'
import {
  getAuthKeyStringRSA4096Private,
  getAuthKeyObjectSymmetric256,
} from '#framework/auth/key'
import { testRateLimiter } from '@/server/services/rate-limiter'
import { getTestVerificationCode } from '../util'
import type { VerificationCodeRequestTokenPayload } from './types'
import { VALIDATION_FAIL } from '#types/common-errors'
import { logDebug } from '#util/log'

export const Auth_verificationCodeRequest: MutationResolvers['Auth_verificationCodeRequest'] =
  async (_, { input: _input }) => {
    const errors = validate(_input)
    if (errors) {
      throw new GraphQLError(`validation error!`, {
        extensions: { code: VALIDATION_FAIL, errors },
      })
    }

    const { method, verificationService, authId } = sanitize(_input)

    // acquire two locks! 5 per 5 sec lock
    const shortLockAcquired = await testRateLimiter(
      `phone-verification-code-request-per-sec:${authId}`,
      5,
      5 * 1000,
    )

    if (!shortLockAcquired) {
      throw new GraphQLError(`rate limited`, {
        extensions: { code: VerificationCodeRequestError.RateLimited },
      })
    }

    // acquire two locks! 10 per 60 sec lock
    const longLockAcquired = await testRateLimiter(
      `phone-verification-code-request-total:${authId}`,
      10,
      60 * 1000,
    )

    if (!longLockAcquired) {
      throw new GraphQLError(`rate limited`, {
        extensions: { code: VerificationCodeRequestError.RateLimited },
      })
    }
    //

    const isTestNumber = authId.indexOf(`19 9999 99`) !== -1

    let verificationCode: string
    if (isTestNumber) {
      verificationCode = await getTestVerificationCode()
    } else {
      verificationCode = `${
        crypto.randomBytes(3).readUIntBE(0, 3) % 1000000
      }`.padStart(6, '0')
    }

    // request timestamp
    const createdAtMilliseconds = Date.now()

    let servicePayload = null
    if (!isTestNumber) {
      servicePayload = await sendVerificationCode({
        verificationCode,
        authId,
        verificationService,
      })
    }

    const requestId = createUUID(14)
    const payload: VerificationCodeRequestTokenPayload = {
      data: {
        requestId,
        method,
        verificationService,
        authId,
        state: VerificationCodeState.VerificationCodeRequest,
        createdAtMilliseconds, // this will be checked at the server.
        servicePayload, // sendVerificationCode's result object.
        verificationCode,
        version: `1.0.0`,
      },
    }

    const phoneVerificationRequestToken = jwt.sign(
      payload,
      getAuthKeyStringRSA4096Private(),
      {
        // 4 minutes to enter the token. Users will prompted for 3 min
        expiresIn: '4m',
        algorithm: 'RS256',
      },
    )

    const encryptedPhoneVerificationRequestToken = await new CompactEncrypt(
      new TextEncoder().encode(phoneVerificationRequestToken),
    )
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(getAuthKeyObjectSymmetric256())

    return {
      verificationCodeRequestToken: encryptedPhoneVerificationRequestToken,
    }
  }
