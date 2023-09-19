import { combinedString } from './combined-output'

const delimiter = combinedString.split('\n', 1)[0]
const splitString = combinedString.split(delimiter)
splitString.splice(0, 1)

/*
    just combined gql files and put them in a module
*/
export const typeDefs = splitString
