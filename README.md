# Private Blockchain Application

This application demonstrates a few fundamentals concepts of a Blockchain platform.
Concepts like:

    - Block
    - Blockchain
    - Wallet
    - Blockchain Identity
    - Proof of Existance

In this project we implement REST Api to expose some of the functionalities
implemented in this private blockchain.

## What problem does this private Blockchain application implementatin solve?

Your employer is trying to make a test of concept on how a Blockchain application can be implemented in his company.
He is an astronomy fans and he spend most of his free time on searching stars in the sky, that's why he would like
to create a test application that will allows him to register stars, and also some others of his friends can register stars
too but making sure the application know who owned each star.

### What is the process implemented in the application?

1. The application creates a Genesis Block when we run the application.
2. The user will request the application to send a message to be signed using a Wallet and in this way verify the ownership over the wallet address. The message format will be: `<WALLET_ADRESS>:${new Date().getTime().toString().slice(0,-3)}:starRegistry`;
3. Once the user have the message the user can use a Wallet to sign the message.
4. The user will try to submit the Star object for that it will submit: `wallet address`, `message`, `signature` and the `star` object with the star information.
    The Star information is expected to be formed in this format:
    ```json
        "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Testing the story 4"
		}
    ```
5. The application verifes if the time elapsed from the request ownership (the time is contained in the message) and the time when you submit the star is less than 5 minutes.
6. If everything is okay the star information will be stored in the block and added to the `chain`
7. The application also allows us to retrieve the Star objects belong to an owner (wallet address). 


## Tools and technologies used to create this application?

- This application is created using Node.js and Javascript programming language. The architecture uses ES6 classes
because it helps us to organize the code and facilitate the maintnance of the code.
- Some of the libraries or npm modules you used are:
    - "bitcoinjs-lib": "^4.0.3",
    - "bitcoinjs-message": "^2.0.0",
    - "body-parser": "^1.18.3",
    - "crypto-js": "^3.1.9-1",
    - "express": "^4.16.4",
    - "hex2ascii": "0.0.3",
    - "morgan": "^1.9.1"
    Remember if you need install any other library you will use `npm install <npm_module_name>`

Libraries purpose:

1. `bitcoinjs-lib` and `bitcoinjs-message`. Those libraries help us to verify the wallet address ownership, we are going to use it to verify the signature.
2. `express` The REST Api created for the purpose of this project it is being created using Express.js framework.
3. `body-parser` this library is used as middleware module for Express and helps us to read the json data submitted in a POST request.
4. `crypto-js` This module contain some of the most important cryotographic methods and helps us to create the block hash.
5. `hex2ascii` This library helps us to **decode** the data saved in the body of a Block.

## Understanding the high level code

The Boilerplate code is a simple architecture for a Blockchain application, it includes a REST APIs application to expose the your Blockchain application methods to your client applications or users.

1. `app.js` file. It contains the configuration and initialization of the REST Api, the team who provide this boilerplate code suggest do not change this code because it is already tested and works as expected.
2. `BlockchainController.js` file. It contains the routes of the REST Api. Those are the methods that expose the urls that a user needs to call when make a request to the application.
3. `src` folder. In here we have the main two classes needed to create our Blockchain application, files `block.js` and `blockchain.js` files contain the `Block` and `BlockChain` classes.

### Getting Starting with the code:

First thing first, download or clone the application code.

Then install all the libraries and module dependencies, to do that: open a terminal and run the command `npm install`

**( Remember to be able to work on this project you will need to have installed in your computer Node.js and npm )**

At this point we are ready to run the project, use the command: `node app.js`

You can check in your terminal the the Express application is listening in the PORT 8000

## Implementation Details

