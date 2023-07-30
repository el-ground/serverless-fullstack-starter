import { authIdExists } from './auth-id-exists'
import { passwordReset } from './password-reset'
import { signIn } from './sign-in'
import { signUp } from './sign-up'
import { verificationCodeRequest } from './verification-code-request'
import { verificationCodeSubmit } from './verification-code-submit'

export const AuthQueries = {
  authIdExists,
}

export const AuthMutations = {
  passwordReset,
  signIn,
  signUp,
  verificationCodeRequest,
  verificationCodeSubmit,
}
