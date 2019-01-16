const Transaction = require("./transaction");
const Wallet = require("./index");

describe("Transaction", () => {
  let transaction, wallet, recepient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recepient = "recepient";
    transaction = new Transaction.newTransaction(wallet, recepient, amount);
  });

  it("outputs the `amount` subtracted from the wallet balance", () => {
    expect(
      transaction.outputs.find(output => output.address === wallet.publicKey)
        .amount
    ).toEqual(wallet.balance - amount);
  });
});
