import { ApolloServerPlugin } from '@apollo/server'
import { logInfo } from '#util/log'

// https://stackoverflow.com/questions/59988906/how-do-i-write-a-apollo-server-plugin-to-log-the-request-and-its-duration
export const LogPlugin: ApolloServerPlugin = {
  async requestDidStart(requestContext) {
    logInfo('Request started! Query:\n' + requestContext.request.query)

    const requestStartedAtMilliseconds = Date.now()
    let operationName: string | null = `UNKNOWN_OPERATION`

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      /*
      async parsingDidStart(requestContext) {
        console.log('Parsing started!')
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        console.log('Validation started!')
      },
      */

      async didResolveOperation(context) {
        operationName = context.operationName || `UNKNOWN_OPERATION`
        logInfo(`Operation ${operationName} started`)
      },

      async willSendResponse(context) {
        const currentTimeMilliseconds = Date.now()
        const elapsed = currentTimeMilliseconds - requestStartedAtMilliseconds
        logInfo(`Operation ${operationName} completed in ${elapsed} ms`)
      },
    }
  },
}
