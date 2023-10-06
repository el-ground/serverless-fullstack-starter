/*
    1. log out
    2. session change detect

    not on log in
*/
export const clearAuthSession = () => {
  window.localStorage.clear()
  window.location.reload()
}
