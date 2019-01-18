const Wallet = require("./wallet");
const Trans = require("./wallet/transaction");

const wallet = new Wallet();

// const trx = new Transaction();

const t = Trans.newTransaction(wallet, "recipient", 50);

console.log(t);

// console.log(wallet.toString());
