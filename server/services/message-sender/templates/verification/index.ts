import { VerificationService } from '#types'

/* eslint-disable @typescript-eslint/no-unused-vars */
export const sendVerificationCode = async ({
  verificationCode,
  verificationService,
  authId,
}: {
  verificationCode: string
  verificationService: VerificationService
  authId: string
}) => {
  // MUST_IMPLEMENT
  if (process.env.NODE_ENV !== `development`) {
    throw new Error(`not implemented`)
  }

  return {}
}
