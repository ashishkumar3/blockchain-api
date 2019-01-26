const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("../wallet/index");
const Blockchain = require("../blockchain");

describe("Transaction Pool", () => {
  let tp, transaction, wallet, bc;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();
    transaction = wallet.createTransaction("recipient address", 40, bc, tp);
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

  it("clears the transactions", () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  // checking if our blockchain identify valid transactions mixed with invalid ones.
  describe("mixing valid and corrupt transactions", () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 5; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction(
          "new random address",
          23,
          bc,
          tp
        );
        if (i % 2 === 0) {
          //invalid
          transaction.input.amount = 99999;
        } else {
          //valid
          validTransactions.push(transaction);
        }
      }
    });

    it("shows a difference between valid and invalid transactions", () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(
        JSON.stringify(validTransactions)
      );
    });

    it("grabs valid transactions", () => {
      expect(tp.validTransactions()).toEqual(validTransactions);
    });
  });
});
