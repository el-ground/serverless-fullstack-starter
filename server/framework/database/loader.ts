import DataLoader from 'dataloader'
import lruMapModule from 'lru_map'

const { LRUMap } = lruMapModule

// mock
const books: Record<string, any> = {
  a: {
    title: 'The Awakeningg',
    author: 'Kate Chopin',
  },
  b: {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
}

const batchLoad = async (keys: readonly string[]) => {
  /*
        your nosql batch read by key!
        ex) firestore getAll
        return null if not exists!
    */
  // dummy
  const result = keys.map((key) => (books[key] as any) || null)
  return result
}

/*
    Create loader for every queries!
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
