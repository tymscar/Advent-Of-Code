const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n').slice(2,4).map(a => a.split('')).map(a=>a.filter(b => ['A', 'B', 'C', 'D'].includes(b)));


const priceToMove = {
	'A': 1,
	'B': 10,
	'C': 100,
	'D': 1000
};

const correspondingRoomNumber = {
	'A': 0,
	'B': 1,
	'C': 2,
	'D': 3
};

const hallEntraceFinalRoom = {
	'A': 2,
	'B': 4,
	'C': 6,
	'D': 8
};

const hallEntranceOfRoom = {
	0: 2,
	1: 4,
	2: 6,
	3: 8
};


let world = {};
world.hall = ['.','.','.','.','.','.','.','.','.','.','.'];
world.rooms = [[input[1][0], input[0][0]],[input[1][1], input[0][1]],[input[1][2], input[0][2]],[input[1][3], input[0][3]]];

let queue = [world];
let bestPrice = [];
bestPrice[JSON.stringify(world)] = 0;

let winPrices = [];

while(queue.length >0){

	const currWorldState = queue.shift();
	const currentPrice = bestPrice[JSON.stringify(currWorldState)];

	//check if winner
	let winner = true;
	if(currWorldState.rooms[0][0] !== 'A' || currWorldState.rooms[0][1] !== 'A')
		winner = false;
	if(currWorldState.rooms[1][0] !== 'B' || currWorldState.rooms[1][1] !== 'B')
		winner = false;
	if(currWorldState.rooms[2][0] !== 'C' || currWorldState.rooms[2][1] !== 'C')
		winner = false;
	if(currWorldState.rooms[3][0] !== 'D' || currWorldState.rooms[3][1] !== 'D')
		winner = false;
	if(winner){
		winPrices.push(currentPrice);
		continue;
	}

	// move hallway pieces that can be moved
	for(let hallLoc= 0; hallLoc<11; hallLoc++){
		const animalType = currWorldState.hall[hallLoc];
		if(animalType !== '.'){// There is an animal here
			const targetRoom = correspondingRoomNumber[animalType];
			const howManyInFinalRoom = currWorldState.rooms[targetRoom].length;
			if(howManyInFinalRoom >= 2){
				continue; //room is full
			} else if (howManyInFinalRoom === 1){
				if(currWorldState.rooms[targetRoom][0] !== animalType){
					continue; //room has the wrong animal inside so dont go
				}
			}
			//room is empty or has exactly one animal of same type
			const targetHall = hallEntraceFinalRoom[animalType];
			const step = targetHall > hallLoc ? 1 : -1;
			let pos = hallLoc;
			let canWalkThere = true;
			let extraPrice = 0;
			while (pos !== targetHall){
				pos += step;
				if(currWorldState.hall[pos] !== '.'){
					canWalkThere = false;
				}
				extraPrice += priceToMove[animalType];
			}
			if(!canWalkThere)
				continue; // hit something on my way
			if(howManyInFinalRoom === 0)
				extraPrice += (2 * priceToMove[animalType]);
			else
				extraPrice += priceToMove[animalType];

			const newState = structuredClone(currWorldState);
			newState.rooms[targetRoom] = [animalType, ...newState.rooms[targetRoom]];
			newState.hall[hallLoc] = '.';
			const newPrice = currentPrice + extraPrice;
			const oldPriceOfNewState = bestPrice[JSON.stringify(newState)] || 999_999_999;
			if(newPrice < oldPriceOfNewState){
				bestPrice[JSON.stringify(newState)] = newPrice;
				queue.push(newState);
			}
		}
	}

	// move room pieces that can be moved
	for(let roomId = 0; roomId < 4; roomId++){
		let extraPrice = 0;
		const itemsInRoom = currWorldState.rooms[roomId].length;
		if(itemsInRoom === 0){
			continue; // The room is empty, nothing to move out
		}
		if(itemsInRoom === 1){
			if(correspondingRoomNumber[currWorldState.rooms[roomId][0]] === roomId){
				continue; // Item is in its final room
			}
			extraPrice++;
		}

		if(itemsInRoom === 2){ // Theres two items in the room
			if(correspondingRoomNumber[currWorldState.rooms[roomId][0]] === roomId &&
                correspondingRoomNumber[currWorldState.rooms[roomId][1]] === roomId){
				continue; // Both items in final place, dont move
			}
		}

		extraPrice++;

		const possibleNewPlacesAndPrice = [];

		// exploreLeft;
		let pos = hallEntranceOfRoom[roomId]-1;
		while(pos >= 0){
			if(currWorldState.hall[pos] === '.'){
				extraPrice++;
			} else {
				break;
			}
			possibleNewPlacesAndPrice.push([pos, extraPrice]);
			pos--;
		}

		// exploreRight;
		pos = hallEntranceOfRoom[roomId]+1;
		while(pos <= 10){
			if(currWorldState.hall[pos] === '.'){
				extraPrice++;
			} else {
				break;
			}
			possibleNewPlacesAndPrice.push([pos, extraPrice]);
			pos++;
		}

		const validNewPlaces = possibleNewPlacesAndPrice.filter(place => ![2,4,6,8].includes(place[0]));
		validNewPlaces.forEach(validNewPlace => {
			const newState = structuredClone(currWorldState);
			const itemMoved = newState.rooms[roomId].shift();
			newState.hall[validNewPlace[0]] = itemMoved;
			const newPrice = currentPrice + (extraPrice * priceToMove[itemMoved]);
			const oldPriceOfNewState = bestPrice[JSON.stringify(newState)] || 999_999_999;
			if(newPrice < oldPriceOfNewState){
				bestPrice[JSON.stringify(newState)] = newPrice;
				queue.push(newState);
			}
		});
	}
}

console.log(Math.min(...winPrices));