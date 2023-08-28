'use client'
import React from 'react'
import { useMutation, ErrorMessages, gql } from '@framework/apollo/client'
import { useForm } from '@hooks/use-form'
import { useRouter } from 'next/navigation'
import { SignInError, SignInInput } from '@types'
import type { SignInFormInput } from './types'
import { useRefreshAuth } from '@/src/hooks/use-auth/client'
import { validator, errorMessages, ValidatorErrorCodes } from './validator'

const SUBMIT_SIGN_IN = gql(`
  mutation submitSignIn($input: SignInInput!) {
    Auth_signIn(input: $input) {
      user {
        userId
      }
    }
  }
`)

const mutationErrorMessages: ErrorMessages<SignInError> = {
  [SignInError.InvalidPasswordOrUserDoesntExist]: `비밀번호가 잘못되었거나 존재하지 않는 계정입니다.`,
  [SignInError.RateLimited]: `최대 시도 횟수를 초과하였습니다. 1분 뒤에 다시 시도해주세요.`,
}

const defaultContent = {
  authId: ``,
  password: ``,
}

/*
    id, password -> signin :)
*/

export const SignIn = () => {
  const router = useRouter()
  const refreshAuth = useRefreshAuth()
  const onSuccess = React.useCallback(() => {
    refreshAuth()
    router.replace(`/`)
  }, [router, refreshAuth])

  const [submit] = useMutation<SignInError>(SUBMIT_SIGN_IN, {
    knownErrorMessages: mutationErrorMessages,
    onCompleted: onSuccess,
  })

  const {
    canSubmit,
    helperTexts,
    errors,
    content,
    setContent,
    submit: onSubmit,
  } = useForm<SignInFormInput, ValidatorErrorCodes, SignInInput>({
    validator,
    errorMessages,
    sanitizer: (input) => {
      return {
        authId: input.authId,
        password: input.password,
      }
    },
    defaultContent,
    submit: (input) => submit({ variables: { input } }),
  })

  // MUST_IMPLEMENT current id format is phone number, national
  return (
    <form id="sign-in" onSubmit={onSubmit}>
      <input
        id="sign-in-auth-id"
        type="tel"
        autoComplete="tel-national"
        value={content.authId}
        onChange={(e) => setContent(`authId`, e.target.value)}
      />
      <input
        id="sign-in-password"
        type="password"
        autoComplete="current-password"
        value={content.password}
        onChange={(e) => setContent(`password`, e.target.value)}
      />
      <button type="submit">로그인</button>
    </form>
  )
}
