import { toast } from 'react-toastify'

let db: IDBDatabase | null = null

export const initialize = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open('preferences', 1)

    request.onupgradeneeded = function () {
      db = this.result

      console.log(`Upgrading to version ${db.version}`)

      if (!db.objectStoreNames.contains(`preferences`)) {
        console.log(`creating objectStore preferences`)
        db.createObjectStore('preferences')
      }
    }

    request.onsuccess = function () {
      db = this.result
      resolve(db)
    }

    request.onerror = function (event) {
      console.error('Error opening IndexedDB', event)
      toast.error(`IndexedDB 연결에 실패했습니다.`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 5000,
      })
      reject(new Error(`Error opening IndexedDB`))
    }
  })

export const get = (key: string): Promise<string | null> =>
  new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error(`Preferences.${key} IndexedDB not initialized!`))
      return
    }

    const request = db
      .transaction(`preferences`)
      .objectStore(`preferences`)
      .get(key)

    request.onsuccess = function () {
      const value = (this.result as string) || null
      resolve(value)
    }

    request.onerror = function (event) {
      console.error(`Error reading preferences.${key}`, event)
      toast.error(`Preferences.${key} 읽기에 실패했습니다.`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 5000,
      })
      reject(new Error(`Error reading preferences.${key}`))
    }
  })

export const set = (key: string, value: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!db) {
      reject(
        new Error(`Preferences.${key}=${value} IndexedDB not initialized!`),
      )
      return
    }

    const request = db
      .transaction(`preferences`)
      .objectStore(`preferences`)
      .add(value, key)

    request.onsuccess = function () {
      resolve()
    }

    request.onerror = function (event) {
      console.error(`Error reading preferences.${key}=${value}`, event)
      toast.error(`Preferences.${key}=${value} 쓰기에 실패했습니다.`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 5000,
      })
      reject(new Error(`Error reading preferences.${key}=${value}`))
    }
  })

export const del = (key: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error(`Preferences.${key} IndexedDB not initialized!`))
      return
    }

    const request = db
      .transaction(`preferences`)
      .objectStore(`preferences`)
      .delete(key)

    request.onsuccess = function () {
      resolve()
    }

    request.onerror = function (event) {
      console.error(`Error reading preferences.${key}`, event)
      toast.error(`Preferences.${key} 삭제에 실패했습니다.`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 5000,
      })
      reject(new Error(`Error reading preferences.${key} `))
    }
  })
