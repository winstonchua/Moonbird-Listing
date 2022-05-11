const { OpenSeaStreamClient } = require('@opensea/stream-js');
const {WebSocket} = require("ws");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const contract = require("./bird.json");
require('dotenv').config(); 

const API_URL = process.env.API_URL;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OS_API_KEY = process.env.OS_API_KEY;


const web3 = createAlchemyWeb3(API_URL);
const moonbirds = new web3.eth.Contract(contract, NFT_CONTRACT_ADDRESS);

const client = new OpenSeaStreamClient({
    apiUrl: "wss://stream.openseabeta.com/socket",
    token: OS_API_KEY,
    onError: console.error,
    connectOptions: {
        transport: WebSocket,
    },
})

async function itemList(){
    
    client.onItemListed("proof-moonbirds", (item_listed) => {
        const tokenID = (item_listed["payload"]["item"]["nft_id"]).substring(52);
        console.log("Token ID is: "+tokenID)
        async function birb(tokenID){
            const nestingperiod = moonbirds.methods.nestingPeriod(tokenID).call();
            const isNesting = (await nestingperiod).nesting;
            console.log("Moonbird "+tokenID+" is nesting: "+ isNesting);
        }
        birb(tokenID);
    });
    
}

itemList();

