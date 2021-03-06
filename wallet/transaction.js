const ChainUtil = require("../chain-util");
const { MINING_REWARD } = require("../config");

// Every transaction object contains unique id, input and output
// while creating a transaction a user has to pass his totalbalance, signature and public key of the wallet.
// the output contains the array of objects
// First object contains amount to send and address to which the amount has to be sent.
// Sencond object contains the amount that the sender recieve back(change) and the address to wich the change is to be sent i.e. senders own address(public key)

/*
    TRANSACTION-
      {
        "id": "unique id for every transaction",
        "input": {
          TIME, AMOUNT TO SEND, PUBLIC KEY OF SENDER, SIGNATURE
          "timestamp": 123455689,
          "amount": 40,
          "address": "public key of sender",
          "signature": "proof that sender has actually made transaction"
        },
        "output": [
          ARRAY OF ALL THE TRANSACTIONS TO BE MADE BY THE SYSTEM
          1st TRANSACTION OBJECT IS ALWAYS THE REMAINING BALANCE OF SENDER
          {
            "amount" : 120, // change that goes back to the sender (total - sendAmount = this amount)
            "address" : "public key of sender"
          },
          "REST TRANSACTIONS ARE THAT THE SENDER WANT TO SEND TO OTHER PEOPLE"
          {
            amount : "30",
            address : "public key of the recipient"
          },
          .... list of all other transactions
        ]
      }
*/

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  //  if a user make multiple transactions within short period of time(before first transaction is mined to a block) then we have to check if the balance is available for the second transaction or not and update the balance in the wallet of the sender.
  // then pass it to the transactions array and sign the transaction.

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      output => output.address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds the balance.`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);
    return this;
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    // everytime a transaction is created we sign it to maeke sure it the actual sender sent the money.
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  // For creating a new transaction we need the wallet of the sender whcih contains the information such as his key set and balance, the address of the recipient to which the money has to be sent, and the amount of money to be sent.

  static newTransaction(senderWallet, recipient, amount) {
    // console.log(transaction);

    // check if balance is available to make the transaction
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds the balance.`);
      return;
    }

    // then push it to the outputs of the list of transactions.
    return Transaction.transactionWithOutputs(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey
      },
      { amount, address: recipient }
    ]);

    // console.log("trnsaction output", transaction.outputs);

    // if (Transaction.verifyTransaction(transaction, senderWallet)) {
    //   return transaction;
    // } else {
    //   console.log("Data might have been tempered");
    // }
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    console.log(MINING_REWARD);
    return Transaction.transactionWithOutputs(blockchainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey
      }
    ]);
  }

  // when signing a transaction we add it to the input object of the transaction object along with current time, amount and address.
  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      // sigining the outputs array which has all the data related to a particular transaction.
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  // to verify if the transaction is legit or not we check the signature of the transaction
  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;
