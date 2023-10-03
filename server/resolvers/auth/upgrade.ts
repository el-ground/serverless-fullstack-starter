import { MutationResolvers, UpgradeError, User } from '#types'
import { GraphQLError } from 'graphql'

export const Auth_upgrade: MutationResolvers[`Auth_upgrade`] = async (
  _,
  // eslint-disable-next-line
  { input: { service, token } },
  { setAuthToken },
) => {
  /*
        MUST_IMPLEMENT if supports 3rd party auth
        1. verify token
            - split token header 
                https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token-response-id-token 

            - get public keys : 
                https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#oidc-find-public-key
                https://kauth.kakao.com/.well-known/jwks.json

            - verify : 
                https://developers.kakao.com/docs/latest/ko/kakaologin/common#oidc-id-token-verify 
        2. create user or read or do sth from the token;
            same with sign-up
            - read prevAuthAccount
            - if exists, read defaultUserId;
            - acquireNicknameOwnership (use authId + rand int as nickname)
            - overwriteInTransaction auth-accounts
            - createUserInTransaction userId, nickname, accountType


        -> update data inferred from the payload, etc.
        3. return user, created, or throw error
    */

  setAuthToken(null) // clear auth

  throw new GraphQLError(`verification error!`, {
    extensions: {
      code: UpgradeError.TokenVerificationFail,
    },
  })

  return {
    user: null as unknown as User,
    created: false,
  }
}
