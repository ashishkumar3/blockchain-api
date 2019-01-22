// try to implement in socketio, currently in websockets
const Websocket = require("ws");

// port to run server on every computer(peer)
const P2P_PORT = process.env.P2P_PORT || 5001;

// list of peers connected to the server on the following addresses(with ports)
// HTTP_PORT=3002 P2P_PORT=5003... PEERS=ws://localhost:5001,ws://localhost:5002... npm run dev
// then we create an array of all web sockets addresses (PEERS=ws://localhost:5001,ws://localhost:5002...) only if the PEERS environment variable is present.
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

// in order to check what type of message/data we recieve that is shared across the p2p network we need a way to type check the message/data recieved.
const MESSAGE_TYPE = {
  chain: "CHAIN",
  transaction: "TRANSACTION"
};

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  // run the p2p server
  listen() {
    // create a websocket server on P2P_PORT
    const server = new Websocket.Server({ port: P2P_PORT });

    // wait for connection event to occur, then run connectSocket function for the websocket server.
    server.on("connection", socket => this.connectSocket(socket));

    // when connection is made, try and find sockets(peers) to connect
    this.connectToPeers();

    console.log(`Listening for peer-to-peer connection on: ${P2P_PORT}`);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      console.log("a new peer connected.");
      console.log(socket);
      // for each peer address check if connection is open, then connect to that address (connectSocket())
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  // when a peer(socket) is connected to this network
  connectSocket(socket) {
    // add to the sockets array
    this.sockets.push(socket);
    console.log("Socket Connected");

    // check if any message
    this.messageHandler(socket);

    // send the blockchain across peer(socket) network
    this.sendChain(socket);
  }

  // whenever gets a message, parse it and log it on console and check for the type of the message and send it across the network
  messageHandler(socket) {
    socket.on("message", message => {
      const data = JSON.parse(message);

      // as we have to apply function according to the incoming data type, we switch over the data type and if we get a chain then we replace the chain in the p2p network else we add or update the transaction in the mempool in the network
      switch (data.type) {
        case MESSAGE_TYPE.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPE.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
      }
    });
  }

  sendChain(socket) {
    // broadcast blockchain to all peers(sockets) (only sends strings)
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.chain,
        chain: this.blockchain.chain
      })
    );
  }

  sendTransaction(socket, transaction) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.transaction,
        transaction
      })
    );
  }

  // send the updated blockchain of this current instance to all socket peers
  syncChain() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  // synchronise transaction pool across the peep-to-peer network.
  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
}

module.exports = P2pServer;
