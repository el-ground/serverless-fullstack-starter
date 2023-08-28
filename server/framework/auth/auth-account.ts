// If you want to support multiple accounts x multiple users,
// you might think about delete-account
export interface AuthAccount {
  authId: string
  // current implementation doesnt support single authId - multiple user
  // in order to support multiple user with single auth-account, we need to add a feature to upgrade token when changing/selecting user
  defaultUserId: string
  // userIds : string[]
  // add pwhash history to check if changed password is same as previous one.
  pwhash: string
  // set revoked to true on account delete
  revoked: boolean
  // revokedAtSeconds : number
}
