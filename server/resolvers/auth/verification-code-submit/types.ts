import type { AuthMethod, VerificationCodeState } from '#types'

export interface VerificationCodeSubmitTokenPayload {
  data: {
    requestId: string
    method: AuthMethod
    state: VerificationCodeState
    authId: string
    createdAtMilliseconds: number
    version: string
  }
}

/*


export interface VerificationCodeRequestTokenPayload {
  data: {
    requestId: string
    method: AuthMethod
    verificationService: VerificationService
    authId: string
    state: VerificationCodeState
    createdAtMilliseconds: number // this will be checked at the server.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    servicePayload: any // sendVerificationCode's result object. debug purpose..?
    verificationCode: string
    version: string
  }
}

*/
