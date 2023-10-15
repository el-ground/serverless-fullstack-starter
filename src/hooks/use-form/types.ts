export type PartialEntries<T> = Array<[key: keyof T, value: T[keyof T]]>
export type FullEntries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type FormErrors<T, ValidationErrorCode> = {
  [fieldKey in keyof T]?: ValidationErrorCode | null
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type FormFieldValidator<FormFieldInput, ValidationErrorCode> = (
  value: FormFieldInput,
) => ValidationErrorCode | null | void
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type FormFieldSanitizer<FormFieldInput, SubmitFieldInput> = (
  value: FormFieldInput,
) => SubmitFieldInput

export type FormValidator<FormInput, ValidationErrorCode> = (
  input: FormInput,
) => FormErrors<FormInput, ValidationErrorCode> | null
export type FormSanitizer<FormInput, SubmitInput> = (
  input: FormInput,
) => SubmitInput

export type FormHelperTexts<FormInput> = {
  [fieldKey in keyof FormInput]?: string | null
}

export type FormFieldKey<T> = keyof T
export type FormFieldInput<T> = T[FormFieldKey<T>]
export type FormFieldKeys<T> = FormFieldKey<T>[]
export type FormFieldInputs<T> = FormFieldInput<T>[]
