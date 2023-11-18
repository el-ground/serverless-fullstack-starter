'use client'
import React from 'react'
import { useMutation, ErrorMessages, gql } from '@framework/apollo/client'
import { useForm } from '@hooks/use-form'
import {
  VerificationCodeSubmitError,
  VerificationCodeSubmitInput,
} from '@types'
import { validator, errorMessages, ValidatorErrorCodes } from './validator'
import { VerificationCodeSubmitFormInput } from './types'

const SUBMIT_VERIFICATION_CODE_SUBMIT = gql(`
  mutation submitVerificationCodeSubmit($input: VerificationCodeSubmitInput!) {
    Auth_verificationCodeSubmit(input: $input) {
      verificationCodeSubmitToken
    }
  }
`)

const mutationErrorMessages: ErrorMessages<VerificationCodeSubmitError> = {
  [VerificationCodeSubmitError.RateLimited]: `최대 시도 횟수를 초과하였습니다. 1분 뒤에 다시 시도해주세요.`,
  [VerificationCodeSubmitError.InvalidVerificationState]: `Invalid State`,
  [VerificationCodeSubmitError.VerificationCodeMismatch]: `인증번호가 다릅니다.`,
  [VerificationCodeSubmitError.VerificationTimeExpired]: `인증 시간을 초과하였습니다. 인증번호를 다시 요청해주세요.`,
}

const defaultContent = {
  verificationCode: ``,
}

/*
  TODO : resubmit
*/
export const ToSubmitVerificationCode = ({
  verificationCodeRequestToken,
  onSuccess,
}: {
  verificationCodeRequestToken: string
  onSuccess: (verificationCodeSubmitToken: string) => void
}) => {
  const [submit] = useMutation(SUBMIT_VERIFICATION_CODE_SUBMIT, {
    knownErrorMessages: mutationErrorMessages,
    onCompleted: (data) => {
      onSuccess(data.Auth_verificationCodeSubmit.verificationCodeSubmitToken)
    },
  })

  const {
    // canSubmit,
    // helperTexts,
    // errors,
    content,
    setContent,
    submit: onSubmit,
  } = useForm<
    VerificationCodeSubmitFormInput,
    ValidatorErrorCodes,
    VerificationCodeSubmitInput
  >({
    validator,
    errorMessages,
    sanitizer: (input) => {
      return {
        verificationCode: input.verificationCode,
        verificationCodeRequestToken,
      }
    },
    defaultContent,
    submit: (input) => submit({ variables: { input } }),
  })

  return (
    <form id="to-submit-verification-code" onSubmit={() => onSubmit()}>
      <input
        id="to-submit-verification-code-verification-code"
        type="text"
        autoComplete="one-time-code"
        value={content.verificationCode}
        onChange={(e) => setContent(`verificationCode`, e.target.value)}
      />
      <button type="submit">인증번호 제출</button>
    </form>
  )
}
