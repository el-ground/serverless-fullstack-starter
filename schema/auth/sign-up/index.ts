import { SignUpInput } from '#/types'
import { InputSanitizer, InputValidator } from '@/schema/types'

export const validate: InputValidator<SignUpInput> = (input) => {
  //
  return null
}

export const sanitize: InputSanitizer<SignUpInput> = (input) => {
  return input
}

/*
    validation : at client : FormValidator
*/
