import internal from 'stream'

export const streamToPromise = (stream: internal.Stream): Promise<void> => {
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve()
    })

    stream.on('error', (e: Error) => {
      reject(e)
    })
  })
}
