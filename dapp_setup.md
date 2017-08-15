# Project structure

We will build the following strucuture:

    ├── app
    │   ├── index.html
    │   └── js
    │       └── app.js
    ├── build
    │   ├── app
    │   │   ├── index.html
    │   │   └── js
    │   │       └── app.js
    │   └── contracts
    │       ├── ConvertLib.json
    │       ├── Migrations.json
    │       └── Splitter.json
    ├── contracts
    │   ├── ConvertLib.sol
    │   ├── Migrations.sol
    │   └── Remittance.sol
    ├── migrations
    │   ├── 1_initial_migration.js
    │   └── 2_deploy_contracts.js
    ├── package.json
    ├── README.txt
    ├── test
    │   ├── metacoin.js
    │   └── TestMetacoin.sol
    ├── truffle.js
    └── webpack.config.js

* `app` holds the UI code
* `contracts` holds the smart contract code
* `migrations` holds the truffle migrations files that are used to deploy the smart contracts
* `package.json` contains information about our project and it's dependencies. It is used by the `npm` build/packaging system.
* `truffle.js` contains information about Blockchain networks to which we want to deploy the smart contracts.
* `webpack.config.js` is the `webpack` configuration file. Webpack is used to bundle our javascript/UI code.
* `build` holds the compiled code.

# Install base packages

    npm init
    npm install --save-dev webpack
    npm install --save-dev webpack-dev-server
    npm install -save truffle
    npm install --save-dev ethereumjs-testrpc

Create a new directory and add the file `package.json` with the following content:

    {
      "name": "splitter",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
            "start": "webpack-dev-server --open --content-base build/app/ --output-public-path js",
        "build": "truffle compile; webpack",
            "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "",
      "license": "ISC",
      "dependencies": {
            "jquery": "^3.2.1",
            "truffle": "^3.3.2",
            "truffle-config": "^1.0.0",
            "truffle-contract": "^2.0.1",
            "truffle-expect": "0.0.3",
            "web3": "^0.19.1",
            "webpack": "^3.0.0"
      },
      "devDependencies": {
            "ethereumjs-testrpc": "^4.0.1",
            "file-loader": "^0.11.2",
            "webpack-dev-server": "^2.5.0"
      }
    }

Change values as needed. Then run:

    npm install

This will install the following dependencies:

* jquery - DOM manipulation library. Useful for small UIs
* truffle - Smart contract development, testing and deployment tools
* web3 - JS library to interface with smart contracts
* webpack - JS bundler
* file-loader - A webpack plugin used to make it aware of our index.html
* ethereumjs-testrpc - In-memory version of the Ethereum blockchain for development and testing
* webpack-dev-server - Simple http server that compiles JS with webpack and serves it from memory

# Setup a truffle project

In the newly created directory, run:

    ./node_modules/.bin/truffle init

Note: This doesn't seem to work behind a proxy.

# Write code

Our javascript entry point is `app/js/app.js`. This should be the main javascript file which requires all other modules.

Use the following template for the file `app/js/app.js`:

TODO: Use strict
TODO: Linter

    // Tell webpack to copy the index.html file to the build directory
    require("file-loader?name=../index.html!../index.html");
    
    const Web3 = require('web3');
    const truffleContract = require("truffle-contract");
    const $ = require("jquery");
    
    var web3;
    var Contract;
    
    function init_contract() {
        // Supports Mist, and other wallets that provide 'web3'.
        if (typeof web3 !== 'undefined') {
            // Use the Mist/wallet/Metamask provider.
            web3 = new Web3(web3.currentProvider);
        } else {
            // Your preferred fallback.
            web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'    )); 
        }
    
        // Use JSON info from 'truffle compile' to load the contract
        Contract = truffleContract(require("../../build/contracts/    Contract.json"));
        Contract.setProvider(web3.currentProvider);
    
        // To help with debugging we expose web3 and the contract as global vars. This way we can use them from the browser console
        window.Contract = Contract;
        window.web3 = web3;
    }
    
    $(document).ready(function() {
        init_contract();
    
        // Call your JS from here
    });

Use the following template for the file `app/index.html`:

    <!doctype html>
    
    <html lang="en">
        <head>
            <meta charset="utf-8">
    
            <title>TODO</title>
            <meta name="description" content="TODO">
            <meta name="author" content="TODO">
    
            <!--[if lt IE 9]>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3    /html5shiv.js"></script>
            <![endif]-->
        </head>
    
        <body>
            <!-- HTML code goes here -->

            <script src="js/app.js"></script>
        </body>


# Deploy the smart contract

During the development we use testrpc. This is a in-memory version of the Ethereum blockchain. Start it with:

    ./node_modules/.bin/testrpc -d

The `-d` gives us deterministic accounts. This simplifies testing because we can hardcode the accounts.

Modify `migrations/2_deploy_contracts.js` to deploy your own contracts instead of the default MetaCoin contract.

Run the following to deploy the smart contracts to testrpc:

    ./node_modules/.bin/truffle migrate --reset

# Run test for smart contracts

Test are stored in `./tests` and are written in mochajs. To run them, make sure testrpc is running and start the tests with:

    ./node_modules/.bin/truffle test

# Start development http server

Start the webpack-dev-server. This server serves and updates the compiled javascript file from memory and all the files in content-base:

    ./node_modules/.bin/webpack-dev-server --open --content-base build/app/ --output-public-path js

Again, to save us typing we already put that in the package.json under the `scripts` section. Run it with:

And run it with:

    npm start

# Build the project

TODO: Uglify

Compile the smart contracts:

    ./node_modules/.bin/truffle compile
    ./node_modules/.bin/webpack

Again, to save us typing we already put that in the package.json under the `scripts` section. Run it with:

    npm run build
