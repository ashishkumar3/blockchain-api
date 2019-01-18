const Transaction = require("./transaction");
const Wallet = require("./index");

describe("Transaction", () => {
  let transaction, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = "recepient";
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it("outputs the `amount` subtracted from the wallet balance", () => {
    expect(
      transaction.outputs.find(output => output.address === wallet.publicKey)
        .amount
    ).toEqual(wallet.balance - amount);
  });

  it("outputs the amount to be send to the recepient", () => {
    expect(
      transaction.outputs.find(output => output.address === recipient).amount
    ).toEqual(amount);
  });

  describe("transacting with an amount that exceeds the balance", () => {
    beforeEach(() => {
      amount = 10000;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it("does not create the transaction", () => {
      expect(transaction).toEqual(undefined);
    });
  });

  it("inputs the balance of the wallet", () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it("verify the successfull transaction", () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it("rejects the tempered/corrupt transaction", () => {
    transaction.outputs[0].amount = 10000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });
});
