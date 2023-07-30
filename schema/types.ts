/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type InputValidator<Input> = (value: Input) => string | null

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type InputSanitizer<Input> = (value: Input) => Input
