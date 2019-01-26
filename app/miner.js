const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");

/**
 * MINE TRANSACTION REWARD
 * THIS TRANSACTIONS'S OUTPUT ARRAY OF OBJECTS CONTAIN ONLY ONE OBJECT
 * {
 *    "amount" : reward amount,
 *    "address" : "public key of the miner"
 * }
 */

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    // grab the valid transaction from the transaction pool(unconfirmed transactions)
    const validTransactions = this.transactionPool.validTransactions();
    // include a reward for the miner
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );
    // create a block whose data consists of those valid transactions and add to the blockchain
    const block = this.blockchain.addBlock(validTransactions);
    // synchronize the chains in the p2p network
    this.p2pServer.syncChain();
    // clear the transaction pool
    this.transactionPool.clear();
    // broadcast to every miner to clear their transaction pools
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner;
