const Websocket = require("ws");

// port to run server on every computer(peer)
const P2P_PORT = process.env.P2P_PORT || 5001;

// list of peers connected to the server on the following addresses(with ports)
// HTTP_PORT=3002 P2P_PORT=5003... PEERS=ws://localhost:5001,ws://localhost:5002... npm run dev
// then we create an array of all web sockets addresses (PEERS=ws://localhost:5001,ws://localhost:5002...) only if the PEERS environment variable is present.
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

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

  // whenever gets a message, parse it and log it on console
  messageHandler(socket) {
    socket.on("message", message => {
      const data = JSON.parse(message);
      this.blockchain.replaceChain(data);
    });
  }

  sendChain(socket) {
    // broadcast blockchain to all peers(sockets) (only sends strings)
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  // send the updated blockchain of this current instance to all socket peers
  syncChain() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }
}

module.exports = P2pServer;
