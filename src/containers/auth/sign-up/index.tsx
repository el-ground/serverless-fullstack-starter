'use client'
import React from 'react'
import { ToRequestVerificationCode } from '../states/to-request-verification-code'
import { ToSubmitVerificationCode } from '../states/to-submit-verification-code'
import { ToSubmitSignUp } from './states/to-submit-sign-up'
import { AuthMethod } from '@types'
import { useUpdateAuth } from '@/src/hooks/use-auth/client'
import { toast } from 'react-toastify'

/*
  requestToken = requestVerificationCode()
  submitToken = submitVerificationCode(requestToken)
  check account exists
  if exists, throw!
  
  password
  newPassword
  nickname
  check nickname exists
  
  signup(submitToken)
*/

enum SignUpState {
  TO_REQUEST_VERIFICATION_CODE,
  TO_SUBMIT_VERIFICATION_CODE,
  TO_SUBMIT_SIGN_UP,
}

export const SignUp = () => {
  const updateAuth = useUpdateAuth()
  const [signUpState, setSignUpState] = React.useState<SignUpState>(
    SignUpState.TO_REQUEST_VERIFICATION_CODE,
  )
  const [verificationCodeRequestToken, setVerificationCodeRequestToken] =
    React.useState(``)
  const [verificationCodeSubmitToken, setVerificationCodeSubmitToken] =
    React.useState(``)

  // eslint-disable-next-line
  const resetStateMachine = React.useCallback(() => {
    setSignUpState(SignUpState.TO_REQUEST_VERIFICATION_CODE)
  }, [])

  const onSuccess = React.useCallback(() => {
    toast.success(`회원가입에 성공했습니다.`, {
      position: toast.POSITION.BOTTOM_CENTER,
    })
    updateAuth(`/`, true)
  }, [updateAuth])

  const currentStateElement = React.useMemo(() => {
    switch (signUpState) {
      case SignUpState.TO_REQUEST_VERIFICATION_CODE:
        return (
          <ToRequestVerificationCode
            method={AuthMethod.SignUp}
            onSuccess={(verificationCodeRequestToken: string) => {
              setVerificationCodeRequestToken(verificationCodeRequestToken)
              setSignUpState(SignUpState.TO_SUBMIT_VERIFICATION_CODE)
            }}
          />
        )
      case SignUpState.TO_SUBMIT_VERIFICATION_CODE:
        return (
          <ToSubmitVerificationCode
            verificationCodeRequestToken={verificationCodeRequestToken}
            onSuccess={(verificationCodeSubmitToken: string) => {
              setVerificationCodeSubmitToken(verificationCodeSubmitToken)
              setSignUpState(SignUpState.TO_SUBMIT_SIGN_UP)
            }}
          />
        )
      case SignUpState.TO_SUBMIT_SIGN_UP:
        return (
          <ToSubmitSignUp
            verificationCodeSubmitToken={verificationCodeSubmitToken}
            onSuccess={onSuccess}
          />
        )
    }
  }, [
    signUpState,
    verificationCodeRequestToken,
    verificationCodeSubmitToken,
    setVerificationCodeRequestToken,
    setVerificationCodeSubmitToken,
    onSuccess,
  ])

  return <div>{currentStateElement}</div>
}
