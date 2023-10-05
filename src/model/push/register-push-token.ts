import { getUniqueInstallationId } from '../unique-installation-id'
import { tryThrowError } from '@/src/framework/apollo/util'
import { gql, getClient } from '@framework/apollo/client'
import { set, del } from '@model/preferences'
import { getAuth } from '@hooks/use-auth/client'

const mutation = gql(`
    mutation RegisterPushToken($input: RegisterPushTokenInput!) {
        Push_registerPushToken(input: $input) {
            success
        }
    }
`)

export const registerPushToken = async ({
  pushToken,
}: {
  pushToken: string | null
}) => {
  if (pushToken) {
    // save locally.
    const { userId } = getAuth()
    if (userId) {
      await set(`latestPushTokenRegisteredUserId`, userId)
    } else {
      await del(`latestPushTokenRegisteredUserId`)
    }
    await set(`pushToken`, pushToken)
  } else {
    // unregister scenario.

    await del(`latestPushTokenRegisteredUserId`)
    await del(`pushToken`)
  }

  const client = getClient()
  const result = await client.mutate({
    mutation,
    variables: {
      input: {
        uniqueInstallationId: getUniqueInstallationId(),
        pushToken,
      },
    },
  })

  tryThrowError(result.errors)
}