1. `block.js` file. It contains the `Block` class that implements the method:
    `validate()`. 
    /**
     *  The `validate()` method will validate if the block has been tampered or not.
     *  Been tampered means that someone from outside the application tried to change
     *  values in the block data as a consecuence the hash of the block should be different.
     *  Steps:
     *  1. Return a new promise to allow the method be called asynchronous.
     *  2. Save the in auxiliary variable the current hash of the block (`this` represent the block object)
     *  3. Recalculate the hash of the entire block (Use SHA256 from crypto-js library)
     *  4. Compare if the auxiliary hash value is different from the calculated one.
     *  5. Resolve true or false depending if it is valid or not.
     *  Note: to access the class values inside a Promise code you need to create an auxiliary value `let self = this;`
     */
2. `block.js` file. It contains the `Block` class that implements the method:
    `getBData()`.
    /**
     *  Auxiliary Method to return the block body (decoding the data)
     *  Steps:
     *  
     *  1. Use hex2ascii module to decode the data
     *  2. Because data is a javascript object use JSON.parse(string) to get the Javascript Object
     *  3. Resolve with the data and make sure that you don't need to return the data for the `genesis block` 
     *     or Reject with an error.
     */
3. `blockchain.js` file. It contains the `Blockchain` class that implements the method:
    `_addBlock(block)`.
    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block 
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * You will need to check for the height to assign the `previousBlockHash`,
     * assign the `timestamp` and the correct `height`...At the end you need to 
     * create the `block hash` and push the block into the chain array. Don't for get 
     * to update the `this.height`
     * Note: the symbol `_` in the method name indicates in the javascript convention 
     * that this method is a private method. 
     */
4. `blockchain.js` file. It contains the `Blockchain` class that implements the method:
    `requestMessageOwnershipVerification(address)`
    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     * @param {*} address 
     */
5. `blockchain.js` file. It contains the `Blockchain` class that implements the method:
    `submitStar(address, message, signature, star)`
    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * Algorithm steps:
     * 1. Get the time from the message sent as a parameter example: `parseInt(message.split(':')[1])`
     * 2. Get the current time: `let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));`
     * 3. Check if the time elapsed is less than 5 minutes
     * 4. Veify the message with wallet address and signature: `bitcoinMessage.verify(message, address, signature)`
     * 5. Create the block and add it to the chain
     * 6. Resolve with the block added.
     * @param {*} address 
     * @param {*} message 
     * @param {*} signature 
     * @param {*} star 
     */
6. `blockchain.js` file. It contains `Blockchain` class that implements the method:
    `getBlockByHash(hash)`
    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash 
     */
7. `blockchain.js` file. It contains the `Blockchain` class that implements the method:
    `getStarsByWalletAddress (address)`
    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain 
     * and are belongs to the owner with the wallet address passed as parameter.
     * 
     * @param {*} address 
     */
8. `blockchain.js` file. It contains `Blockchain` class that implements the method:
    `validateChain()`
    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check the with the previousBlockHash
     */

## Testing the application functionality.

The application uses mochajs, chai, and supertest testing frameworks to test the application
functionality. 

To run the unit tests: `./node_modules/.bin/mocha test/unit/*.js`

To run the integration tests: `./node_modules/.bin/mocha test/integration/*.js`

To make sure your application is working fine, there are shell scripts in `tests/manual` 
directory that use curl command line tool to invoke REST Apis provided by the applicaton.  

1. Run your application using the command `node app.js`
You should see in your terminal a message indicating that the server is listening in port 8000:
> Server Listening for port: 8000

2. To  request the Genesis block:
    ```
    > ./get_genesis_block.sh
   
    + curl -s http://localhost:8000/block/0
    
    {
    "hash": "a216d49bf3a8a03aa61b84e29a6af27dfcbb0168d2c452622846977db5a9f2f8",
    "height": 0,
    "body": "7b2264617461223a2247656e6573697320426c6f636b227d",
    "time": "1557531325",
    "previousBlockHash": null
    }

    ```
    
3. Make your first request of ownership sending your wallet address:
    ```
        ❯ ./req_validation.sh 1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v                     

            + curl -s -d '{"address":"1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v"}' -H 'Content-Type: application/json' -X POST http://localhost:8000/requestValidation
            + sed -e 's/\"//g'

            1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v:1557545110:starRegistry
    ```

    
