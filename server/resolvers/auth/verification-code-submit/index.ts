import { GraphQLError } from 'graphql'
import type { MutationResolvers } from '#types'
import { VerificationCodeState, VerificationCodeSubmitError } from '#types'
import { validate, sanitize } from '@/schema/auth/verification-code-submit'
import { CompactEncrypt } from 'jose'
import jwt from 'jsonwebtoken'
import { decodeAuthKeySignedToken } from '../util'
import {
  getAuthKeyStringRSA4096Private,
  getAuthKeyObjectSymmetric256,
} from '#framework/auth/key'
import { testRateLimiter } from '@/server/services/rate-limiter'
import { VALIDATION_FAIL } from '#types/common-errors'
import type { VerificationCodeRequestTokenPayload } from '../verification-code-request/types'
import type { VerificationCodeSubmitTokenPayload } from './types'

export const Auth_verificationCodeSubmit: MutationResolvers['Auth_verificationCodeSubmit'] =
  async (_, { input: _input }) => {
    const errors = validate(_input)
    if (errors) {
      throw new GraphQLError(`validation error!`, {
        extensions: { code: VALIDATION_FAIL, errors },
      })
    }

    const {
      verificationCodeRequestToken,
      verificationCode: submittedVerificationCode,
    } = sanitize(_input)

    let verificationCodeRequestTokenPayload: VerificationCodeRequestTokenPayload
    try {
      verificationCodeRequestTokenPayload = await decodeAuthKeySignedToken(
        verificationCodeRequestToken,
      )
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any)?.name === `TokenExpiredError`) {
        throw new GraphQLError(`token verification time expired`, {
          extensions: {
            code: VerificationCodeSubmitError.VerificationTimeExpired,
          },
        })
      }

      throw e
    }

    const {
      data: {
        requestId,
        method,
        authId,
        state,
        createdAtMilliseconds,
        verificationCode,
      },
    } = verificationCodeRequestTokenPayload

    // acquire two locks! 5 per 5 sec lock

    const shortLockAcquired = await testRateLimiter(
      `phone-verification-code-submit-per-sec:${authId}`,
      5,
      5 * 1000,
    )

    if (!shortLockAcquired) {
      throw new GraphQLError(`rate limited`, {
        extensions: { code: VerificationCodeSubmitError.RateLimited },
      })
    }

    // acquire two locks! 10 per 60 sec lock
    const longLockAcquired = await testRateLimiter(
      `phone-verification-code-submit-total:${authId}`,
      10,
      60 * 1000,
    )

    if (!longLockAcquired) {
      throw new GraphQLError(`rate limited`, {
        extensions: { code: VerificationCodeSubmitError.RateLimited },
      })
    }
    //

    /*
        1. Check time. Check 4min. (Users are allowed 3min)
      */
    if (createdAtMilliseconds + 4 * 60 * 1000 < Date.now()) {
      // changing the message will break things!
      // login client state depends on this exact message.
      throw new GraphQLError(`token verification time expired`, {
        extensions: {
          code: VerificationCodeSubmitError.VerificationTimeExpired,
        },
      })
    }

    if (state !== VerificationCodeState.VerificationCodeRequest) {
      throw new GraphQLError(`invalid verification state`, {
        extensions: {
          code: VerificationCodeSubmitError.InvalidVerificationState,
        },
      })
    }

    if (verificationCode !== submittedVerificationCode) {
      // changing the message will break things!
      // login client state depends on this exact message.
      throw new GraphQLError(`verification code mismatch`, {
        extensions: {
          code: VerificationCodeSubmitError.VerificationCodeMismatch,
        },
      })
    }

    const payload: VerificationCodeSubmitTokenPayload = {
      data: {
        requestId,
        method,
        state: VerificationCodeState.VerificationCodeSubmit,
        authId,
        createdAtMilliseconds: Date.now(),
        version: `1.0.0`,
      },
    }

    const phoneVerificationSubmitToken = jwt.sign(
      payload,
      getAuthKeyStringRSA4096Private(),
      {
        // 4 minutes to enter the token. Users will prompted for 3 min
        expiresIn: '20m',
        algorithm: 'RS256',
      },
    )

    const encryptedPhoneVerificationSubmitToken = await new CompactEncrypt(
      new TextEncoder().encode(phoneVerificationSubmitToken),
    )
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(getAuthKeyObjectSymmetric256())

    return {
      verificationCodeSubmitToken: encryptedPhoneVerificationSubmitToken,
    }
  }
