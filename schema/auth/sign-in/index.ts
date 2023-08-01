import { SignInInput } from '#types'
import { InputValidator, InputSanitizer } from '@/schema/types'

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
