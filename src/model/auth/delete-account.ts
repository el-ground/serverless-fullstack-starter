import Cookies from 'js-cookie'
import { getClient, gql } from '@/src/framework/apollo/client'
import { clearAuthSession } from './util'

const SUBMIT_DELETE_ACCOUNT = gql(`
    mutation deleteAccount {
        User_deleteAccount
    }
`)

export const deleteAccount = async () => {
  //
  const client = getClient()
  await client.mutate({
    mutation: SUBMIT_DELETE_ACCOUNT,
  })
  Cookies.remove(`authorization-payload`)
  clearAuthSession()
}
