const Wallet = require("./index");
const TransactionPool = require("./transaction-pool");

describe("Wallet", () => {
  let wallet, transactionPool;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
  });

  // situation where a wallet is creating a transaction
  describe("creating a transaction", () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = "public address of recipient";
      transaction = wallet.createTransaction(
        recipient,
        sendAmount,
        transactionPool
      );
    });
    // situation where we are doing the same transaction
    describe(" doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, transactionPool);
      });

      //
      it("doubles the send amount subtracted from the wallet balance", () => {
        expect(
          transaction.outputs.find(
            output => output.address === wallet.publicKey
          ).amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      it("clones the send amount output for the recipient", () => {
        expect(
          transaction.outputs
            .filter(output => output.address === recipient)
            .map(output => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });

      //
      // it();
    });
  });
});
