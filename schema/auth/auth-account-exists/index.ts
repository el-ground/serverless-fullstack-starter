import { AuthAccountExistsInput } from '#types'
import { InputSanitizer, InputValidator } from '@/schema/types'

export const validate: InputValidator<AuthAccountExistsInput> = (input) => {
  //
  return null
}

export const sanitize: InputSanitizer<AuthAccountExistsInput> = (input) => {
  return input
}

/*
    validation : at client : FormValidator
*/
