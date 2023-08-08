import type { FormValidator } from '@hooks/use-form/types'
import type { PasswordResetFormInput } from './types'
import { applyValidators } from '@/src/hooks/use-form/validators'

export const errorMessages = {
  empty: `입력해주세요`,
}

export type ValidatorErrorCodes = keyof typeof errorMessages

export const validator: FormValidator<
  PasswordResetFormInput,
  ValidatorErrorCodes
> = (input) => {
  //
  const errors = applyValidators<PasswordResetFormInput, ValidatorErrorCodes>(
    input,
    {
      newPassword: (newPassword) => {
        // visible to user
      },
      newPasswordConfirm: (newPasswordConfirm) => {
        //
      },
    },
  )

  return errors
}
