/*
    1. log out
    2. session change detect

    not on log in
*/
export const clearAuthSession = (to?: string, replace?: boolean) => {
  window.localStorage.clear()
  if (to) {
    if (replace) {
      window.location.replace(to)
    } else {
      window.location.href = to
    }
  } else {
    window.location.reload()
  }
}
