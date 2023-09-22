'use client'
import React from 'react'
import { gql, useSubscription } from '@framework/apollo/client'

const PING_SUBSCRIPTION = gql(`
    subscription BookPing {
        Book_ping {
            message
        }
    }
`)

export const SubscriptionExample = () => {
  const { data, loading } = useSubscription(PING_SUBSCRIPTION)

  if (loading) {
    return `loading subscription; ${loading}`
  }
  return <div>subscription example : {data?.Book_ping.message}</div>
}
