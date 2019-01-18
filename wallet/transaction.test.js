const Transaction = require("./transaction");
const Wallet = require("./index");

describe("Transaction", () => {
  let transaction, wallet, recepient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recepient = "recepient";
    transaction = Transaction.newTransaction(wallet, recepient, amount);
  });

  it("outputs the `amount` subtracted from the wallet balance", () => {
    expect(
      transaction.outputs.find(output => output.address === wallet.publicKey)
        .amount
    ).toEqual(wallet.balance - amount);
  });

  it("outputs the public key of the senders wallet", () => {
    expect(
      transaction.outputs.find(output => output.address === wallet.publicKey)
        .address
    ).toEqual(wallet.publicKey);
  });

  it("outputs the amount to be send to the recepient", () => {
    expect(
      transaction.outputs.find(output => output.address === wallet.publicKey)
        .amount
    ).toEqual(amount);
  });

  it("outputs the address of the recepient", () => {
    expect(
      transaction.outputs.find(output => output.address === recepient).address
    ).toEqual(recepient);
  });

  it("inputs the balance of the wallet", () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });
});
