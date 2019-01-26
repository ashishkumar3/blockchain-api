const express = require("express");
// const path = require("path");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");
const P2pServer = require("./p2p-server");
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transaction-pool");
const Miner = require("./miner");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added ${block.toString()}`);

  p2pServer.syncChain();
  res.redirect("/blocks");
});

app.post("/mine-transactions", (req, res) => {
  // craete mine block
  const block = miner.mine();
  console.log(`New block has been added: ${block.toString()}`);
  // redirect to blocks
  res.redirect("/blocks");
});

app.get("/transactions", (req, res) => {
  res.json(tp.transactions);
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.post("/transact", (req, res) => {
  // we assume that the user sends the address and amount through post request
  const { recipient, amount } = req.body;
  // create transaction in the pool
  const transaction = wallet.createTransaction(recipient, amount, tp);
  // then we broadcasst iot to the p2p netwrok
  p2pServer.broadcastTransaction(transaction);
  res.redirect("/transactions");
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
