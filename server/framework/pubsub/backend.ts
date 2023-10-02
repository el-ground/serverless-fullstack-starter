import { logInfo } from '#util/log'
import { instance, publish } from './'

/*
    setup pub/sub connections to the backend.
    we don't recommend manually calling pubsub publish without registering.
    TODO MUST_IMPLEMENT

    publish 를 따로 하는게 나을 것 같음. onValue 데리고 다니는 것 보다.
*/

export const registerBackend = (
  triggerName: string,
  // eslint-disable-next-line
  pubsubBackendRegistrationId: string,
) => {
  if (triggerName === `PING_TOPIC`) {
    const handle = setInterval(() => {
      // 이게 됨?

      logInfo(`hello world`)
      publish(`PING_TOPIC`, {
        message: `ping: ${Date.now()}`,
      })
    }, 1000)

    logInfo(`WTF?`)

    return () => {
      logInfo(`unregister!!~~!`)
      //
      clearInterval(handle)
    }
  }

  return () => {
    //
    logInfo(`unregister!!`)
  }
}

instance.setRegisterBackend(registerBackend)
