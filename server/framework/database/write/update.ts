import { Transaction } from '../transaction'
import { database } from '../example'

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

export const updateDirectly = async <T>(
  key: string,
  fields: Record<string, any>,
): Promise<void> => {
  // MUST_IMPLEMENT
  if (!(key in database)) {
    throw new Error(`doesnt exist!`)
  }

  Object.entries(fields).forEach(([k, v]) => {
    // very naive mock. doesnt support updating nested fields.
    database[key][k] = v
  })
}

// transaction update
// transaction model based on firestore.
export const updateInTransaction = <T>(
  key: string,
  fields: Record<string, any>,
  transaction: Transaction,
): void => {
  // MUST_IMPLEMENT
  if (!(key in database)) {
    throw new Error(`doesnt exist!`)
  }
  Object.entries(fields).forEach(([k, v]) => {
    // very naive mock. doesnt support updating nested fields.
    database[key][k] = v
  })
}
