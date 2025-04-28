# Pokechain
## Intro
PokeChain is an NFT-based marketplace that allows you to trade Pokémon in return for FT (Yoda). PokeChain is based on the game Pokémon and acts as a tool to manage in-game trades and provide an abstract, legitimized marketplace. Like Pokémon, you can capture Pokémon (minting), level them, and trade them. Ideally, the use would be to track Pokémon, manage leveling, and initiate trades among Pokémon players, as well as provide a unified currency for these transactions. Previously, a Pokémon trainer had to find someone to trade with through various means, whether it be a common trade, like with a friend or someone nearby, or a less common trade, like someone you met only for trading. Pokechain provides a marketplace catered to most instances of valuable trades, but does not limit invaluable trades. It allows people to connect over Web2 and legitimizes the trade using Web3 through mutual agreement. This allows you to track the occurrences of trades and the value of the Pokémon.


## Dependencies

start by installing nodejs & npm: `apt install npm (or mac/windows equivalent)`

install hardhat: `npm install --save-dev hardhat`

install app dependencies: `npm install ethers dotenv web3 @nomiclabs/hardhat-ethers @nomiclabs/hardhat-waffle `

Now, clone the github repo

### To generate a smart contract

`cd pokechain
cd pokechain-contract
touch .env`

edit/vim .env to include:

PRIVATE_KEY=[metamask private key]

INFURA_API_KEY=[alchemy/infuria key]

FOR INFURIA

you need to change the hardhat.config.js to the infuria api URL

FOR ALCHEMY 

no change

`npx hardhat run scripts/deploy.js --network sepolia`

Save the resulting contract address!

### To run on an existing contract
`cd pokechain
cd pokechain-app
touch .env`

edit/vim .env to include:
REACT_APP_CONTRACT_ADDRESS=[DEPLOYED_CONTRACT_ADDRESS]

`npm install
npm start`

It should automatically open the browser to the webpage. If it does not, navigate to localhost:3000/




