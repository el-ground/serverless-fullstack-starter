import { GraphQLError } from 'graphql'
import type { QueryResolvers } from '#types'
import type { NicknameOwnership } from '#model/nickname-ownership'
import { readDirectly } from '#framework/database/read'
import { sanitize, validate } from '@/schema/user/nickname-exists'

export const User_nicknameExists: QueryResolvers['User_nicknameExists'] =
  async (_, { input: _input }) => {
    const errors = validate(_input)
    if (errors) {
      throw new GraphQLError(`validation error!`, {
        extensions: { code: 'VALIDATION_FAIL', errors },
      })
    }

    const { nickname } = sanitize(_input)

    const encodedNickname = encodeURIComponent(nickname)
    const nicknameOwnership = await readDirectly<NicknameOwnership>(
      `/nickname-ownerships/${encodedNickname}`,
    )
    if (nicknameOwnership) {
      const { revoked } = nicknameOwnership
      if (!revoked) {
        return {
          exists: true,
          sanitizedNickname: nickname,
        }
      }
    }

    return {
      exists: false,
      sanitizedNickname: nickname,
    }
  }
