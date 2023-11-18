'use client'
import React from 'react'
import { useMutation, ErrorMessages, gql } from '@framework/apollo/client'
import { AccountType, SignUpError, SignUpInput } from '@types'
import type { SignUpFormInput } from './types'
import { useForm } from '@hooks/use-form'
import { validator, errorMessages, ValidatorErrorCodes } from './validator'

const SUBMIT_SIGN_UP = gql(`
  mutation submitSignUp($input: SignUpInput!) {
    Auth_signUp(input: $input) {
      user {
        userId
      }
    }
  }
`)

const mutationErrorMessages: ErrorMessages<SignUpError> = {
  [SignUpError.AccountAlreadyExists]: `계정이 이미 존재합니다.`,
  [SignUpError.InvalidMethod]: `Invalid method`,
  [SignUpError.InvalidState]: `Invalid state`,
  [SignUpError.NicknameAlreadyExists]: `별명이 이미 사용중입니다.`,
  [SignUpError.RateLimited]: `최대 시도 횟수를 초과하였습니다. 1분 뒤에 다시 시도해주세요.`,
  [SignUpError.VerificationTimeExpired]: `인증 시간이 만료되었습니다.`,
}

const defaultContent = {
  nickname: ``,
  password: ``,
  passwordConfirm: ``,
}

/*
  TODO : useQuery nickname exists
*/
export const ToSubmitSignUp = ({
  onSuccess,
  verificationCodeSubmitToken,
}: {
  onSuccess: () => void
  verificationCodeSubmitToken: string
}) => {
  const [submit] = useMutation<SignUpError>(SUBMIT_SIGN_UP, {
    knownErrorMessages: mutationErrorMessages,
    onCompleted: onSuccess,
  })

  const {
    //    canSubmit,
    //    helperTexts,
    //    errors,
    content,
    setContent,
    submit: onSubmit,
  } = useForm<SignUpFormInput, ValidatorErrorCodes, SignUpInput>({
    validator,
    errorMessages,
    sanitizer: (input) => {
      return {
        accountType: AccountType.User,
        nickname: input.nickname,
        password: input.password,
        verificationCodeSubmitToken,
      }
    },
    defaultContent,
    submit: (input) => submit({ variables: { input } }),
  })

  return (
    <form id="to-submit-sign-up" onSubmit={() => onSubmit()}>
      <input
        id="sign-up-nickname"
        type="text"
        autoComplete="nickname"
        value={content.nickname}
        onChange={(e) => setContent(`nickname`, e.target.value)}
      />
      <input
        id="sign-up-password"
        type="password"
        autoComplete="new-password"
        value={content.password}
        onChange={(e) => setContent(`password`, e.target.value)}
      />
      <input
        id="sign-up-password-confirm"
        type="password"
        autoComplete="new-password"
        value={content.passwordConfirm}
        onChange={(e) => setContent(`passwordConfirm`, e.target.value)}
      />
      <button type="submit">회원가입</button>
    </form>
  )
}
