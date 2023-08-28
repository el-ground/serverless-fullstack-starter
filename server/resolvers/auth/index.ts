import { Auth_authAccountExists } from './auth-account-exists'
import { Auth_passwordReset } from './password-reset'
import { Auth_signIn } from './sign-in'
import { Auth_signUp } from './sign-up'
import { Auth_logOut } from './log-out'
import { Auth_verificationCodeRequest } from './verification-code-request'
import { Auth_verificationCodeSubmit } from './verification-code-submit'

export const AuthQueries = {
  Auth_authAccountExists,
}

export const AuthMutations = {
  Auth_passwordReset,
  Auth_signIn,
  Auth_signUp,
  Auth_verificationCodeRequest,
  Auth_verificationCodeSubmit,
  Auth_logOut,
}
