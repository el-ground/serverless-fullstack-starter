import { EventEmitter } from 'events'
import { PubSubEngine, PubSubOptions } from 'graphql-subscriptions'
import { logInfo } from '#util/log'
import { PubSubAsyncIterator } from './async-iterator'
import { getSubscriptionContext } from '#framework/apollo/subscription'
import { Context } from '../apollo'
import { create as createUUID } from '#util/uuid'
import { runWithRequestId } from '../express/middlewares/request-id'
// TODO : common out all cls-hooked using examples
import { createNamespace } from 'cls-hooked'

const pubsubBackendRegistrationIdNamespace = createNamespace(
  `pubsub-backend-registration-id`,
)

const getPubsubBackendRegistrationId = () => {
  return pubsubBackendRegistrationIdNamespace.get(
    `pubsub-backend-registration-id`,
  ) as string
}

const runWithBackendRegistrationId = <T>(id: string, callback: () => T): T => {
  let resultSet = false
  let result: T | null = null
  pubsubBackendRegistrationIdNamespace.run(() => {
    pubsubBackendRegistrationIdNamespace.set(
      `pubsub-backend-registration-id`,
      id,
    )
    result = callback()
    resultSet = true
  })

  if (!resultSet) {
    throw new Error(`Namspace call should synchronously resolve`)
  }

  return result as T
}

// https://github.com/apollographql/graphql-subscriptions/blob/master/src/pubsub.ts
export class PubSub extends PubSubEngine {
  protected ee: EventEmitter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscriptions: { [key: string]: [string, (...args: any[]) => void] }
  private subIdCounter: number
  private backendUnregisterHandles: {
    [key: string]: {
      id: string
      callback: () => void
    }
  }

  private registerBackend: (
    triggerName: string,
    pubsubBackendRegistrationId: string,
  ) => () => void

  constructor(options: PubSubOptions = {}) {
    super()
    this.ee = options.eventEmitter || new EventEmitter()
    this.subscriptions = {}
    this.subIdCounter = 0
    this.backendUnregisterHandles = {}
    this.registerBackend = () => () => {
      throw new Error(`register backend not initialized!`)
    } // dummy
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public publish(triggerName: string, payload: any): Promise<void> {
    this.ee.emit(triggerName, payload)
    return Promise.resolve()
  }

  public subscribe(
    triggerName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMessage: (...args: any[]) => void,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    options: any,
    context?: Context,
  ): Promise<number> {
    if (!context) {
      throw new Error(`must provide context`)
    }

    const logPrefix = `conid:[${context.connectionId || ``}] subid:[${
      context.subscriptionId || ``
    }]`

    logInfo(`${logPrefix} step:[PS:SUBSCRIBE] topic:[${triggerName}]`)

    // if first subscriber, call on first subscribe
    const isFirstSubscriber = this.ee.listenerCount(triggerName) === 0

    this.ee.addListener(triggerName, onMessage)
    this.subIdCounter = this.subIdCounter + 1
    this.subscriptions[this.subIdCounter] = [triggerName, onMessage]

    if (isFirstSubscriber) {
      /*
        TODO : wrap the callback to the registration id;
        
        log registerBackend from conid subid backendid
      */
      // backendId : TOPIC & id;
      // the backend will always contain the log, right?

      // psregid : `${TOPIC}`

      const pubsubBackendRegistrationId = `${triggerName}_${createUUID(20)}`
      const pubsubBackendLogPrefix = `psregid:[${pubsubBackendRegistrationId}]`
      logInfo(
        `${logPrefix} step:[PS:REGISTER_BACKEND] topic:[${triggerName}] ${pubsubBackendLogPrefix}`,
      )
      runWithBackendRegistrationId(pubsubBackendRegistrationId, () => {
        runWithRequestId(pubsubBackendLogPrefix, () => {
          this.backendUnregisterHandles[triggerName] = {
            id: pubsubBackendRegistrationId,
            callback: this.registerBackend(
              triggerName,
              pubsubBackendRegistrationId,
            ),
          }
        })
      })
    }

    return Promise.resolve(this.subIdCounter)
  }

  public unsubscribe(subId: number, context?: Context) {
    if (!context) {
      throw new Error(`must provide context`)
    }

    const logPrefix = `conid:[${context.connectionId || ``}] subid:[${
      context.subscriptionId || ``
    }]`

    const [triggerName, onMessage] = this.subscriptions[subId]

    logInfo(`${logPrefix} step:[PS:UNSUBSCRIBE] topic:[${triggerName}]`)

    delete this.subscriptions[subId]
    this.ee.removeListener(triggerName, onMessage)

    // if last subscriber, call on last subscribe
    /*
      log unregisterbackend from conid subid backendid
    */
    const isLastSubscriber = this.ee.listenerCount(triggerName) === 0
    if (isLastSubscriber) {
      // TODO : unregister logInfo requestId with psregid
      const { id: pubsubBackendRegistrationId, callback } =
        this.backendUnregisterHandles[triggerName]
      const pubsubBackendLogPrefix = `psregid:[${pubsubBackendRegistrationId}]`
      logInfo(
        `${logPrefix} step:[PS:UNREGISTER_BACKEND] topic:[${triggerName}] ${pubsubBackendLogPrefix}`,
      )

      runWithRequestId(pubsubBackendLogPrefix, callback)
    }
  }

  setRegisterBackend(
    registerBackend: (
      triggerName: string,
      pubsubBackendRegistrationId: string,
    ) => () => void,
  ) {
    this.registerBackend = registerBackend
  }
}

export const instance = new PubSub()

/*
    subscribe from inside subscribe resolvers!

    TODO : log conid subid topic

    read from cls, store to asyncIterator;
*/
export const subscribe = (topic: string | string[]) => {
  const context = getSubscriptionContext()
  return {
    [Symbol.asyncIterator]: () => {
      return new PubSubAsyncIterator(instance, topic, context)
    },
  }
}

export const publish = <T>(topic: string, value: T, id?: string) => {
  const pubsubBackendRegistrationId = id || getPubsubBackendRegistrationId()

  if (!pubsubBackendRegistrationId) {
    throw new Error(
      `Always publish with pubsub registration id for better tracking`,
    )
  }

  logInfo(`step:[PS:PUBLISH] topic:[${topic}]`)
  return instance.publish(topic, {
    id: pubsubBackendRegistrationId,
    value,
  })
}
