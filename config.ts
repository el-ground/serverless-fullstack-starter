/*
  contains configuration for endpoints, database etc.
*/
export const getOrigin = () => {
  if (process.env.NODE_ENV === `production`) {
    return 'http://localhost:3000' // change to production domain!!
  }

  return 'http://localhost:3000'
}
