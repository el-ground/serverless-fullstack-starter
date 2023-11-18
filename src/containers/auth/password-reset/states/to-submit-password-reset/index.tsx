'use client'
import React from 'react'
import { useMutation, ErrorMessages, gql } from '@framework/apollo/client'
import { PasswordResetError, PasswordResetInput } from '@types'
import type { PasswordResetFormInput } from './types'
import { useForm } from '@hooks/use-form'
import { validator, errorMessages, ValidatorErrorCodes } from './validator'

const SUBMIT_PASSWORD_RESET = gql(`
  mutation submitPasswordReset($input: PasswordResetInput!) {
    Auth_passwordReset(input: $input) {
      user {
        userId
      }
    }
  }
`)

const mutationErrorMessages: ErrorMessages<PasswordResetError> = {
  [PasswordResetError.InvalidMethod]: `Invalid method`,
  [PasswordResetError.InvalidState]: `Invalid state`,
  [PasswordResetError.RateLimited]: `최대 시도 횟수를 초과하였습니다. 1분 뒤에 다시 시도해주세요.`,
  [PasswordResetError.VerificationTimeExpired]: `인증 시간이 만료되었습니다.`,
  [PasswordResetError.AccountNotExists]: `계정이 존재하지 않습니다.`,
}

const defaultContent = {
  newPassword: ``,
  newPasswordConfirm: ``,
}

/*
  TODO : account not exists
*/
export const ToSubmitPasswordReset = ({
  onSuccess,
  verificationCodeSubmitToken,
}: {
  onSuccess: () => void
  verificationCodeSubmitToken: string
}) => {
  const [submit] = useMutation<PasswordResetError>(SUBMIT_PASSWORD_RESET, {
    knownErrorMessages: mutationErrorMessages,
    onCompleted: onSuccess,
  })
  const {
    // canSubmit,
    // helperTexts,
    // errors,
    content,
    setContent,
    submit: onSubmit,
  } = useForm<PasswordResetFormInput, ValidatorErrorCodes, PasswordResetInput>({
    validator,
    errorMessages,
    sanitizer: (input) => {
      return {
        newPassword: input.newPassword,
        verificationCodeSubmitToken,
      }
    },
    defaultContent,
    submit: (input) => submit({ variables: { input } }),
  })

  return (
    <form id="to-submit-password-reset" onSubmit={() => onSubmit()}>
      <input
        id="password-reset-new-password"
        type="password"
        autoComplete="new-password"
        value={content.newPassword}
        onChange={(e) => setContent(`newPassword`, e.target.value)}
      />
      <input
        id="password-reset-new-password-confirm"
        type="password"
        autoComplete="new-password"
        value={content.newPasswordConfirm}
        onChange={(e) => setContent(`newPasswordConfirm`, e.target.value)}
      />
      <button type="submit">비밀번호 변경</button>
    </form>
  )
}
