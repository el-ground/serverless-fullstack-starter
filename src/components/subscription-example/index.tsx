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

const PING_SUBSCRIPTION2 = gql(`
    subscription BookPing2 {
        Book_ping {
            message
        }
    }
`)

export const SubscriptionExample = () => {
  const { data, loading } = useSubscription(PING_SUBSCRIPTION)
  useSubscription(PING_SUBSCRIPTION2) // second sub

  if (loading) {
    return `loading subscription; ${loading}`
  }
  return <div>subscription example : {data?.Book_ping.message}</div>
}
