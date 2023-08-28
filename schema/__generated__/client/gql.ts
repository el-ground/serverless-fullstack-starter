/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetBooks2 {\n    Book_books {\n        author\n    }\n}": types.GetBooks2Document,
    "\n  query GetBooks {\n      Book_books {\n        author\n        title\n    }\n  }\n": types.GetBooksDocument,
    "\n  mutation submitPasswordReset($input: PasswordResetInput!) {\n    Auth_passwordReset(input: $input) {\n      user {\n        userId\n      }\n    }\n  }\n": types.SubmitPasswordResetDocument,
    "\n  mutation submitSignI($input: SignInInput!) {\n    Auth_signIn(input: $input) {\n      user {\n        userId\n      }\n    }\n  }\n": types.SubmitSignIDocument,
    "\n  mutation submitSignUp($input: SignUpInput!) {\n    Auth_signUp(input: $input) {\n      user {\n        userId\n      }\n    }\n  }\n": types.SubmitSignUpDocument,
    "\n  mutation submitVerificationCodeRequest($input: VerificationCodeRequestInput!) {\n    Auth_verificationCodeRequest(input: $input) {\n      verificationCodeRequestToken\n    }\n  }\n": types.SubmitVerificationCodeRequestDocument,
    "\n  mutation submitVerificationCodeSubmit($input: VerificationCodeSubmitInput!) {\n    Auth_verificationCodeSubmit(input: $input) {\n      verificationCodeSubmitToken\n    }\n  }\n": types.SubmitVerificationCodeSubmitDocument,
    "\n    mutation deleteAccount {\n        User_deleteAccount\n    }\n": types.DeleteAccountDocument,
    "\n    mutation submitLogout {\n        Auth_logOut\n    }\n": types.SubmitLogoutDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBooks2 {\n    Book_books {\n        author\n    }\n}"): (typeof documents)["\n  query GetBooks2 {\n    Book_books {\n        author\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBooks {\n      Book_books {\n        author\n        title\n    }\n  }\n"): (typeof documents)["\n  query GetBooks {\n      Book_books {\n        author\n        title\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation submitPasswordReset($input: PasswordResetInput!) {\n    Auth_passwordReset(input: $input) {\n      user {\n        userId\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation submitPasswordReset($input: PasswordResetInput!) {\n    Auth_passwordReset(input: $input) {\n      user {\n        userId\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation submitSignI($input: SignInInput!) {\n    Auth_signIn(input: $input) {\n      user {\n        userId\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation submitSignI($input: SignInInput!) {\n    Auth_signIn(input: $input) {\n      user {\n        userId\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation submitSignUp($input: SignUpInput!) {\n    Auth_signUp(input: $input) {\n      user {\n        userId\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation submitSignUp($input: SignUpInput!) {\n    Auth_signUp(input: $input) {\n      user {\n        userId\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation submitVerificationCodeRequest($input: VerificationCodeRequestInput!) {\n    Auth_verificationCodeRequest(input: $input) {\n      verificationCodeRequestToken\n    }\n  }\n"): (typeof documents)["\n  mutation submitVerificationCodeRequest($input: VerificationCodeRequestInput!) {\n    Auth_verificationCodeRequest(input: $input) {\n      verificationCodeRequestToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation submitVerificationCodeSubmit($input: VerificationCodeSubmitInput!) {\n    Auth_verificationCodeSubmit(input: $input) {\n      verificationCodeSubmitToken\n    }\n  }\n"): (typeof documents)["\n  mutation submitVerificationCodeSubmit($input: VerificationCodeSubmitInput!) {\n    Auth_verificationCodeSubmit(input: $input) {\n      verificationCodeSubmitToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation deleteAccount {\n        User_deleteAccount\n    }\n"): (typeof documents)["\n    mutation deleteAccount {\n        User_deleteAccount\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation submitLogout {\n        Auth_logOut\n    }\n"): (typeof documents)["\n    mutation submitLogout {\n        Auth_logOut\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;