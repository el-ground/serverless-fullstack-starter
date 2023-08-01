import { NicknameExistsInput } from '#types'
import { InputSanitizer, InputValidator } from '@/schema/types'

export const validate: InputValidator<NicknameExistsInput> = (input) => {
  //
  return null
}

export const sanitize: InputSanitizer<NicknameExistsInput> = (input) => {
  return input
}
