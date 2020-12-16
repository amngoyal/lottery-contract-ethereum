const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts = null;
let lottery = null;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: 1000000 });

    lottery.setProvider(provider);
})

describe('Lottery', () => {
    it('deploy a contract', () => {
        assert.ok(lottery.options.address)
    })

    it('enter a user', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(1, players.length);
    });

    it('enter multiple user', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(accounts[1], players[1]);
        assert.strictEqual(accounts[2], players[2]);
        assert.strictEqual(3, players.length);
    });

    it('requires a minimum amount of ether', async () => {
        let correct = true;

        try {
            await lottery.methods.enter().send({
                from: accounts[2],
                value: 0
            });
            correct = false
        } catch (err) {
            correct = true
        }

        correct ? assert(true) : assert(false);
    });

    it('only manager can pick winner', async () => {
        let correct = true;
        try {
            await lottery.methods.enter().send({
                from: accounts[1],
                value: web3.utils.toWei('0.1', 'ether')
            });

            await lottery.methods.pickWinner().send({
                from: accounts[1],
            });

            console.log("end")
            correct = false
        } catch (error) {
            correct = true
        }

        correct ? assert(true) : assert(false);
    })
})