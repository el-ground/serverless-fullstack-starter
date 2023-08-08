import type { FormValidator } from '@hooks/use-form/types'
import type { SignUpFormInput } from './types'
import { applyValidators } from '@/src/hooks/use-form/validators'

export const errorMessages = {
  empty: `입력해주세요`,
}

export type ValidatorErrorCodes = keyof typeof errorMessages

export const validator: FormValidator<SignUpFormInput, ValidatorErrorCodes> = (
  input,
) => {
  //
  const errors = applyValidators<SignUpFormInput, ValidatorErrorCodes>(input, {
    nickname: (nickname) => {
      // visible to user
    },
    password: (password) => {
      // visible to user
    },
    passwordConfirm: (passwordConfirm) => {
      // visible to user
    },
  })

  return errors
}
