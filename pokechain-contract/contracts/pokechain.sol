    // SPDX-License-Identifier: MIT
    pragma solidity =0.8.20;

    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

    import "@openzeppelin/contracts/utils/Strings.sol";

    interface YODA{
        function balanceOf(address account) external view returns (uint256);
    }

    contract PokeChain is ERC721URIStorage {

        uint private _tokenIds;
        struct Pokemon{
            uint id;
            address item;
            uint level;
            uint stage;
            bool isOwned;
        }

        address yoda = 0xe1d6e2F8F036179656bEb0E2BDb8E326b0E6b094;

        event Request(address from, address to, uint pokemon, string[],address[]);
        event Evolve(address trainer,uint pokemon, uint stage);
        event Level(address trainer,uint pokemon, uint level);
        event RegisterPokemon(address trainer, string URI, uint tokenaddress);
        mapping(address => uint[]) trainers;
        mapping(uint => Pokemon) IDdata;
        mapping(uint => bool) isBase;
        mapping(uint => uint) stageCount;
        mapping(address =>  uint[][]) requests;
        mapping(string => address) requesters;
        mapping(uint => uint) costs;

        
        constructor() ERC721("PokeChain", "PKM") { 
            uint8[27] memory stageOne;
            uint8[30] memory stageTwo;

            stageOne = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63];
            stageTwo = [19,20,21,22,23,24,25,26,27,35,36,37,38,39,40,41,42,48,49,50,51,52,53,54,55,56,57,58,59,60];
            uint y=0;
            uint x=0;
            for (uint i =1; i <66; i++){
                    if (y<stageOne.length && stageOne[y] == i){
                        isBase[i] = true;
                        y++;
                    }else{            
                        isBase[i] = false;
                    }
                    if (x<stageTwo.length && stageTwo[x] == i){
                        stageCount[i] = 2;
                        x++;
                    } else{
                        stageCount[i]= 3;
                    }
            }
        }
    
        modifier isOwner(uint pokemon){
            require(ownerOf(pokemon)==msg.sender);
            _;
        }
        modifier isNotOwner(uint pokemon){
            require(ownerOf(pokemon)!=msg.sender);
            _;
        }
        modifier baseEvo(uint pokemon){
            require(isBase[pokemon]);
            _;
        }
        modifier isOwned(uint pokemon){
            require(ownedMon(pokemon));
            _;
        }
        modifier hasNotReq(uint tradePokeID){
            bool flag = true;
            for (uint i=0; i<requests[ownerOf(tradePokeID)].length; i++){
                if ((requests[ownerOf(tradePokeID)][i][1]==tradePokeID) && (getAddy(Strings.toString(requests[ownerOf(tradePokeID)][i][0])) == msg.sender)){
                    flag = false;
                    break;
                }
            }
            require(flag);
            _;
        }

        function whatStageCount(uint pokemon) public view returns (uint){
            return stageCount[pokemon];     
            }
        function ownedMon(uint pokemon) public view returns (bool){
            return IDdata[pokemon].isOwned;
        }
        function getAddy(string memory add) public view returns(address){
            return requesters[add];
        }

        function whatDoesSomeoneOwn(address trainer) public view returns (uint[] memory){
        return trainers[trainer];     
        }
        function whatLevel(uint pokemon) public view returns (uint){
            return IDdata[pokemon].level;
        }
        function whatStage(uint pokemon) public view returns (uint){
            return IDdata[pokemon].stage;
        }
        function getRequestsList() public view returns (uint[][] memory){
            return requests[msg.sender];
        }
        function getCost(uint pokemon) public view returns (uint){
            return costs[pokemon];
        }

        function setCost(uint pokemon,uint cost) public isOwner(pokemon){
            costs[pokemon]=cost;
            approvehelper(pokemon);
        }
    
        function levelUp(uint pokemon,uint level) public isOwner(pokemon){
            IDdata[pokemon].level+=level;
            require(IDdata[pokemon].level<=100);
            if (IDdata[pokemon].level >= 16 && IDdata[pokemon].stage ==1){  
                evolve(pokemon);
            }   
            if(IDdata[pokemon].level>=36 && IDdata[pokemon].stage ==2 && stageCount[pokemon]==3){
                evolve(pokemon);
            }
            emit Level(msg.sender,pokemon,IDdata[pokemon].level);
            } 
        
        function evolve(uint pokemon) private {
            IDdata[pokemon].stage +=1;
            string memory tokenURI = genToken(IDdata[pokemon].stage-1+pokemon);
            _setTokenURI(pokemon, tokenURI);  
            emit Evolve(msg.sender,pokemon,IDdata[pokemon].stage);
        }

        function genToken(uint tokenAddress) private view returns (string memory){
            string memory tokenURI = _baseURI();
            tokenURI =string.concat("https://magenta-top-ape-604.mypinata.cloud/ipfs/bafybeigkhbsnnpsr5xez322nwhb3vym4m5c6w55j5uq4nxqkwo4wqxedpu/",tokenURI);
            tokenURI = string.concat(tokenURI, Strings.toString(tokenAddress));
            tokenURI = string.concat(tokenURI, ".json");
            return tokenURI;
        }
    
        function registerPokemon(uint wantedPokeID) public baseEvo(wantedPokeID){        
            uint tokenAddress = wantedPokeID;
            _safeMint(msg.sender,tokenAddress);
            string memory tokenURI = genToken(tokenAddress);
            _setTokenURI(tokenAddress, tokenURI);

            Pokemon memory pokemon;  
            pokemon = Pokemon(wantedPokeID,address(0),1,1,true);   
            trainers[msg.sender].push(wantedPokeID);
            IDdata[tokenAddress] = pokemon;
            setCost(wantedPokeID,1);
            emit RegisterPokemon(msg.sender,tokenURI,tokenAddress);
        }


        function requestPokemon(uint wantedPokeID) public isOwned(wantedPokeID) isNotOwner(wantedPokeID) hasNotReq(wantedPokeID) returns (uint){
            
            uint cost = costs[wantedPokeID];
            require (YODA(yoda).balanceOf(msg.sender) >=cost);
            if (requests[ownerOf(wantedPokeID)].length == 0){
                requests[ownerOf(wantedPokeID)] =  [[uint256(uint160(msg.sender)),wantedPokeID]];
            } else{
                requests[ownerOf(wantedPokeID)].push([uint256(uint160(msg.sender)),wantedPokeID]);
            }
            requesters[Strings.toString(uint256(uint160(msg.sender)))] = msg.sender;
            return cost;
        }

        function approvehelper(uint tradePokeID) private {
           for (uint i=0; i<requests[ownerOf(tradePokeID)].length; i++){
                if (requests[ownerOf(tradePokeID)][i][1]==tradePokeID){
                    requests[ownerOf(tradePokeID)][i] = requests[ownerOf(tradePokeID)][(requests[ownerOf(tradePokeID)].length)-1];
                    requests[ownerOf(tradePokeID)].pop();
                    approvehelper(tradePokeID);
                    break;
                }
            } 
        }
        function rejectHelper(uint tradePokeID, address requester) private {
           for (uint i=0; i<requests[ownerOf(tradePokeID)].length; i++){
                if ((requests[ownerOf(tradePokeID)][i][1]==tradePokeID) && (getAddy(Strings.toString(requests[ownerOf(tradePokeID)][i][0])) == requester)){
                    requests[ownerOf(tradePokeID)][i] = requests[ownerOf(tradePokeID)][(requests[ownerOf(tradePokeID)].length)-1];
                    requests[ownerOf(tradePokeID)].pop();
                    break;
                }
            } 

        }

        function approvePokemon(uint tradePokeID, address requester) isOwner(tradePokeID) public{
            require(requester!= msg.sender);
            approvehelper(tradePokeID);
            approve(requester,tradePokeID);
            tradePokemon(tradePokeID,requester);
        }

        function rejectPokemon(uint tradePokeID, address requester) isOwner(tradePokeID) public{ 
            require(requester!= msg.sender);
            rejectHelper(tradePokeID,requester);
        }
     

        function tradePokemon(uint wantedPokeID,address requester) private returns (uint){
            uint cost = costs[wantedPokeID];
            require (YODA(yoda).balanceOf(requester) >=cost);

            address initOwner = ownerOf(wantedPokeID);
            safeTransferFrom(initOwner, requester, wantedPokeID);
            for (uint i=0; i<trainers[initOwner].length;i++){
                if (trainers[initOwner][i]==wantedPokeID){
                    trainers[initOwner][i] = trainers[initOwner][trainers[initOwner].length-1];
                    trainers[initOwner].pop();
                    break;
                }
            }
            trainers[requester].push(wantedPokeID);
            return cost;

        }


    }