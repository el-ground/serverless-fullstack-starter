'use client'

import { getClient, gql } from '@framework/apollo/client'
import type { AuthProviderService } from '@types'
import { UpgradeError } from '@types'
import { tryThrowError } from '@framework/apollo/util'
/*
    browser : somehow gets 3rd party token  
    -> send to server
    -> server validates the 3rd party token is valid
    -> 
*/

const SUBMIT_UPGRADE_AUTH = gql(`
    mutation submitUpgradeAuth($input: UpgradeInput!) {
        Auth_upgrade(input: $input) {
#            user 
            created
        }
    }
`)

/*
    handle updateAuth & toast message on error outside! :)
*/
// https://developers.kakao.com/docs/latest/ko/kakaologin/common#oidc-id-token-verify
export const upgrade = async (service: AuthProviderService, token: string) => {
  const client = getClient()

  const result = await client.mutate({
    mutation: SUBMIT_UPGRADE_AUTH,
    variables: {
      input: {
        token,
        service,
      },
    },
  })

  tryThrowError(result.errors, {
    [UpgradeError.TokenVerificationFail]: `인증에 실패했습니다`,
  })

  return result.data
}
