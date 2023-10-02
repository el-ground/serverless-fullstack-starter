import { ApolloServerPlugin } from '@apollo/server'
import deepcopy from 'deepcopy'
import { logInfo } from '#util/log'
import { stringifyQuery } from './stringify-query'

const fieldNamesToHide = [`password`, `newPassword`]

// dont put circular variables
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const recursiveReplaceFieldNames = (object: any) => {
  if (typeof object === `object` && object) {
    Object.entries(object).forEach(([k, v]) => {
      if (fieldNamesToHide.includes(k) && typeof v === `string`) {
        object[k] = `HIDDEN_FIELD`
      } else {
        recursiveReplaceFieldNames(v)
      }
    })
  }
}

// https://stackoverflow.com/questions/59988906/how-do-i-write-a-apollo-server-plugin-to-log-the-request-and-its-duration
export const LogPlugin: ApolloServerPlugin = {
  // deepcopying every request is not a good idea tho.
  async requestDidStart(requestContext) {
    const { query, variables } = requestContext.request

    const copiedVariables = deepcopy(variables)
    recursiveReplaceFieldNames(copiedVariables)

    logInfo(stringifyQuery(query, copiedVariables))
    return {}
  },
}
