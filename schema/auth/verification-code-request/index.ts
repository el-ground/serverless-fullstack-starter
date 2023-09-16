import { VerificationCodeRequestInput } from '#types'
import { InputSanitizer, InputValidator } from '@/schema/types'

export const validate: InputValidator<VerificationCodeRequestInput> = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input,
) => {
  //
  return null
}

export const sanitize: InputSanitizer<VerificationCodeRequestInput> = (
  input,
) => {
  return input
}

/*
    validation : at client : FormValidator
*/
