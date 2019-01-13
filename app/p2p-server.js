const Websocket = require("ws");

// port to run server on every computer(peer)
const P2P_PORT = process.env.P2P_PORT || 5001;

// list of peers connected to the server
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
    // wait for connection event to occur, then run connectSocket function for every connected socket.
    server.on("connection", socket => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for peer-to-peer connection on: ${P2P_PORT}`);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);

      socket.on("open", () => this.connectSocket(socket));
    });
  }

  // when a peer(socekt) is connected to this network
  connectSocket(socket) {
    this.sockets.push(socket);
    console.log("Socket Connected");
    // console.log(socket);
  }
}

module.exports = P2pServer;
