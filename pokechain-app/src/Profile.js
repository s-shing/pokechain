import './App.css';
import { useState } from 'react';

import { provider,signer,contractAddress,pokecontract,pokelist,pokeById,pokedict,requests,stageOne,owned,ownedpokelist, yodacontract}
from "./class.js"


 function displayPoke(pokemon){
  let base = pokedict[pokemon]["evoBase"]

  var ipfs = ownedpokelist[pokemon]["image"]
  var level = ownedpokelist[pokemon]["level"]
  let cost = owned[pokeById[base]]["cost"]
  let costId = pokemon + "cost"
  return (
    <article>   
      <h2>{pokemon}</h2>
      <img src={ipfs}/>
      <div>
      <p>level:{level}</p>
      <input class="levelupform" id={pokemon} type="number" required placeholder='Insert Level'>
      </input>
      <button onClick={() => levelUp(pokemon)}>Level me!</button>
      </div>
      <div>
      <p>Cost:{cost}</p>
      <input class="setcostform" id={costId} type="number" required placeholder='Insert Cost'>
      </input>
      <button onClick={() => setCost(pokemon)}>Set Cost!</button>
      </div>
    </article>
  )
}
async function displayRequests(from,pokemon){
  var name = pokeById[pokemon-1+parseInt(await pokecontract.whatStage(pokemon))];
  var ipfs = pokedict[name]["image"];
  return (
    <article> 
      <div class="request">
        <p>Trainer {from} is asking for your {name}</p>
        <img src={ipfs}/>
      </div>
      <div class="buttons">
        <button onClick={() => approve(pokemon,from)}>Yes!</button>
        <button onClick={() => deny(pokemon,from)}>No!</button>
      </div>
    </article>
  )
}
async function approve(pokemon,sender){
  if (await pokecontract.approvePokemon(pokemon.toString().replace("n",""),sender) != null){
      await yodacontract.transferFrom(sender,await signer.getAddress(),parseInt(await pokecontract.getCost(pokemon.toString().replace("n","")))*100)
  }

}
async function deny(pokemon,sender){
  await pokecontract.rejectPokemon(pokemon.toString().replace("n",""),sender)
  
}
async function levelUp(poke){
  let level = document.getElementById(poke).value;
  if (level ==0){
     level = 1;

  }
  await pokecontract.levelUp(pokedict[poke]["evoBase"],level);
}

 async function showReq() { 
  var retquests = [];
  for  (var request of requests){
    retquests.push(displayRequests(await pokecontract.getAddy(request[0].toString().replace('n',"")),request[1].toString().replace('n',"")));
  }

  return retquests;
}

async function setCost(poke){
  let cost = document.getElementById(poke + "cost").value;
  if (cost ==0){
     cost = 1;

  }
  await pokecontract.setCost(pokedict[poke]["evoBase"],cost);
}




function App() {

  
  var pokes =[]
  for (var poke in ownedpokelist){
    pokes.push(displayPoke(poke));
  }
  var [retquests, setVal] = useState([]);

  return (
    <div className="App">
      <title>Profile</title>
      <div className="Toolbar">
        <div class="toolbarElem">
          <header className="App-header">
          <a href="/">
          <img src="/pokechain.png"></img>
          </a>
          </header>
          <div class="nav" id="profile">
        <a href="/profile">Profile</a>
      </div>
      <div class="nav" id="trade">
        <a href="/trade">Trade</a>
        </div>
       </div>
      </div>
      <div class="display">
      <div class="pokemon">{pokes}</div>
      <div class="trades">
      <button class="showTrades" onClick={()=>setVal(showReq())}>Show Trades</button>
      <div class="requests">{retquests}</div>
      </div>
      </div>
    </div>
  );
}

export default App;
