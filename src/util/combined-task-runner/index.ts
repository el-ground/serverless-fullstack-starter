/*
    wait for a method;

    multiple calls wait;

    not being precise; bad error handling;
    upgrade later :)
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Resolver = [() => void, (e: any) => void]

export class CombinedTaskRunner {
  waitList: Resolver[]
  isRunning: boolean
  method: (() => Promise<void>) | null
  constructor(method: () => Promise<void>) {
    this.waitList = []
    this.isRunning = false
    this.method = method
  }

  async run() {
    if (this.isRunning) {
      return new Promise<void>((resolve, reject) => {
        this.waitList.push([resolve, reject])
      })
    } else {
      this.isRunning = true
      try {
        await this.method?.()
      } catch (e) {
        this.waitList.forEach(([, reject]) => reject(e))
      }

      this.waitList.forEach(([resolve]) => resolve())
      this.isRunning = false
    }
  }
}
