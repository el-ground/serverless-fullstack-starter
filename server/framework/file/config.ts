/*
    cache window : sessions requested within the window shares the cache

    If I requested at the end of the window, i get CACHE_DURATION cache
    If I requested at the beginning of the window i get CACHE_DURATION + CACHE_WINDOW

    so in current setup, cache is min 1 day to max 2 day
*/
export const SIGNED_URL_CACHE_WINDOW_SECONDS = 24 * 60 * 60
/*
    cache duration : how long the cache is cached
*/
export const SIGNED_URL_CACHE_DURATION_SECONDS = 24 * 60 * 60
export const PRIVATE_CACHE_DURATION_SECONDS =
  SIGNED_URL_CACHE_WINDOW_SECONDS + SIGNED_URL_CACHE_DURATION_SECONDS
export const PUBLIC_CACHE_DURATION_SECONDS = 7 * 24 * 60 * 60
