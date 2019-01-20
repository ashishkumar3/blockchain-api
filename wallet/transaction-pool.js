class TransactionPool {
  constructor() {
    this.transactions = [];
  }

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
}

module.exports = TransactionPool;
