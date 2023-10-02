// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringifyQuery = (query: string | undefined, variables: any) => {
  return `START OF QUERY
------------------------- Query --------------------------------------

${query}

------------------------- Variables ----------------------------------

${JSON.stringify(variables, null, 2)}

------------------------- END OF QUERY -------------------------------
`
}
