import { Transaction } from '../transaction'
import { database } from '../example'

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

// transaction model based on firestore.
export const overwriteInTransaction = <T>(
  key: string,
  data: T,
  transaction: Transaction,
): void => {
  // MUST_IMPLEMENT
  database[key] = data
}
