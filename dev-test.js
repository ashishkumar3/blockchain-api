const blockchain = require("./blockchain");

const bc = new blockchain();

for (let i = 0; i < 10; i++) {
  console.log(bc.addBlock(`yoyo ${i}`).toString());
}
