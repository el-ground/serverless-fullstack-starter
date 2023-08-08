import type { FormValidator } from '@hooks/use-form/types'
import type { VerificationCodeRequestFormInput } from './types'
import { applyValidators } from '@/src/hooks/use-form/validators'

export const errorMessages = {
  empty: `입력해주세요`,
}

export type ValidatorErrorCodes = keyof typeof errorMessages

export const validator: FormValidator<
  VerificationCodeRequestFormInput,
  ValidatorErrorCodes
> = (input) => {
  //
  const errors = applyValidators<
    VerificationCodeRequestFormInput,
    ValidatorErrorCodes
  >(input, {
    authId: (authId) => {
      // visible to user
    },
  })

  return errors
}
