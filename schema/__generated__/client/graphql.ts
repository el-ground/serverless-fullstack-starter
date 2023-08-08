/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum AccountType {
  Seller = 'SELLER',
  User = 'USER'
}

export enum AuthAccountExistsError {
  InvalidState = 'INVALID_STATE',
  VerificationTimeExpired = 'VERIFICATION_TIME_EXPIRED'
}

export type AuthAccountExistsInput = {
  verificationCodeSubmitToken: Scalars['String']['input'];
};

export type AuthAccountExistsOutput = {
  __typename?: 'AuthAccountExistsOutput';
  exists: Scalars['Boolean']['output'];
  sanitizedAuthId: Scalars['String']['output'];
};

export enum AuthMethod {
  PasswordReset = 'PASSWORD_RESET',
  SignIn = 'SIGN_IN',
  SignUp = 'SIGN_UP'
}

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  Auth_passwordReset: PasswordResetOutput;
  Auth_signIn: SignInOutput;
  Auth_signUp: SignUpOutput;
  Auth_verificationCodeRequest: VerificationCodeRequestOutput;
  Auth_verificationCodeSubmit: VerificationCodeSubmitOutput;
  Book_addBook?: Maybe<Book>;
};


export type MutationAuth_PasswordResetArgs = {
  input: PasswordResetInput;
};


export type MutationAuth_SignInArgs = {
  input: SignInInput;
};


export type MutationAuth_SignUpArgs = {
  input: SignUpInput;
};


export type MutationAuth_VerificationCodeRequestArgs = {
  input: VerificationCodeRequestInput;
};


export type MutationAuth_VerificationCodeSubmitArgs = {
  input: VerificationCodeSubmitInput;
};


