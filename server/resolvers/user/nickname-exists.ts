/*
    Exmaple
*/
import type { UserQueriesResolvers } from '@/schema/__generated__/server/types'

export const nicknameExists: UserQueriesResolvers['nicknameExists'] = async (
  _,
  { nickname },
  context,
) => {
  return {
    exists: false,
    sanitizedNickname: nickname,
  }
}
