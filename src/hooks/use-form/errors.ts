/*
    All form validation errors should be known and registered here.

    Why?
    In order to make validators throwing errors to known type,
    we need to either
    1. infer errors from validators
    2. define errors

    Unlike mutations, defining errors for current validators will cause 
    great redundancy. isString, etc.
    Therefore we group all errors and defind all validators statically.
*/

export enum FormValidationError {
  EMPTY,
  AUTH_INVALID_ACCOUNT_TYPE,
}
