/*
    combine and generate a module!
    run after graphql codegen!
*/

import { globSync } from 'glob'
import { readFileSync, writeFileSync } from 'node:fs'

console.log(`combining gql files`)

const typeDefPaths = globSync('./schema/**/*.gql')
const typeDefs = []
for (let i = 0; i < typeDefPaths.length; i += 1) {
  const path = typeDefPaths[i]
  console.log(`${i}: ${path}`)
  const typeDef = readFileSync(path, { encoding: `utf-8` })
  typeDefs.push(typeDef)
}

/*
    append them. 
    delimiter must end with a newline;
*/
const delimiter = `-----COMBINEDGRAPHQLDELIMITER-----\n`

// append delimiter to the first line
const combinedGQLString = `${delimiter}${typeDefs.join(delimiter)}`
if (combinedGQLString.includes('`')) {
  console.error(
    `gql must not include backtick; if it's necessary, find another way`,
  )
  throw new Error(`gql must not include backtick`)
}

const fileContent = `export const combinedString = \`${combinedGQLString}\``
writeFileSync(`./schema/combined-output.ts`, fileContent)

console.log(
  `combined ${typeDefPaths.length} gql files to schema/combined-output.ts`,
)
