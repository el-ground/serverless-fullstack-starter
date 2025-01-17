'use client'
import React from 'react'
import { ToRequestVerificationCode } from '../states/to-request-verification-code'
import { ToSubmitVerificationCode } from '../states/to-submit-verification-code'
import { ToSubmitPasswordReset } from './states/to-submit-password-reset'
import { VerificationRequiredAuthMethod } from '@types'
import { useUpdateAuth } from '@/src/hooks/use-auth/client'
import { toast } from 'react-toastify'

/*
  requestToken = requestVerificationCode()
  submitToken = submitVerificationCode(requestToken)
  check account exists
  if not exists, tell that account doesnt exist.
  
  password
  newPassword
  
  passwordReset(submitToken) -> redirect to home
*/

enum PasswordResetState {
  TO_REQUEST_VERIFICATION_CODE, // authIdEnter, requetsVerificationCode
  TO_SUBMIT_VERIFICATION_CODE, // verificationCodeEnter, submitVerificationCode
  TO_SUBMIT_PASSWORD_RESET,
}

export const PasswordReset = () => {
  const updateAuth = useUpdateAuth()
  const [passwordResetState, setPasswordResetState] =
    React.useState<PasswordResetState>(
      PasswordResetState.TO_REQUEST_VERIFICATION_CODE,
    )
  const [verificationCodeRequestToken, setVerificationCodeRequestToken] =
    React.useState(``)
  const [verificationCodeSubmitToken, setVerificationCodeSubmitToken] =
    React.useState(``)

  // eslint-disable-next-line
  const resetStateMachine = React.useCallback(() => {
    setPasswordResetState(PasswordResetState.TO_REQUEST_VERIFICATION_CODE)
  }, [])

  const onSuccess = React.useCallback(() => {
    toast.success(`비밀변호 변경에 성공했습니다.`, {
      position: toast.POSITION.BOTTOM_CENTER,
    })
    updateAuth(`/`)
  }, [updateAuth])

  const currentStateElement = React.useMemo(() => {
    switch (passwordResetState) {
      case PasswordResetState.TO_REQUEST_VERIFICATION_CODE:
        return (
          <ToRequestVerificationCode
            method={VerificationRequiredAuthMethod.PasswordReset}
            onSuccess={(verificationCodeRequestToken: string) => {
              setVerificationCodeRequestToken(verificationCodeRequestToken)
              setPasswordResetState(
                PasswordResetState.TO_SUBMIT_VERIFICATION_CODE,
              )
            }}
          />
        )
      case PasswordResetState.TO_SUBMIT_VERIFICATION_CODE:
        return (
          <ToSubmitVerificationCode
            verificationCodeRequestToken={verificationCodeRequestToken}
            onSuccess={(verificationCodeSubmitToken: string) => {
              setVerificationCodeSubmitToken(verificationCodeSubmitToken)
              setPasswordResetState(PasswordResetState.TO_SUBMIT_PASSWORD_RESET)
            }}
          />
        )
      case PasswordResetState.TO_SUBMIT_PASSWORD_RESET:
        return (
          <ToSubmitPasswordReset
            verificationCodeSubmitToken={verificationCodeSubmitToken}
            onSuccess={onSuccess}
          />
        )
    }
  }, [
    passwordResetState,
    verificationCodeRequestToken,
    verificationCodeSubmitToken,
    setVerificationCodeRequestToken,
    setVerificationCodeSubmitToken,
    onSuccess,
  ])

  // state header should exist : go to prev state or reset.
  return <div>{currentStateElement}</div>
}
