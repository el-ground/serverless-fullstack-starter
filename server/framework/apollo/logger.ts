import { ApolloServerPlugin } from '@apollo/server'
import { logInfo } from '#util/log'

// https://stackoverflow.com/questions/59988906/how-do-i-write-a-apollo-server-plugin-to-log-the-request-and-its-duration
export const LogPlugin: ApolloServerPlugin = {
  async requestDidStart(requestContext) {
    const { query, variables } = requestContext.request

    logInfo(
      `START OF QUERY
------------------------- Query --------------------------------------

${query}

------------------------- Variables ----------------------------------

${JSON.stringify(variables, null, 2)}

------------------------- END OF QUERY -------------------------------
`,
    )
    return {}
  },
}
