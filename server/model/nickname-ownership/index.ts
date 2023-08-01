/*

*/
export interface NicknameOwnership {
  encodedNickname: string // id of the document
  nickname: string
  userId: string
  revoked: boolean
  acquiredAtSeconds: number
  // revokedAtSeconds : number
}
