// import redis from '#src/redis.js'
import { logDebug } from '#util/log'

export const testRateLimiter = async (
  key: string,
  maxCount: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cooldownMs: number,
) => {
  // try each keys
  for (let i = 0; i < maxCount; i += 1) {
    // possible key collision.
    const lockKey = `rate-limiter:${encodeURIComponent(key)}:${i}`

    // MUST_IMPLEMENT
    // const res = await redis.setAsync(lockKey, 1, `PX`, cooldownMs, `NX`)
    const res = true
    if (res) {
      logDebug(`lock ${lockKey} acquired!`)
      return true
    } else {
      logDebug(`lock ${lockKey} in use! proceed`)
    }
  }

  return false
}
