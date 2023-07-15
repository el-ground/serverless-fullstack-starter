export const splitJWT = (token: string) => {
  /*
    content in javascript part,
    checksum in http part.
    so that javascript client can parse the cookie and use the payloads.

    https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  */

  const sliceAtIndex = token.indexOf(`.`)
  const payload = token.slice(0, sliceAtIndex) // contains the payload
  const rest = token.slice(sliceAtIndex) // contains checksum & etc

  return {
    payload,
    rest,
  }
}
