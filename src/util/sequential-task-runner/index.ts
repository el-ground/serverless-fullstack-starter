/*
    runs heavy tasks non-parallel.

    Be careful of deadlock.
    Must not place operations that are dependent to each other in the task runner.
*/

export class SequentialTaskRunner {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  taskQueue: (() => Promise<any>)[]

  constructor() {
    this.taskQueue = []
  }

  async startExecution() {
    while (this.taskQueue.length) {
      const task = this.taskQueue[0]
      // eslint-disable-next-line no-await-in-loop
      await task()

      this.taskQueue.shift()
    }
  }

  // receives a function, not a promise.
  run<T>(task: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      const wrapper = async () => {
        try {
          resolve(await task())
        } catch (e) {
          reject(e)
        }
      }

      this.taskQueue.push(wrapper)

      if (this.taskQueue.length === 1) {
        // i'm the only one!
        this.startExecution()
      }
    })
  }
}
