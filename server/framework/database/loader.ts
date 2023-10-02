import DataLoader from 'dataloader'
import lruMapModule from 'lru_map'
import { readAllDirectly } from './read'

const { LRUMap } = lruMapModule

const batchLoad = async (keys: readonly string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return readAllDirectly<any>(keys)
}

/*
    Create loader for every queries!
    why not have a global loader? 
    => set cache consistency for only the query.
*/
export const createLoader = () => {
  const loader = new DataLoader(batchLoad, {
    /*
        Only cache for current query!!
    */
    cacheMap: new LRUMap(1024),
  })

  const load = <T>(key: string): Promise<T | null> => loader.load(key)
  const loadMany = <T>(keys: readonly string[]): Promise<(T | null)[]> =>
    loader.loadMany(keys)

  return {
    load,
    loadMany,
  }
}

export type Loader = ReturnType<typeof createLoader>
