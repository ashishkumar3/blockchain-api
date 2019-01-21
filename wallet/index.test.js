const Wallet = require("./index");
const TransactionPool = require("./transaction-pool");

describe("Wallet", () => {
  let wallet, transactionPool;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
  });

  // situation where a wallet is creating a transaction
  describe(() => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = "public address of recipient";
      transaction = wallet.createTransaction(
        recipient,
        sendAmount,
        transactionPool
      );

      // situation where we are doing the same transaction
      describe(" doing the same transaction", () => {
        beforeEach(() => {
          wallet.createTransaction(recipient, sendAmount, transactionPool);
        });

        //
        it("doubles the send amount subtracted from the wallet balance");

        //
        it("clones the sendamount output for the recipient");

        //
        it();
      });
    });
  });
});
