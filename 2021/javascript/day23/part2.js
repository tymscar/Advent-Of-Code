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
world.rooms = [[input[0][0], 'D', 'D', input[1][0]],[input[0][1], 'C', 'B', input[1][1]],[input[0][2], 'B', 'A', input[1][2]],[input[0][3], 'A', 'C', input[1][3]]];

let queue = [world];
let bestPrice = [];
bestPrice[JSON.stringify(world)] = 0;

let winPrices = [];

while(queue.length >0){

	const currWorldState = queue.shift();
	const currentPrice = bestPrice[JSON.stringify(currWorldState)];

	//check if winner
	let winner = true;
	if(currWorldState.rooms[0][0] !== 'A' || currWorldState.rooms[0][1] !== 'A' || currWorldState.rooms[0][2] !== 'A' || currWorldState.rooms[0][3] !== 'A')
		winner = false;
	if(currWorldState.rooms[1][0] !== 'B' || currWorldState.rooms[1][1] !== 'B' || currWorldState.rooms[1][2] !== 'B' || currWorldState.rooms[1][3] !== 'B')
		winner = false;
	if(currWorldState.rooms[2][0] !== 'C' || currWorldState.rooms[2][1] !== 'C' || currWorldState.rooms[2][2] !== 'C' || currWorldState.rooms[2][3] !== 'C')
		winner = false;
	if(currWorldState.rooms[3][0] !== 'D' || currWorldState.rooms[3][1] !== 'D' || currWorldState.rooms[3][2] !== 'D' || currWorldState.rooms[3][3] !== 'D')
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
			if(howManyInFinalRoom >= 4){
				continue; //room is full
			} else if (howManyInFinalRoom > 0){
				let differentTypes = false;
				for(let i=0; i<howManyInFinalRoom; i++)
					if(currWorldState.rooms[targetRoom][i] !== animalType){
						differentTypes = true;
						break;
					}
				if(differentTypes){ //room has the wrong animal inside so dont go
					continue;
				}
			}
			//room is empty or has animals of the same type
			const targetHall = hallEntraceFinalRoom[animalType];
			const step = targetHall > hallLoc ? 1 : -1;
			let pos = hallLoc;
			let hitSomething = false;
			let extraPrice = 0;
			while (pos !== targetHall){
				pos += step;
				if(currWorldState.hall[pos] !== '.'){
					hitSomething = true;
				}
				extraPrice += priceToMove[animalType];
			}
			if(hitSomething)
				continue; // hit something on my way

			extraPrice += ((4-howManyInFinalRoom) * priceToMove[animalType]);


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
			extraPrice += 3;
		}

		if(itemsInRoom === 2){ // Theres two items in the room
			if(correspondingRoomNumber[currWorldState.rooms[roomId][0]] === roomId &&
				correspondingRoomNumber[currWorldState.rooms[roomId][1]] === roomId){
				continue; // Both items in final place, dont move
			}
			extraPrice += 2;
		}

		if(itemsInRoom === 3){ // Theres three items in the room
			if(correspondingRoomNumber[currWorldState.rooms[roomId][0]] === roomId &&
				correspondingRoomNumber[currWorldState.rooms[roomId][1]] === roomId &&
				correspondingRoomNumber[currWorldState.rooms[roomId][2]] === roomId){
				continue; // all three items in final place, dont move
			}
			extraPrice += 1;
		}

		if(itemsInRoom === 4){ // Theres four items in the room
			if(correspondingRoomNumber[currWorldState.rooms[roomId][0]] === roomId &&
				correspondingRoomNumber[currWorldState.rooms[roomId][1]] === roomId &&
				correspondingRoomNumber[currWorldState.rooms[roomId][2]] === roomId &&
				correspondingRoomNumber[currWorldState.rooms[roomId][3]] === roomId){
				continue; // all four items in final place, dont move
			}
		}

		extraPrice++;

		let beforeMovePrice = extraPrice;

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

		extraPrice = beforeMovePrice;

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
			const newPrice = currentPrice + (validNewPlace[1] * priceToMove[itemMoved]);
			const oldPriceOfNewState = bestPrice[JSON.stringify(newState)] || 999_999_999;
			if(newPrice < oldPriceOfNewState){
				bestPrice[JSON.stringify(newState)] = newPrice;
				queue.push(newState);
			}
		});
	}
}

console.log(Math.min(...winPrices));