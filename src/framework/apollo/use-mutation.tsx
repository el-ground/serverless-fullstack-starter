/*
    Wrapper for use-mutation
*/
import React from 'react'
import { useMutation as apolloUseMutation } from '@apollo/client'
import type {
  DefaultContext,
  OperationVariables,
  ApolloCache,
  DocumentNode,
  TypedDocumentNode,
  MutationHookOptions,
  ApolloError,
  BaseMutationOptions,
  NoInfer,
  MutationTuple,
} from '@apollo/client'
import { useAsyncCallback } from '@/src/hooks/use-async-callback'
import { Id, toast } from 'react-toastify'
import type { ErrorMessages } from './types'
import { useGetter } from '@hooks/use-getter'

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
    Wrapper for apollo useMutation that includes

    1. Known Error handler
    2. toast message for loading & error & success
    3. single request at a time lock
*/

export const useMutation = <
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>,
  TKnownError extends string = any,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: MutationHookOptions<
    NoInfer<TData>,
    NoInfer<TVariables>,
    TContext,
    TCache
  > & {
    loadingMessage?: string
    successMessage?: string
    knownErrorMessages: ErrorMessages<TKnownError>
    onKnownError?: (error: TKnownError) => void
  },
): MutationTuple<TData, TVariables, TContext, TCache> => {
  const getOptions = useGetter(options)

  const singleRequestLockBox = React.useRef(false)
  const latestLoadingToastIdBox = React.useRef<Id>(``)

  const onCompleted = React.useCallback(
    (data: TData, clientOptions?: BaseMutationOptions) => {
      const { successMessage, onCompleted: _onCompleted } = getOptions()
      //
      const loadingToastId = latestLoadingToastIdBox.current
      if (loadingToastId) {
        // if loading message was open, update!
        if (successMessage) {
          toast.update(loadingToastId, {
            render: successMessage,
            type: toast.TYPE.SUCCESS,
            autoClose: 5000,
          })
        } else {
          // if no success message, just remove loading message
          toast.dismiss(loadingToastId)
        }
      } else if (successMessage) {
        // create success message
        toast.success(successMessage, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
        })
      }

      _onCompleted?.(data, clientOptions)
    },
    [getOptions],
  )

  const onError = React.useCallback(
    (error: ApolloError, clientOptions?: BaseMutationOptions) => {
      const {
        knownErrorMessages,
        onError: _onError,
        onKnownError,
      } = getOptions()

      let errorMessage: string | undefined
      let knownErrorCode: TKnownError | undefined
      if (error.graphQLErrors) {
        // handles first encountered known error;
        for (let i = 0; i < error.graphQLErrors.length; i += 1) {
          const graphQLError = error.graphQLErrors[i]
          const code = graphQLError.extensions.code as string | undefined

          if (code && code in knownErrorMessages) {
            knownErrorCode = code as TKnownError
            errorMessage = knownErrorMessages[knownErrorCode]
            break
          }
        }
      }

      if (!errorMessage) {
        errorMessage = error.message
      }

      const loadingToastId = latestLoadingToastIdBox.current
      if (loadingToastId) {
        toast.update(loadingToastId, {
          render: errorMessage,
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        })
      } else {
        toast.error(errorMessage, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 5000,
        })
      }

      if (knownErrorCode) {
        if (onKnownError) {
          onKnownError?.(knownErrorCode)
          return
        }
      }

      _onError?.(error, clientOptions)
    },
    [getOptions],
  )

  const [fetch, mutationResult] = apolloUseMutation(mutation, {
    ...options,
    onCompleted,
    onError,
  })

  const fetchWrapper = useAsyncCallback(
    async (...params: Parameters<typeof fetch>) => {
      singleRequestLockBox.current = true
      // loading toast
      const { loadingMessage } = getOptions()
      if (loadingMessage) {
        latestLoadingToastIdBox.current = toast.info(loadingMessage, {
          autoClose: false,
          position: toast.POSITION.BOTTOM_CENTER,
        })
      }
      const fetchResult = await fetch(...params)
      singleRequestLockBox.current = false
      return fetchResult
    },
    [fetch, getOptions],
  )

  return [fetchWrapper, mutationResult]
}
