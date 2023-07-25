export type PartialEntries<T> = Array<[key: keyof T, value: T[keyof T]]>
export type FullEntries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Validator = (value: any) => string | null
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Sanitizer = <T>(value: any) => T

export type FormErrors<T> = {
  [fieldKey in keyof T]?: string | null
}

export type FormInputs<T> = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [fieldKey in keyof T]?: any
}

export type FormValidator<T> = (input: FormInputs<T>) => FormErrors<T> | null
export type FormSanitizer<T, SubmitInput> = (
  input: FormInputs<T>,
) => SubmitInput

export type FormHelperTexts<T> = {
  [fieldKey in keyof T]?: string | null
}

export type FormFieldKey<T> = keyof T
export type FormFieldInput<T> = FormInputs<T>[FormFieldKey<T>]
export type FormFieldKeys<T> = FormFieldKey<T>[]
export type FormFieldInputs<T> = FormFieldInput<T>[]
