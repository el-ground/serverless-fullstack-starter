import { VerificationCodeSubmitInput } from '#types'
import { InputSanitizer, InputValidator } from '@/schema/types'

export const validate: InputValidator<VerificationCodeSubmitInput> = (
  input,
) => {
  //
  return null
}

export const sanitize: InputSanitizer<VerificationCodeSubmitInput> = (
  input,
) => {
  return input
}

/*
    validation : at client : FormValidator
*/
