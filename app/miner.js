class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    // grab the valid transaction from the transaction pool(unconfirmed transactions)
    // include a reward for the miner
    // create a block whose data consists of those valid transactions and add to the blockchain
    // synchronize the chains in the p2p network
    // clear the transaction pool
    // broadcast to every miner to clear their transaction pools
  }
}
