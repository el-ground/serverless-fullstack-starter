import { Transaction } from '../transaction'
import { database } from '../example'

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

// transaction update
// transaction model based on firestore.
export const createInTransaction = <T>(
  key: string,
  data: T,
  transaction: Transaction,
): void => {
  // MUST_IMPLEMENT
  if (key in database) {
    throw new Error(`already exists!`)
  }
  database[key] = data
}
