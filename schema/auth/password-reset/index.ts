import { PasswordResetInput } from '#types'
import { InputSanitizer, InputValidator } from '@/schema/types'

/*
  serversize validator and sanitizers!! 
*/

export const validate: InputValidator<PasswordResetInput> = (input) => {
  //
  return null
}

export const sanitize: InputSanitizer<PasswordResetInput> = (input) => {
  return input
}