import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema/**/*.gql',
  documents: ['src/**/*.tsx', `src/**/*.ts`],
  generates: {
    'schema/__generated__/server/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        useIndexSignature: true,
        contextType: '../../../server/framework/apollo/context#Context',
      },
    },
    'schema/__generated__/server/introspection.json': {
      plugins: ['introspection'],
      config: {
        minify: true,
      },
    },
    'schema/__generated__/client/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
}

export default config
