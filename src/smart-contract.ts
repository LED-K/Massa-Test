/** 
Train bet application
Players will be able to bet on ETA of a train trip.
 **/

import { Storage } from "@massalabs/massa-sc-std";
//Date in UTC time
const arrivalDateTime  = new Date(1664961960000);

export function initialize(): void {
    Storage.set("trainStatus","scheduled");
    Storage.set("players","");
    Storage.set("winners","");
}

export function bet(_player : string, _selection : string) :void {
    let status = Storage.get("trainStatus");
    // if the train is still scheduled
    if(status == "scheduled"){
        let players = Storage.get("players");

        //check if this is the first bet
        if(players == ""){
            Storage.set("players",_player);
            console.log ("first bet");

            //check if selection is correct
            assert(_selection == "on time" || _selection == "rescheduled or late");
            Storage.set(_player,_selection);
        }else{
            let playersVec = players.split(",");

            //check if player already exists
            assert(playersVec.includes(_player));

            //Add player
            playersVec.push(_player);
            Storage.set("players",playersVec.join());

            //place player bet
            Storage.set(_player,_selection);
        }
    }      
    
}

export function checkWin() : void {
    //at the end of the game -> train arrival time
    let winners = Storage.get("winners");
    let winnersVec = winners.split(',');
    let timestamp = Date.now();
    let currentDateTime = new Date(timestamp);
    assert(currentDateTime != arrivalDateTime);
    let players = Storage.get("players");
    let playersVec = players.split(",");
    let status = Storage.get("trainStatus");
    for(let i =0;i<=playersVec.length;i++){
        //if the trip is delayed
        if(status ="on time" ){
            if(Storage.get(playersVec[i]) == "on time"){
                winnersVec.push(playersVec[i]);
            }
        //trip happened normally
        }else if(status=="delayed"){
            if(Storage.get(playersVec[i]) == "rescheduled or late"){
                winnersVec.push(playersVec[i]);
            }
        }
    }   
    Storage.set("Wnners",winnersVec.join());
}
