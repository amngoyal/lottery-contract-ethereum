const HDwalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDwalletProvider(
    'month leaf ivory install energy stereo tuition proof advance song lab chuckle',
    'https://rinkeby.infura.io/v3/e515f44da8174ddf8cfc69d6748893ac',
)

const web3 = new Web3(provider);

(async function () {
    let accounts = await web3.eth.getAccounts();
    const INITIAL_STRING = "Hello Aman";

    console.log(accounts);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
        .send({ from: accounts[0], gas: 1000000 });

    console.log("Deployed at: ", result.options.address)
})();