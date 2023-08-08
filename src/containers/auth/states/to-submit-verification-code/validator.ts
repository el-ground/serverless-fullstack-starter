import type { FormValidator } from '@hooks/use-form/types'
import type { VerificationCodeSubmitFormInput } from './types'
import { applyValidators } from '@/src/hooks/use-form/validators'

export const errorMessages = {
  empty: `입력해주세요`,
}

export type ValidatorErrorCodes = keyof typeof errorMessages

export const validator: FormValidator<
  VerificationCodeSubmitFormInput,
  ValidatorErrorCodes
> = (input) => {
  //
  const errors = applyValidators<
    VerificationCodeSubmitFormInput,
    ValidatorErrorCodes
  >(input, {
    verificationCode: (verificationCode) => {
      // visible to user
    },
  })

  return errors
}
