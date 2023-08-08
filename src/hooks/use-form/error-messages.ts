import { FormValidationError as E } from './errors'

// tree shaking?? hmm....
export const errorMessages: Record<E, string> = {
  [E.EMPTY]: `항목이 비어있어요!`,
  [E.AUTH_INVALID_ACCOUNT_TYPE]: `잘못된 계정 타입입니다`,
}
