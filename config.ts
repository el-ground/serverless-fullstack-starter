/*
  contains configuration for endpoints, database etc.
*/
export const getOrigin = () => {
  if (process.env.NODE_ENV === `production`) {
    return 'http://localhost:3000' // change to production domain!!
  }

  return 'http://localhost:3000'
}

export const getCORSAllosOrigins = (): readonly string[] => {
  /*
    "http://localhost:3000",
    "https://your-domain.com"
  */
  return []
}