4. Sign the message with your Wallet: `./sign_message.sh <address> <message>
   
   The shell script `./sign_message.sh` assumes you have an electrum wallet installed.

    ```
    ./sign_message.sh 1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v 1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v:1557545110:starRegistry

    + address=1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v
    + message=1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v:1557545110:starRegistry
    + electrum=/Applications/Electrum.app/Contents/MacOS/Electrum
    + /Applications/Electrum.app/Contents/MacOS/Electrum signmessage 1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v 1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v:1557545110:starRegistry -W <PASSWORD>

    H1TkHFDnt6aLRKaOBq/ihmczv861+k3+rRgRAX4qdN0NIYrmsdCjciecnphA8xjPAxKZOQpZ/EXI3PvA8mQwLZY=
    ```
    
5. Submit your Star - `./submitstar.sh <address> <message> <signature>`
    
 
    ```
     ./submitstar.sh 1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v 1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v:1557546178:starRegistry ILlaZNxBDN2KfYsPrrCpmf+ECjRGupCOz9aq0TUl13XFWWb0+FTajQt5/6KOLlly0OHRdGXlbphDgPpqvWvbt7w=
    + address=1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v
    + message=1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v:1557546178:starRegistry
    + signature=ILlaZNxBDN2KfYsPrrCpmf+ECjRGupCOz9aq0TUl13XFWWb0+FTajQt5/6KOLlly0OHRdGXlbphDgPpqvWvbt7w=
    + read -d '' post_message
    + sleep 5
    + echo '{' '"address":"1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v",' '"signature":"ILlaZNxBDN2KfYsPrrCpmf+ECjRGupCOz9aq0TUl13XFWWb0+FTajQt5/6KOLlly0OHRdGXlbphDgPpqvWvbt7w=",' '"message":"1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v:1557546178:starRegistry",' '"star":{' '"dec":"68°' '52'\''' '56.9\"",' '"ra":' '"16h' 29m '1.0s",' '"story":' '"Tesing' the story '4"' '}' '}'
    + curl -s -d @body.json -H 'Content-Type: application/json' http://localhost:8000/submitstar
    + jq

    {
    "hash": "f1fab113864873a8aed69ea9bd24d0ecbd9c273df34644cd3fdb9217596f97ef",
    "height": 5,
    "body": "7b226f776e6572223a22314c6237317875756a4e424a32735a7573453270354b537658775076576232683576222c2273746172223a7b22646563223a223638c2b0203532272035362e395c22222c227261223a223136682032396d20312e3073222c2273746f7279223a22546573696e67207468652073746f72792034227d7d",
    "time": "1557546406",
    "previousBlockHash": "ea2ccf387dcaa253ca39f13e31cebc064c7df9afcc8c2235e46c3bd05132c762"
    }
    ```

    Note that it con be quite cumbersome to manually create JSON for the a POST via curl
    command line tool. For convenience, the script `req_sign_submitstar.sh <address>` combines the REST Api calls to generate request, sign and submit a star request. 

    Assuming your electrum wallet is protected by a password. The password is expected to be 
    set in the environment variable `ELECTRUM_PASSWORD`
    
    
6. Retrieve Stars owned by a given address

    ```
    test/manual❯ ./get_stars.sh 1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v                         
        + address=1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v
        + curl -s http://localhost:8000/blocks/1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v
        + jq
        [
            {
                "owner": "1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v",
                "star": {
                "dec": "68° 52' 56.9\"",
                "ra": "16h 29m 1.0s",
                "story": "Tesing the story 4"
                }
            },
            {
                "owner": "1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v",
                "star": {
                "dec": "68° 52' 56.9\"",
                "ra": "16h 29m 1.0s",
                "story": "Tesing the story 4"
                }
            },
            {
                "owner": "1Lb71xuujNBJ2sZusE2p5KSvXwPvWb2h5v",
                "star": {
                "dec": "68° 52' 56.9\"",
                "ra": "16h 29m 1.0s",
                "story": "Tesing the story 4"
                }
            }
        ]
    ```
    
