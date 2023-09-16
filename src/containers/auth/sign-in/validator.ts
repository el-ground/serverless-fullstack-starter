import type { FormValidator } from '@hooks/use-form/types'
import type { SignInFormInput } from './types'
import { applyValidators } from '@/src/hooks/use-form/validators'

export const errorMessages = {
  empty: `입력해주세요`,
}

export type ValidatorErrorCodes = keyof typeof errorMessages

export const validator: FormValidator<SignInFormInput, ValidatorErrorCodes> = (
  input,
) => {
  //
  const errors = applyValidators<SignInFormInput, ValidatorErrorCodes>(input, {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    authId: (authId) => {
      // visible to user
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: (password) => {
      // visible to user
    },
  })

  return errors
}
