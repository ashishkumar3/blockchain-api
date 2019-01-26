const Wallet = require("./index");
const TransactionPool = require("./transaction-pool");
const Blockchain = require("../blockchain");
const { INITIAL_BALANCE } = require("../config");

describe("Wallet", () => {
  let wallet, transactionPool, bc;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
    bc = new Blockchain();
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
        bc,
        transactionPool
      );
    });
    // situation where we are doing the same transaction
    describe(" doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, bc, transactionPool);
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
    });
  });

  describe("calculating the balance", () => {
    let addBalance, repeatAdd, senderWallet;

    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;

      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(
          wallet.publicKey,
          addBalance,
          bc,
          transactionPool
        );
      }
      bc.addBlock(transactionPool.transactions);
    });

    it("calculates the balance for blockchain transactions matching the recipient", () => {
      expect(wallet.calculateBalance(bc)).toEqual(
        INITIAL_BALANCE + addBalance * repeatAdd
      );
    });

    it("calculates the for blockchain transactions matching the sender", () => {
      expect(senderWallet.calculateBalance(bc)).toEqual(
        INITIAL_BALANCE - addBalance * repeatAdd
      );
    });

    describe("and the recipient conducts a transaction", () => {
      let subtractBalance, recipientBalance;

      beforeEach(() => {
        transactionPool.clear();
        subtractBalance = 60;
        recipientBalance = wallet.calculateBalance(bc);
        wallet.createTransaction(
          senderWallet.publicKey,
          subtractBalance,
          bc,
          transactionPool
        );
        bc.addBlock(transactionPool.transactions);
      });

      describe("and the sender sends the transaction to the recipient", () => {
        beforeEach(() => {
          transactionPool.clear();
          senderWallet.createTransaction(
            wallet.publicKey,
            addBalance,
            bc,
            transactionPool
          );
          bc.addBlock(transactionPool.transactions);
        });

        it("calculate the recipient balance only using transactions since its most recent one", () => {
          expect(wallet.calculateBalance(bc)).toEqual(
            recipientBalance - subtractBalance + addBalance
          );
        });
      });
    });
  });
});
