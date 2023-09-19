/*
    return null if not setting any cache-control header.
    return cache control header value based on path.
*/
export const getCacheHeader = (path: string): string | null => {
  if (path.indexOf(`/fonts/`) === 0) {
    return `public, max-age=31536000, immutable`
  }

  return null
}
