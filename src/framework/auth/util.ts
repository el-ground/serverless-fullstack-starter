/*
    1. log out
    2. session change detect

    not on log in
*/
export const clearAuthSession = (to?: string) => {
  window.localStorage.clear()
  if (to) {
    window.location.href = to
  } else {
    window.location.reload()
  }
}
