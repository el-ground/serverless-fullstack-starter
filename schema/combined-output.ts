/* eslint-disable */
export const combinedString = `-----COMBINEDGRAPHQLDELIMITER-----
type Query
type Mutation
type Subscription
-----COMBINEDGRAPHQLDELIMITER-----
enum AccountType {
  SELLER
  USER
}

type UserPublicFields {
  nickname: String!
  accountType: AccountType!
  deleted: Boolean!
  deletedAtSeconds: Int
}

type UserPrivateFields {
  isAdmin: Boolean!
}

type User {
  userId: String!
  public: UserPublicFields!
  private: UserPrivateFields!
}
-----COMBINEDGRAPHQLDELIMITER-----
input NicknameExistsInput {
  nickname: String!
}

type NicknameExistsOutput {
  exists: Boolean!
  sanitizedNickname: String!
}

extend type Query {
  User_nicknameExists(input: NicknameExistsInput!): NicknameExistsOutput!
}
-----COMBINEDGRAPHQLDELIMITER-----
extend type Mutation {
  User_deleteAccount: Boolean
}
-----COMBINEDGRAPHQLDELIMITER-----
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# both server and client and database should agree to this
# be aware that either types or database can change. there's no strict guarantee that on the type.
type Book {
  id: String
  title: String
  author: String
}

extend type Query {
  Book_books: [Book]
  Book_book(id: String!): Book
}

extend type Mutation {
  Book_addBook(title: String!, author: String!): Book
}

# testing subscription
type BookPingResult {
  message: String!
}

extend type Subscription {
  Book_ping: BookPingResult! # testing subscription
}
-----COMBINEDGRAPHQLDELIMITER-----
# Methods that require verification code
enum VerificationRequiredAuthMethod {
  SIGN_IN
  SIGN_UP
  PASSWORD_RESET
}

# list verification service types you use!
enum VerificationService {
  BIZMSG_SMS
  BIZMSG_ALIMTALK
  # EMAIL
}

enum VerificationCodeState {
  VERIFICATION_CODE_REQUEST
  VERIFICATION_CODE_SUBMIT
}

enum AuthProviderService {
  KAKAO
}
-----COMBINEDGRAPHQLDELIMITER-----
input VerificationCodeSubmitInput {
  verificationCodeRequestToken: String!
  verificationCode: String!
}

type VerificationCodeSubmitOutput {
  verificationCodeSubmitToken: String!
}

enum VerificationCodeSubmitError {
  VERIFICATION_TIME_EXPIRED
  INVALID_VERIFICATION_STATE
  VERIFICATION_CODE_MISMATCH
  RATE_LIMITED
}

extend type Mutation {
  Auth_verificationCodeSubmit(
    input: VerificationCodeSubmitInput!
  ): VerificationCodeSubmitOutput!
}
-----COMBINEDGRAPHQLDELIMITER-----
input VerificationCodeRequestInput {
  method: VerificationRequiredAuthMethod!
  verificationService: VerificationService!
  authId: String! # request verification for the following authId
}

type VerificationCodeRequestOutput {
  verificationCodeRequestToken: String!
}

enum VerificationCodeRequestError {
  RATE_LIMITED
}

extend type Mutation {
  Auth_verificationCodeRequest(
    input: VerificationCodeRequestInput!
  ): VerificationCodeRequestOutput!
}
-----COMBINEDGRAPHQLDELIMITER-----
input UpgradeInput {
  service: AuthProviderService!
  token: String!
}

type UpgradeOutput {
  user: User!
  created: Boolean!
}

enum UpgradeError {
  TokenVerificationFail
}

extend type Mutation {
  Auth_upgrade(input: UpgradeInput!): UpgradeOutput!
}
-----COMBINEDGRAPHQLDELIMITER-----
input SignUpInput {
  # authId provided via verificationCodeSubmitToken
  password: String!
  nickname: String!
  accountType: AccountType!
  verificationCodeSubmitToken: String!
}

type SignUpOutput {
  user: User!
}

enum SignUpError {
  VERIFICATION_TIME_EXPIRED
  INVALID_METHOD
  INVALID_STATE
  ACCOUNT_ALREADY_EXISTS
  NICKNAME_ALREADY_EXISTS
  RATE_LIMITED
}

extend type Mutation {
  Auth_signUp(input: SignUpInput!): SignUpOutput!
}
-----COMBINEDGRAPHQLDELIMITER-----
input SignInInput {
  authId: String! # can be phoneNumber, email, or userId, etc.
  password: String!
}

type SignInOutput {
  user: User!
}

enum SignInError {
  INVALID_PASSWORD_OR_USER_DOESNT_EXIST
  RATE_LIMITED
}

extend type Mutation {
  Auth_signIn(input: SignInInput!): SignInOutput!
}
-----COMBINEDGRAPHQLDELIMITER-----
input PasswordResetInput {
  newPassword: String!
  verificationCodeSubmitToken: String!
}

type PasswordResetOutput {
  user: User!
}

enum PasswordResetError {
  VERIFICATION_TIME_EXPIRED
  INVALID_METHOD
  INVALID_STATE
  RATE_LIMITED
  ACCOUNT_NOT_EXISTS
}

extend type Mutation {
  Auth_passwordReset(input: PasswordResetInput!): PasswordResetOutput!
}
-----COMBINEDGRAPHQLDELIMITER-----
extend type Mutation {
  Auth_logOut: Boolean
}
-----COMBINEDGRAPHQLDELIMITER-----
input AuthAccountExistsInput {
  # authId provided via verificationCodeSubmitToken
  verificationCodeSubmitToken: String!
}

type AuthAccountExistsOutput {
  exists: Boolean!
  sanitizedAuthId: String!
}

enum AuthAccountExistsError {
  VERIFICATION_TIME_EXPIRED
  INVALID_STATE
}

extend type Query {
  Auth_authAccountExists(
    input: AuthAccountExistsInput!
  ): AuthAccountExistsOutput!
}
`