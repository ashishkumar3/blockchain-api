class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  // update or add the transaction to the transaction array i.e. transaction pool
  updateOrAddTransaction(transaction) {
    // check if transaction already exists in the transactions array or not
    let transactionWithId = this.transactions.find(
      t => t.id === transaction.id
    );

    // if it exists
    if (transactionWithId) {
      //transaction exists in the pool, so update it with new incoming transaction
      this.transactions[
        this.transactions.indexOf(transactionWithId)
      ] = transaction;
    } else {
      // transaction does not exist in the pool, add it to the pool
      this.transactions.push(transaction);
    }
  }

  // for checking if a transaction exists
  existingTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }
}

module.exports = TransactionPool;
