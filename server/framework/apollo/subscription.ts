import type { SubscriptionSubscribeFn, SubscriptionResolveFn } from '#types'
import { runWithRequestId } from '../express/middlewares/request-id'
import type { Context } from './context'
import { logInfo, logDebug } from '#util/log'
import { GraphQLResolveInfo } from 'graphql'
import { createNamespace } from 'cls-hooked'

const subscriptionContextNamespace = createNamespace(`subscription-context`)

export const getSubscriptionContext = () => {
  return subscriptionContextNamespace.get(`subscription-context`) as Context
}

// makes internal pubsub use the context value! :)
// not really neat tho.
export const runWithContext = <T>(context: Context, callback: () => T): T => {
  let resultSet = false
  let result: T | null = null
  subscriptionContextNamespace.run(() => {
    // assumes addRequestId has appended request id.
    subscriptionContextNamespace.set(`subscription-context`, context)
    result = callback()
    resultSet = true
  })

  if (!resultSet) {
    throw new Error(`Namspace call should synchronously resolve`)
  }

  return result as T
}

/*
    attaches requestId for use of logger inside the resolver.

    trigger of subscription resolve functions should be pubsub backend registration.


    TODO Any way to log the pubsubBackendRegistrationId inside the resolver? 
    I know!
*/
export const wrapResolve =
  <
    TResult,
    TParent,
    TArgs,
    TWrappedParent extends { id: string; value: TParent },
  >(
    resolve: SubscriptionResolveFn<TResult, TParent, Context, TArgs>,
  ) =>
  (
    parent: TWrappedParent,
    args: TArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ) => {
    // TODO : why do we get this root === undefined call?
    if (typeof parent === `undefined`) {
      logDebug(`why do we get this root === undefined call in @wrapResolve?`)
      // skip root undefined
      return undefined as unknown as TResult
    }

    // pass in replaced dataloder!
    // since subscription resolve context is created on subscription, not each resolve.

    context.resetLoader()

    const { id, value } = parent

    return runWithRequestId(
      `conid:[${context.connectionId || ``}] subid:[${
        context.subscriptionId || ``
      }] psregid:[${id || ``}]`,
      () => {
        logInfo(`step:[WS:RESOLVE]`)
        return resolve(value, args, context, info)
      },
    )
  }

/*
  attaches requestId for use of logger inside the subscribe call 
*/
export const wrapSubscribe =
  <TResult, TParent, TArgs>(
    subscribe: SubscriptionSubscribeFn<TResult, TParent, Context, TArgs>,
  ) =>
  (...args: Parameters<typeof subscribe>) => {
    const context = args[2]
    return runWithContext(context, () =>
      runWithRequestId(
        `conid:[${context.connectionId || ``}] subid:[${
          context.subscriptionId || ``
        }]`,
        () => subscribe(...args),
      ),
    )
  }
