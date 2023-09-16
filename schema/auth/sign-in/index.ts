import { SignInInput } from '#types'
import { InputValidator, InputSanitizer } from '@/schema/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const validate: InputValidator<SignInInput> = (input) => {
  //
  return null
}

export const sanitize: InputSanitizer<SignInInput> = (input) => {
  return input
}

/*
    validation : at client : FormValidator
*/
