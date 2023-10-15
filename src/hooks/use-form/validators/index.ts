import {
  FormFieldValidator,
  FormErrors,
  PartialEntries,
  FormFieldKey,
} from '../types'

type FormFieldValidatorDict<T, ValidationErrorCode> = {
  [fieldKey in FormFieldKey<T>]?: FormFieldValidator<
    T[fieldKey],
    ValidationErrorCode
  >
}

export const applyValidators = <FormInput, ValidationErrorCode>(
  input: FormInput,
  validators: FormFieldValidatorDict<FormInput, ValidationErrorCode>,
): FormErrors<FormInput, ValidationErrorCode> => {
  const errors: FormErrors<FormInput, ValidationErrorCode> = {}

  const validatorEntries = Object.entries(validators) as PartialEntries<
    FormFieldValidatorDict<FormInput, ValidationErrorCode>
  >
  validatorEntries.forEach(([fieldKey, validator]) => {
    const inputFieldValue = input[fieldKey]
    if (validator) {
      const error = validator(inputFieldValue)
      if (error) {
        errors[fieldKey] = error
      }
    }
  })

  return errors
}
