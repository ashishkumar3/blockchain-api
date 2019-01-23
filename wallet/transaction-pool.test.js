const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("../wallet/index");

describe("Transaction Pool", () => {
  let tp, transaction, wallet;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = wallet.createTransaction("recipient address", 40, tp);
  });

  it("adds a transaction to the pool", () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(
      transaction
    );
  });

  it("updates a transaction in the pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, "foo-address", 50);
    tp.updateOrAddTransaction(newTransaction);
    expect(
      JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))
    ).not.toEqual(oldTransaction);
  });

  // describe("mixing valid and corrupt transactions", () => {
  //   let validTransactions;

  //   beforeEach(() => {
  //     validTransactions = tp.validTransactions();
  //   })
  // });
});
