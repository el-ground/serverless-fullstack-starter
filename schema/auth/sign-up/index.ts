import { SignUpInput } from '#types'
import { InputSanitizer, InputValidator } from '@/schema/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const validate: InputValidator<SignUpInput> = (input) => {
  //
  return null
}

export const sanitize: InputSanitizer<SignUpInput> = (input) => {
  return input
}
