import { NextSSRApolloClient } from '@apollo/experimental-nextjs-app-support/ssr'

import { Client } from 'graphql-ws'
export declare global {
  /*
        reason : client module shouldn't import any server code.
        but the context is shared between rsc(uses ssr code) and ssr(uses client code)
        therefore we share graphql client of rsc and ssr by global variable.
    */
  // eslint-disable-next-line no-var
  var getSSRClient: () => NextSSRApolloClient

  // eslint-disable-next-line no-var
  var client: Client
}
