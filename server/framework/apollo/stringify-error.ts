// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringifyError = (extensions: any, error: any) => {
  // 1. formattedError.stacktrace?.join(`\n`) || `` // log
  // 2. formattedError.toString() // gql log
  // 3. formattedError.

  const {
    code = `INTERNAL_SERVER_ERROR`,
    stacktrace,
    ...rest
  } = extensions || {}
  const stringifiedError = error?.toString() || ``
  let stringifiedStacktrace = ``
  try {
    stringifiedStacktrace = (stacktrace as string[]).join(`\n`)
  } catch (e) {
    /* no-op */
  }
  const stringifiedRestExtensions = JSON.stringify(rest, null, 2)
  const fullErrorMessage = `START OF ERROR
------------------------- Code ---------------------------------------

${code}

------------------------- Error.toString() ---------------------------

${stringifiedError}

------------------------- Stack --------------------------------------

${stringifiedStacktrace}

------------------------- JSON.stringify(Extensions, null, 2) --------

${stringifiedRestExtensions}

------------------------- END OF ERROR -------------------------------`

  return fullErrorMessage
}
