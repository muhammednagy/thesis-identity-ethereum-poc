var HDWalletProvider = require("@truffle/hdwallet-provider");
// This is a wallet that holds no real value.
// I left it here just for testing purposes
var mnemonic = "tent twist kid useless beach antique aunt arm jump asset actor industry"; //put your mnemonic for the account that will deploy the contract to rinkeby here

module.exports = {
  compilers: {
    solc: {
      version: "^0.4.23", // A version or constraint - Ex. "^0.5.0"
    	},
     },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        // this token is invalid
        return new HDWalletProvider({mnemonic, providerOrUrl: "https://ropsten.infura.io/v3/4fc22c6bf21241e3b74cdf1e7b0a6743"}) //enter you API key here
      },
      network_id:3
    }
  }
};
