/*
    Exmaple
*/
import type { AuthQueriesResolvers } from '@/schema/__generated__/server/types'

export const authIdExists: AuthQueriesResolvers['authIdExists'] = async (
  _,
  { authId },
  context,
) => {
  return {
    exists: false,
    sanitizedAuthId: authId,
  }
}
