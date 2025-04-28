import './App.css';

import { provider,signer,contractAddress,pokecontract,pokelist,pokeById,pokedict,requests,stageOne,owned,ownedmon, yodacontract,ownedpokelist}
from "./class.js"



async function trade(pokemon){
  if (await pokecontract.requestPokemon(pokedict[pokemon]["evoBase"]) != null){
    if (await yodacontract.approve(await pokecontract.ownerOf(pokedict[pokemon]["evoBase"]),await pokecontract.getCost(pokedict[pokemon]["evoBase"])*100) == null){

    }
  }
   
}
function displayOwnedPoke(pokemon){
  var ipfs = owned[pokemon]["image"]
  var evoname = owned[pokemon]["name"]
  var level = owned[pokemon]["level"]
  let base = pokedict[pokemon]["evoBase"]

  let cost = owned[pokeById[base]]["cost"]
  let costId = pokemon + "cost"
  return (
    <article> 
      <h2>{evoname}</h2>
      <img src={ipfs}/>
      <p>Cost: {cost}, Level: {level}</p>
      <button onClick={() => trade(pokemon)}>Trade me!</button>
    </article>
  )
}

function App() {
  var pokes =[]
  for (var poke in pokelist){
 

    if(poke in owned){
      pokes.push(displayOwnedPoke(poke));
    }

    
  }
  return (
    <div className="App">
            <title>Trades</title>

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
      <div class="pokemon">{pokes}</div>
      
    </div>

  );
}

export default App;
