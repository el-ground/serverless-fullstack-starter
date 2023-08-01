export type InputErrors<T> = {
  [fieldKey in keyof T]?: string | null
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type InputValidator<Input> = (value: Input) => InputErrors<Input> | null

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type InputSanitizer<Input> = (value: Input) => Input
