'use client'
import React from 'react'
import { useMutation, ErrorMessages, gql } from '@framework/apollo/client'
import {
  VerificationRequiredAuthMethod,
  VerificationCodeRequestError,
  VerificationCodeRequestInput,
  VerificationService,
} from '@types'
import { useForm } from '@hooks/use-form'
import { validator, errorMessages, ValidatorErrorCodes } from './validator'
import type { VerificationCodeRequestFormInput } from './types'

const SUBMIT_VERIFICATION_CODE_REQUEST = gql(`
  mutation submitVerificationCodeRequest($input: VerificationCodeRequestInput!) {
    Auth_verificationCodeRequest(input: $input) {
      verificationCodeRequestToken
    }
  }
`)

const mutationErrorMessages: ErrorMessages<VerificationCodeRequestError> = {
  [VerificationCodeRequestError.RateLimited]: `최대 시도 횟수를 초과하였습니다. 1분 뒤에 다시 시도해주세요.`,
}

const defaultContent = {
  authId: ``,
}

/*
  TODO : resend
  TODO : switch service (sms)
*/
export const ToRequestVerificationCode = ({
  onSuccess,
  method,
}: {
  onSuccess: (verificationCodeRequestToken: string) => void
  method: VerificationRequiredAuthMethod
}) => {
  const [submit] = useMutation(SUBMIT_VERIFICATION_CODE_REQUEST, {
    knownErrorMessages: mutationErrorMessages,
    onCompleted: (data) => {
      onSuccess(data.Auth_verificationCodeRequest.verificationCodeRequestToken)
    },
  })

  const {
    //    canSubmit,
    //    helperTexts,
    //    errors,
    content,
    setContent,
    submit: onSubmit,
  } = useForm<
    VerificationCodeRequestFormInput,
    ValidatorErrorCodes,
    VerificationCodeRequestInput
  >({
    validator,
    errorMessages,
    sanitizer: (input) => {
      return {
        authId: input.authId,
        method,
        verificationService: VerificationService.BizmsgAlimtalk,
      }
    },
    defaultContent,
    submit: (input) => submit({ variables: { input } }),
  })

  // MUST_IMPLEMENT current id format is phone number, national
  return (
    <form id="to-request-verification-code" onSubmit={onSubmit}>
      <input
        id="to-request-verification-code-auth-id"
        type="tel"
        autoComplete="tel-national"
        value={content.authId}
        onChange={(e) => setContent(`authId`, e.target.value)}
      />
      <button type="submit">인증번호 요청</button>
    </form>
  )
}
