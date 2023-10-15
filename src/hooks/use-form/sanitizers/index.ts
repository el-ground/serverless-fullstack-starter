import { FormFieldSanitizer, PartialEntries, FormFieldKey } from '../types'

type BothDict<T, R> = T | R

type FormFieldSanitizerDict<FormInput, SubmitInput> = {
  [fieldKey in FormFieldKey<
    BothDict<FormInput, SubmitInput>
  >]?: FormFieldSanitizer<FormInput[fieldKey], SubmitInput[fieldKey]>
}

export const applySanitizers = <FormInput, SubmitInput>(
  input: FormInput,
  sanitizers: FormFieldSanitizerDict<FormInput, SubmitInput>,
): SubmitInput => {
  const submitInput: Partial<SubmitInput> = {}

  const sanitizerEntries = Object.entries(sanitizers) as PartialEntries<
    FormFieldSanitizerDict<FormInput, SubmitInput>
  >

  sanitizerEntries.forEach(([fieldKey, sanitizer]) => {
    const inputFieldValue = input[fieldKey]
    if (sanitizer) {
      const sanitizedValue = sanitizer(inputFieldValue)
      submitInput[fieldKey] = sanitizedValue
    } else {
      // if not, just pass
      // not very good typescript;
      submitInput[fieldKey] =
        inputFieldValue as unknown as SubmitInput[keyof SubmitInput &
          keyof FormInput]
    }
  })

  return submitInput as SubmitInput
}
