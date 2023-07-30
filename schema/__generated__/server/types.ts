import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../../server/framework/apollo/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccountType: AccountType;
  AuthIdExistsOutput: ResolverTypeWrapper<AuthIdExistsOutput>;
  AuthMethod: AuthMethod;
  AuthMutations: ResolverTypeWrapper<AuthMutations>;
  AuthQueries: ResolverTypeWrapper<AuthQueries>;
  Book: ResolverTypeWrapper<Book>;
  BookMutations: ResolverTypeWrapper<BookMutations>;
  BookQueries: ResolverTypeWrapper<BookQueries>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NicknameExistsOutput: ResolverTypeWrapper<NicknameExistsOutput>;
  PasswordResetInput: PasswordResetInput;
  PasswordResetOutput: ResolverTypeWrapper<PasswordResetOutput>;
  Query: ResolverTypeWrapper<{}>;
  SignInInput: SignInInput;
  SignInOutput: ResolverTypeWrapper<SignInOutput>;
  SignUpInput: SignUpInput;
  SignUpOutput: ResolverTypeWrapper<SignUpOutput>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
  UserPublicFields: ResolverTypeWrapper<UserPublicFields>;
  UserQueries: ResolverTypeWrapper<UserQueries>;
  VerificationCodeRequestInput: VerificationCodeRequestInput;
  VerificationCodeRequestOutput: ResolverTypeWrapper<VerificationCodeRequestOutput>;
  VerificationCodeSubmitInput: VerificationCodeSubmitInput;
  VerificationCodeSubmitOutput: ResolverTypeWrapper<VerificationCodeSubmitOutput>;
  VerificationService: VerificationService;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthIdExistsOutput: AuthIdExistsOutput;
  AuthMutations: AuthMutations;
  AuthQueries: AuthQueries;
  Book: Book;
  BookMutations: BookMutations;
  BookQueries: BookQueries;
  Boolean: Scalars['Boolean']['output'];
  Mutation: {};
  NicknameExistsOutput: NicknameExistsOutput;
  PasswordResetInput: PasswordResetInput;
  PasswordResetOutput: PasswordResetOutput;
  Query: {};
  SignInInput: SignInInput;
  SignInOutput: SignInOutput;
  SignUpInput: SignUpInput;
  SignUpOutput: SignUpOutput;
  String: Scalars['String']['output'];
  User: User;
  UserPublicFields: UserPublicFields;
  UserQueries: UserQueries;
  VerificationCodeRequestInput: VerificationCodeRequestInput;
  VerificationCodeRequestOutput: VerificationCodeRequestOutput;
  VerificationCodeSubmitInput: VerificationCodeSubmitInput;
  VerificationCodeSubmitOutput: VerificationCodeSubmitOutput;
}>;

export type AuthIdExistsOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthIdExistsOutput'] = ResolversParentTypes['AuthIdExistsOutput']> = ResolversObject<{
  exists?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sanitizedAuthId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthMutationsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthMutations'] = ResolversParentTypes['AuthMutations']> = ResolversObject<{
  passwordReset?: Resolver<ResolversTypes['PasswordResetOutput'], ParentType, ContextType, RequireFields<AuthMutationsPasswordResetArgs, 'input'>>;
  signIn?: Resolver<ResolversTypes['SignInOutput'], ParentType, ContextType, RequireFields<AuthMutationsSignInArgs, 'input'>>;
  signUp?: Resolver<ResolversTypes['SignUpOutput'], ParentType, ContextType, RequireFields<AuthMutationsSignUpArgs, 'input'>>;
  verificationCodeRequest?: Resolver<ResolversTypes['VerificationCodeRequestOutput'], ParentType, ContextType, RequireFields<AuthMutationsVerificationCodeRequestArgs, 'input'>>;
  verificationCodeSubmit?: Resolver<ResolversTypes['VerificationCodeSubmitOutput'], ParentType, ContextType, RequireFields<AuthMutationsVerificationCodeSubmitArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthQueriesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthQueries'] = ResolversParentTypes['AuthQueries']> = ResolversObject<{
  authIdExists?: Resolver<ResolversTypes['AuthIdExistsOutput'], ParentType, ContextType, RequireFields<AuthQueriesAuthIdExistsArgs, 'authId'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookMutationsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['BookMutations'] = ResolversParentTypes['BookMutations']> = ResolversObject<{
  addBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<BookMutationsAddBookArgs, 'author' | 'title'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookQueriesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['BookQueries'] = ResolversParentTypes['BookQueries']> = ResolversObject<{
  book?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<BookQueriesBookArgs, 'id'>>;
  books?: Resolver<Maybe<Array<Maybe<ResolversTypes['Book']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  auth?: Resolver<ResolversTypes['AuthMutations'], ParentType, ContextType>;
  book?: Resolver<ResolversTypes['BookMutations'], ParentType, ContextType>;
}>;

export type NicknameExistsOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NicknameExistsOutput'] = ResolversParentTypes['NicknameExistsOutput']> = ResolversObject<{
  exists?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sanitizedNickname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PasswordResetOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PasswordResetOutput'] = ResolversParentTypes['PasswordResetOutput']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  auth?: Resolver<ResolversTypes['AuthQueries'], ParentType, ContextType>;
  book?: Resolver<ResolversTypes['BookQueries'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserQueries'], ParentType, ContextType>;
}>;

export type SignInOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SignInOutput'] = ResolversParentTypes['SignInOutput']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignUpOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SignUpOutput'] = ResolversParentTypes['SignUpOutput']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  public?: Resolver<ResolversTypes['UserPublicFields'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserPublicFieldsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserPublicFields'] = ResolversParentTypes['UserPublicFields']> = ResolversObject<{
  accountType?: Resolver<ResolversTypes['AccountType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserQueriesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserQueries'] = ResolversParentTypes['UserQueries']> = ResolversObject<{
  nicknameExists?: Resolver<ResolversTypes['NicknameExistsOutput'], ParentType, ContextType, RequireFields<UserQueriesNicknameExistsArgs, 'nickname'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerificationCodeRequestOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VerificationCodeRequestOutput'] = ResolversParentTypes['VerificationCodeRequestOutput']> = ResolversObject<{
  verificationCodeRequestToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerificationCodeSubmitOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VerificationCodeSubmitOutput'] = ResolversParentTypes['VerificationCodeSubmitOutput']> = ResolversObject<{
  verificationCodeSubmitToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AuthIdExistsOutput?: AuthIdExistsOutputResolvers<ContextType>;
  AuthMutations?: AuthMutationsResolvers<ContextType>;
  AuthQueries?: AuthQueriesResolvers<ContextType>;
  Book?: BookResolvers<ContextType>;
  BookMutations?: BookMutationsResolvers<ContextType>;
  BookQueries?: BookQueriesResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NicknameExistsOutput?: NicknameExistsOutputResolvers<ContextType>;
  PasswordResetOutput?: PasswordResetOutputResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SignInOutput?: SignInOutputResolvers<ContextType>;
  SignUpOutput?: SignUpOutputResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPublicFields?: UserPublicFieldsResolvers<ContextType>;
  UserQueries?: UserQueriesResolvers<ContextType>;
  VerificationCodeRequestOutput?: VerificationCodeRequestOutputResolvers<ContextType>;
  VerificationCodeSubmitOutput?: VerificationCodeSubmitOutputResolvers<ContextType>;
}>;

