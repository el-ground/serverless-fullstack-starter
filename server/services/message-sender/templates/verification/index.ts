import { VerificationService } from '#types'

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
