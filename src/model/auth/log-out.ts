import Cookies from 'js-cookie'
import { getClient, gql } from '@/src/framework/apollo/client'
import { clearAuthSession } from './util'

const SUBMIT_LOGOUT = gql(`
    mutation submitLogout {
        Auth_logOut
    }
`)

/*
    TODO : might tell the server to expire the refresh token!!!
*/
export const logOut = async () => {
  // try server request first
  // then, remove cookie locally.

  try {
    const client = getClient()
    await client.mutate({
      mutation: SUBMIT_LOGOUT,
    })
  } catch (e) {
    console.error(e)
    // continue logout even the request fails.
  }

  Cookies.remove(`authorization-payload`)
  clearAuthSession()
}
