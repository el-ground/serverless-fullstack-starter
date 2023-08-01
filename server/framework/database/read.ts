import { Transaction } from './transaction'
import { database } from './example'
/* eslint-disable @typescript-eslint/no-unused-vars */

export const readAllDirectly = async <T>(
  keys: readonly string[],
): Promise<(T | null)[]> => {
  // MUST_IMPLEMENT
  return keys.map((key) => database[key] || null)
}

// no transaction read
export const readDirectly = async <T>(key: string): Promise<T | null> => {
  // MUST_IMPLEMENT
  return database[key] || null
}

// transaction read
export const readInTransaction = async <T>(
  key: string,
  transaction: Transaction,
): Promise<T | null> => {
  // MUST_IMPLEMENT
  return database[key] || null
}
