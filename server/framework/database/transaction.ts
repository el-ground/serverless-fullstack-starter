/*
    wrap your database's transaction here or replace all places that use this method
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Transaction {
  /* no-op */
}

export const runTransaction = async (
  action: (transaction: Transaction) => Promise<void>,
): Promise<void> => {
  // MUST_IMPLEMENT

  const transaction: Transaction = {}
  await action(transaction)
}
