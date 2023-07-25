import React from 'react'
import { useAsyncCallback } from '@hooks/use-async-callback'
import {
  useSynchronousState,
  ObjectFieldEditor,
} from '@hooks/use-synchronous-state'
import { asyncCatch } from '@/src/util/async-catch'
import { useGetter } from '@hooks/use-getter'
import { useGetIsMounted } from '@hooks/use-get-is-mounted'
import type {
  FormValidator,
  FormSanitizer,
  FormInputs,
  FormErrors,
  FormHelperTexts,
  FormFieldKey,
  FormFieldKeys,
  FormFieldInput,
  PartialEntries,
} from './types'

/*
  Form is settled!

  T : type of sanitized data that will be passed to the server. 
    Mostly the shape is a dictionary. 
    Nested structure not supported.
      - nested structure is hard to represent in the form UI.

  validator : generates error
  sanitizer : FieldValues are string or boolean(checkbox) or etc, not compatible with T. 
    sanitizer makes the data compatible with T.
  
  submit : 
    feeds T, returns R, the updated model state.
    

*/

interface UseFormProps<FormFields, SubmitInput, SubmitResult> {
  errorMessages: {
    [code: string]: string
  } | null
  validator: FormValidator<FormFields>
  sanitizer: FormSanitizer<FormFields, SubmitInput>
  defaultContent?: FormInputs<FormFields>
  canSubmitDefault?: boolean
  submit: (fieldsContent: SubmitInput) => Promise<SubmitResult> | SubmitResult
  onSuccess?: (result: SubmitResult) => void
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onFail?: (error: any) => void
  computeChangeDiff?: (
    currentContent: FormInputs<FormFields>,
    defaultContent: FormInputs<FormFields>,
  ) => boolean
}

