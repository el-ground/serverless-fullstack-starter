/*
  contains configuration for endpoints, database etc.
*/
export const getOrigin = () => {
  if (process.env.NODE_ENV === `production`) {
    return 'https://localhost:3000' // change to production domain!!
  }

  // recommended to dev in secure mode
  return 'https://localhost:3000'
}
