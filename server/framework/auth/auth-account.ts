export interface AuthAccount {
  authId: string
  // current implementation doesnt support single authId - multiple user
  // in order to support multiple user with single auth-account, we need to add a feature to upgrade token when changing/selecting user
  defaultUserId: string
  // userIds : string[]
  pwhash: string
  // add pwhash history to check if changed password is same as previous one.
}
