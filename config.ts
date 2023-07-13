/*
  contains configuration for endpoints, database etc.
*/
export const getOrigin = () => {
  if (process.env.NODE_ENV === `production`) {
    return 'https://localhost:8000' // change to production domain!!
  }

  return 'https://localhost:8000'
}
