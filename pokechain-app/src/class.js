import pokes from './pokelist.json';
import { ethers } from "ethers";
import PokeChainABI from "./contracts/PokeChain.json";
import Yoda from "./contracts/YODA.json";


let provider,signer,contractAddress,pokecontract,pokelist,pokeById,pokedict,requests,stageOne,owned,ownedmon,ownedpokelist,yodacontract;

provider = new ethers.BrowserProvider(window.ethereum);
signer = await provider.getSigner();
contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
pokecontract = new ethers.Contract(contractAddress, PokeChainABI.abi, signer);
pokelist = new Map();
ownedpokelist = new Map();
let yodaAddress = "0xe1d6e2F8F036179656bEb0E2BDb8E326b0E6b094";
yodacontract = new ethers.Contract(yodaAddress, Yoda.abi, signer);

pokedict = JSON.parse(pokes)
stageOne = [1,4,7,10,13,16,19,21,23,25,27,29,32,35,37,39,41,43,46,48,50,52,54,56,58,60,63]
owned = {}
pokeById = new Map();
requests = new Map();
ownedmon = await pokecontract.whatDoesSomeoneOwn(await signer.getAddress());
requests = await pokecontract.getRequestsList();
ownedmon = ownedmon.toString().split(",")
for (var poke in pokedict){
    pokeById[pokedict[poke]["id"]] = poke;
    if (stageOne.includes(pokedict[poke]["id"])){
      pokedict[poke]["stageOne"] = true;
     
    }
    else{
      pokedict[poke]["stageOne"] = false;
  
    }
    if (await pokecontract.ownedMon(pokedict[poke]["id"])){
        var level = await pokecontract.whatLevel(pokedict[poke]["id"]);

        var token = await pokecontract.tokenURI(pokedict[poke]["id"]);
        var tokenparsed ={};
        tokenparsed = await (await fetch(token)).json()
        let dict ={}
        dict["image"] =tokenparsed["image"]
        dict["name"] =tokenparsed["name"]
        dict["level"] =level
        let cost = await pokecontract.getCost(pokedict[poke]["id"])
        if (cost != null & pokedict[poke]["stageOne"] == true){
            cost = parseInt(cost);
            dict["cost"]= cost;
          }
        owned[poke] = dict;
       
    }   
    if (ownedmon.includes(pokedict[poke]["id"].toString()) ){
        let dict = {}

        var token = await pokecontract.tokenURI(pokedict[poke]["id"]);
        var tokenparsed ={};
        tokenparsed = await (await fetch(token)).json()
        dict["image"] = tokenparsed["image"]
        dict["level"] = level
      
        ownedpokelist[tokenparsed["name"]] = dict
    }
    pokelist[poke] = pokedict[poke]["image"]

  }

export {  provider,signer,contractAddress,pokecontract,pokelist,pokeById,pokedict,requests,stageOne,owned,ownedpokelist, yodacontract}