export const useForm = <FormFields, SubmitInput, SubmitResult>({
  errorMessages, // wrong dependency?
  validator,
  sanitizer,
  defaultContent: defaultContent_,
  onFail,
  onSuccess,
  canSubmitDefault = false,
  submit,
  computeChangeDiff,
}: UseFormProps<FormFields, SubmitInput, SubmitResult>): {
  // return type
  hasSubmitted: boolean
  canSubmit: boolean
  validationPassed: boolean
  isSubmitting: boolean
  hasChanged: boolean
  cannotSubmitBecauseHasNotChanged: boolean
  errors: FormErrors<FormFields>
  helperTexts: FormHelperTexts<FormFields>
  setContent: ObjectFieldEditor<FormInputs<FormFields>>
  content: FormInputs<FormFields>
  submit: (e?: React.FormEvent<HTMLFormElement>) => void
  getOnFieldChange: (
    fieldName: FormFieldKey<FormFields>,
    defaultValue?: FormFieldInput<FormFields>,
  ) => (value?: FormFieldInput<FormFields>) => void // not necessarily needed
} => {
  const defaultContent = React.useMemo<FormInputs<FormFields>>(() => {
    if (defaultContent_) {
      return defaultContent_
    }

    return {} // only updates when defaultContent_
  }, [defaultContent_])

  const getIsMounted = useGetIsMounted()
  const [contentBox, , setContent] = useSynchronousState<
    FormInputs<FormFields>
  >(defaultContent, true)
  const content = contentBox.current

  const [hasSubmitted, setHasSubmitted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const getPostSubmitArgs = useGetter({
    onSuccess,
    onFail,
  })

  const hasChanged = React.useMemo(() => {
    if (computeChangeDiff) {
      return computeChangeDiff(content, defaultContent)
    }
    let hasChanged = false
    ;(
      Object.keys({
        ...defaultContent,
        ...content,
      }) as FormFieldKeys<FormFields>
    ).forEach((key) => {
      if (content[key] !== defaultContent[key]) {
        hasChanged = true
      }
    })
    return hasChanged
  }, [content, defaultContent, computeChangeDiff])

  const validationPassed = React.useMemo(() => {
    const validatResult = validator(content)
    if (!validatResult) return true

    let validatePass = true
    Object.values(validatResult).forEach((fieldValidateResult) => {
      if (fieldValidateResult) {
        validatePass = false
      }
    })

    return validatePass
  }, [content, validator])

  const [canSubmit, cannotSubmitBecauseHasNotChanged] = React.useMemo(() => {
    // validation passed has priority
    if (!validationPassed) {
      return [validationPassed, false]
    }

    // then, check for change
    if (!canSubmitDefault) {
      if (!hasChanged) {
        return [false, true]
      }
    }

    return [validationPassed, false]
  }, [validationPassed, canSubmitDefault, hasChanged])

  const onSubmitButton = useAsyncCallback(
    async (e) => {
      if (e) {
        e.preventDefault()
      }

      if (isSubmitting) {
        return
      }

      setHasSubmitted(true)

      if (!canSubmit) {
        return
      }
      setIsSubmitting(true)

      const sanitizedContent = sanitizer(content)

      const [err, result] = await asyncCatch(
        Promise.resolve(submit(sanitizedContent)),
      )

      // non-react effects can proceed!
      if (getIsMounted()) {
        setIsSubmitting(false)
      }

      const { onSuccess, onFail } = getPostSubmitArgs()

      // call handlers regardless of mount state..?
      // TODO might result in a problem.
      /*
        To call or not to call
        1. call 
          problem if component is unmounted and sets state
        2. don't call <-- more secure
          problem if the handler has specific logic. 
      */
      if (err) {
        if (onFail) {
          console.error(err)
          onFail(err)
        }
      } else if (onSuccess) {
        onSuccess(result)
      }
    },
    [
      sanitizer,
      content,
      isSubmitting,
      canSubmit,
      submit,
      getPostSubmitArgs,
      getIsMounted,
    ],
  )

  const onSubmitButtonWrapper = React.useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      onSubmitButton(e)
    },
    [onSubmitButton],
  )

  const errors = React.useMemo(() => {
    const validateResult = validator(content)
    const errObject: FormErrors<FormFields> = {}
    if (validateResult) {
      ;(
        Object.entries(validateResult) as PartialEntries<FormErrors<FormFields>>
      ).forEach(([k, v]) => {
        if (hasSubmitted || content[k]) {
          errObject[k] = v
        }
      })
    }
    return errObject
  }, [hasSubmitted, content, validator])

  const helperTexts = React.useMemo(() => {
    const result: FormHelperTexts<FormFields> = {}
    ;(Object.entries(errors) as PartialEntries<FormErrors<FormFields>>).forEach(
      ([k, v]) => {
        if (v) {
          if (errorMessages) {
            result[k] = errorMessages[v as string] || v
          } else {
            result[k] = v
          }
        }
        /*
          if typeof v === Array, helperTexts should be also an array.
          Not a general solution, but works for our case right now.

          => hmm, Forms should be flat!!!
        */
        /*
        if (v) {
          if (Array.isArray(v)) {
            const array = [...v]
            if (errorMessages) {
              array.forEach((error, index) => {
                array[index] = errorMessages[error] || error
              })
              result[k] = array
            }
          } else if (errorMessages) {
            result[k] = errorMessages[v as string] || v
          } else {
            result[k] = v
          }
        }
        */
      },
    )
    return result
  }, [errors, errorMessages])

  const getOnFieldChange = React.useCallback(
    (
      fieldName: FormFieldKey<FormFields>,
      defaultValue?: FormFieldInput<FormFields>,
    ) => {
      return (value?: FormFieldInput<FormFields>) => {
        if (typeof defaultValue === `undefined`) {
          setContent(fieldName, value)
        } else {
          setContent(fieldName, defaultValue)
        }
      }
    },
    [setContent],
  )

  return {
    hasSubmitted,
    hasChanged,
    canSubmit,
    cannotSubmitBecauseHasNotChanged,
    validationPassed,
    isSubmitting,
    errors,
    helperTexts,
    setContent,
    content,
    submit: onSubmitButtonWrapper,
    getOnFieldChange, // not necessarily needed
  }
}
