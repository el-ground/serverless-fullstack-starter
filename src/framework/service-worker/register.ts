'use client'

export const register = async () => {
  if (navigator && 'serviceWorker' in navigator) {
    console.log(`@framework/service-worker: registering service worker;`)
    return navigator.serviceWorker.register(`sw.js`)
  } else {
    console.log(`@framework/service-worker: service worker not registerable;`)
  }
}
