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

export type AuthIdExistsOutput = {
  __typename?: 'AuthIdExistsOutput';
  exists: Scalars['Boolean']['output'];
  sanitizedAuthId: Scalars['String']['output'];
};

export enum AuthMethod {
  PasswordReset = 'PASSWORD_RESET',
  SignIn = 'SIGN_IN',
  SignUp = 'SIGN_UP'
}

export type AuthMutations = {
  __typename?: 'AuthMutations';
  passwordReset: PasswordResetOutput;
  signIn: SignInOutput;
  signUp: SignUpOutput;
  verificationCodeRequest: VerificationCodeRequestOutput;
  verificationCodeSubmit: VerificationCodeSubmitOutput;
};


export type AuthMutationsPasswordResetArgs = {
  input: PasswordResetInput;
};


export type AuthMutationsSignInArgs = {
  input: SignInInput;
};


export type AuthMutationsSignUpArgs = {
  input: SignUpInput;
};


export type AuthMutationsVerificationCodeRequestArgs = {
  input: VerificationCodeRequestInput;
};


export type AuthMutationsVerificationCodeSubmitArgs = {
  input: VerificationCodeSubmitInput;
};

export type AuthQueries = {
  __typename?: 'AuthQueries';
  authIdExists: AuthIdExistsOutput;
};


export type AuthQueriesAuthIdExistsArgs = {
  authId: Scalars['String']['input'];
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type BookMutations = {
  __typename?: 'BookMutations';
  addBook?: Maybe<Book>;
};


export type BookMutationsAddBookArgs = {
  author: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type BookQueries = {
  __typename?: 'BookQueries';
  book?: Maybe<Book>;
  books?: Maybe<Array<Maybe<Book>>>;
};


export type BookQueriesBookArgs = {
  id: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  auth: AuthMutations;
  book: BookMutations;
};

export type NicknameExistsOutput = {
  __typename?: 'NicknameExistsOutput';
  exists: Scalars['Boolean']['output'];
  sanitizedNickname: Scalars['String']['output'];
};

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
  auth: AuthQueries;
  book: BookQueries;
  user: UserQueries;
};

export type SignInInput = {
  authId: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInOutput = {
  __typename?: 'SignInOutput';
  user: User;
};

export type SignUpInput = {
  accountType: AccountType;
  authId: Scalars['String']['input'];
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
  id: Scalars['String']['output'];
  public: UserPublicFields;
};

export type UserPublicFields = {
  __typename?: 'UserPublicFields';
  accountType: AccountType;
};

export type UserQueries = {
  __typename?: 'UserQueries';
  nicknameExists: NicknameExistsOutput;
};


export type UserQueriesNicknameExistsArgs = {
  nickname: Scalars['String']['input'];
};

export type VerificationCodeRequestInput = {
  authId: Scalars['String']['input'];
  method: AuthMethod;
  verificationService: VerificationService;
};

export type VerificationCodeRequestOutput = {
  __typename?: 'VerificationCodeRequestOutput';
  verificationCodeRequestToken: Scalars['String']['output'];
};

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


export type GetBooks2Query = { __typename?: 'Query', book: { __typename?: 'BookQueries', books?: Array<{ __typename?: 'Book', author?: string | null } | null> | null } };

export type GetBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBooksQuery = { __typename?: 'Query', book: { __typename?: 'BookQueries', books?: Array<{ __typename?: 'Book', author?: string | null, title?: string | null } | null> | null } };


export const GetBooks2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBooks2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"book"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"books"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}}]}}]}}]}}]} as unknown as DocumentNode<GetBooks2Query, GetBooks2QueryVariables>;
export const GetBooksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"book"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"books"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<GetBooksQuery, GetBooksQueryVariables>;