export type MutationBook_AddBookArgs = {
  author: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type NicknameExistsInput = {
  nickname: Scalars['String']['input'];
};

export type NicknameExistsOutput = {
  __typename?: 'NicknameExistsOutput';
  exists: Scalars['Boolean']['output'];
  sanitizedNickname: Scalars['String']['output'];
};

export enum PasswordResetError {
  AccountNotExists = 'ACCOUNT_NOT_EXISTS',
  InvalidMethod = 'INVALID_METHOD',
  InvalidState = 'INVALID_STATE',
  RateLimited = 'RATE_LIMITED',
  VerificationTimeExpired = 'VERIFICATION_TIME_EXPIRED'
}

export type PasswordResetInput = {
  newPassword: Scalars['String']['input'];
  verificationCodeSubmitToken: Scalars['String']['input'];
};

export type PasswordResetOutput = {
  __typename?: 'PasswordResetOutput';
  user: User;
};

export type Query = {
  __typename?: 'Query';
  Auth_authAccountExists: AuthAccountExistsOutput;
  Book_book?: Maybe<Book>;
  Book_books?: Maybe<Array<Maybe<Book>>>;
  User_nicknameExists: NicknameExistsOutput;
};


export type QueryAuth_AuthAccountExistsArgs = {
  input: AuthAccountExistsInput;
};


export type QueryBook_BookArgs = {
  id: Scalars['String']['input'];
};


export type QueryUser_NicknameExistsArgs = {
  input: NicknameExistsInput;
};

export enum SignInError {
  InvalidPasswordOrUserDoesntExist = 'INVALID_PASSWORD_OR_USER_DOESNT_EXIST',
  RateLimited = 'RATE_LIMITED'
}

export type SignInInput = {
  authId: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInOutput = {
  __typename?: 'SignInOutput';
  user: User;
};

export enum SignUpError {
  AccountAlreadyExists = 'ACCOUNT_ALREADY_EXISTS',
  InvalidMethod = 'INVALID_METHOD',
  InvalidState = 'INVALID_STATE',
  NicknameAlreadyExists = 'NICKNAME_ALREADY_EXISTS',
  RateLimited = 'RATE_LIMITED',
  VerificationTimeExpired = 'VERIFICATION_TIME_EXPIRED'
}

export type SignUpInput = {
  accountType: AccountType;
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  verificationCodeSubmitToken: Scalars['String']['input'];
};

export type SignUpOutput = {
  __typename?: 'SignUpOutput';
  user: User;
};

export type User = {
  __typename?: 'User';
  private: UserPrivateFields;
  public: UserPublicFields;
  userId: Scalars['String']['output'];
};

export type UserPrivateFields = {
  __typename?: 'UserPrivateFields';
  isAdmin: Scalars['Boolean']['output'];
};

export type UserPublicFields = {
  __typename?: 'UserPublicFields';
  accountType: AccountType;
  nickname: Scalars['String']['output'];
};

export enum VerificationCodeRequestError {
  RateLimited = 'RATE_LIMITED'
}

export type VerificationCodeRequestInput = {
  authId: Scalars['String']['input'];
  method: AuthMethod;
  verificationService: VerificationService;
};

export type VerificationCodeRequestOutput = {
  __typename?: 'VerificationCodeRequestOutput';
  verificationCodeRequestToken: Scalars['String']['output'];
};

export enum VerificationCodeState {
  VerificationCodeRequest = 'VERIFICATION_CODE_REQUEST',
  VerificationCodeSubmit = 'VERIFICATION_CODE_SUBMIT'
}

export enum VerificationCodeSubmitError {
  InvalidVerificationState = 'INVALID_VERIFICATION_STATE',
  RateLimited = 'RATE_LIMITED',
  VerificationCodeMismatch = 'VERIFICATION_CODE_MISMATCH',
  VerificationTimeExpired = 'VERIFICATION_TIME_EXPIRED'
}

export type VerificationCodeSubmitInput = {
  verificationCode: Scalars['String']['input'];
  verificationCodeRequestToken: Scalars['String']['input'];
};

export type VerificationCodeSubmitOutput = {
  __typename?: 'VerificationCodeSubmitOutput';
  verificationCodeSubmitToken: Scalars['String']['output'];
};

export enum VerificationService {
  BizmsgAlimtalk = 'BIZMSG_ALIMTALK',
  BizmsgSms = 'BIZMSG_SMS'
}

export type GetBooks2QueryVariables = Exact<{ [key: string]: never; }>;


export type GetBooks2Query = { __typename?: 'Query', Book_books?: Array<{ __typename?: 'Book', author?: string | null } | null> | null };

export type GetBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBooksQuery = { __typename?: 'Query', Book_books?: Array<{ __typename?: 'Book', author?: string | null, title?: string | null } | null> | null };

export type SubmitPasswordResetMutationVariables = Exact<{
  input: PasswordResetInput;
}>;


export type SubmitPasswordResetMutation = { __typename?: 'Mutation', Auth_passwordReset: { __typename?: 'PasswordResetOutput', user: { __typename?: 'User', userId: string } } };

export type SubmitSignIMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SubmitSignIMutation = { __typename?: 'Mutation', Auth_signIn: { __typename?: 'SignInOutput', user: { __typename?: 'User', userId: string } } };

export type SubmitSignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SubmitSignUpMutation = { __typename?: 'Mutation', Auth_signUp: { __typename?: 'SignUpOutput', user: { __typename?: 'User', userId: string } } };

export type SubmitVerificationCodeRequestMutationVariables = Exact<{
  input: VerificationCodeRequestInput;
}>;


export type SubmitVerificationCodeRequestMutation = { __typename?: 'Mutation', Auth_verificationCodeRequest: { __typename?: 'VerificationCodeRequestOutput', verificationCodeRequestToken: string } };

export type SubmitVerificationCodeSubmitMutationVariables = Exact<{
  input: VerificationCodeSubmitInput;
}>;


export type SubmitVerificationCodeSubmitMutation = { __typename?: 'Mutation', Auth_verificationCodeSubmit: { __typename?: 'VerificationCodeSubmitOutput', verificationCodeSubmitToken: string } };


export const GetBooks2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBooks2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Book_books"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}}]}}]}}]} as unknown as DocumentNode<GetBooks2Query, GetBooks2QueryVariables>;
export const GetBooksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Book_books"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<GetBooksQuery, GetBooksQueryVariables>;
export const SubmitPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordResetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Auth_passwordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<SubmitPasswordResetMutation, SubmitPasswordResetMutationVariables>;
export const SubmitSignIDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitSignI"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Auth_signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<SubmitSignIMutation, SubmitSignIMutationVariables>;
export const SubmitSignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Auth_signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<SubmitSignUpMutation, SubmitSignUpMutationVariables>;
export const SubmitVerificationCodeRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitVerificationCodeRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerificationCodeRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Auth_verificationCodeRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verificationCodeRequestToken"}}]}}]}}]} as unknown as DocumentNode<SubmitVerificationCodeRequestMutation, SubmitVerificationCodeRequestMutationVariables>;
export const SubmitVerificationCodeSubmitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitVerificationCodeSubmit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerificationCodeSubmitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Auth_verificationCodeSubmit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verificationCodeSubmitToken"}}]}}]}}]} as unknown as DocumentNode<SubmitVerificationCodeSubmitMutation, SubmitVerificationCodeSubmitMutationVariables>;