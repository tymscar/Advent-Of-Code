const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n').slice(2,4).map(a => a.split('')).map(a=>a.filter(b => ['A', 'B', 'C', 'D'].includes(b)));

const connections = [];
connections['hall0'] = ['hall1'];
connections['hall1'] = ['hall0', 'room01', 'room00', 'hall3'];
connections['hall3'] = ['hall1', 'room01', 'room00', 'room11', 'room10', 'hall5'];
connections['hall5'] = ['hall3', 'room11', 'room10', 'room21', 'room20', 'hall7'];
connections['hall7'] = ['hall5', 'room21', 'room20', 'room31', 'room30', 'hall9'];
connections['hall9'] = ['hall7', 'room31', 'room30', 'hall10'];
connections['hall10'] = ['hall9'];
connections['room01'] = ['hall1', 'hall3'];
connections['room00'] = ['hall1', 'hall3'];
connections['room11'] = ['hall3', 'hall5'];
connections['room10'] = ['hall3', 'hall5'];
connections['room21'] = ['hall5', 'hall7'];
connections['room20'] = ['hall5', 'hall7'];
connections['room31'] = ['hall7', 'hall9'];
connections['room30'] = ['hall7', 'hall9'];

const priceToMove = {
	'A': 1,
	'B': 10,
	'C': 100,
	'D': 1000
};

const destinationRoomFor = {
	'A': ['room00','room01'],
	'B': ['room10','room11'],
	'C': ['room20','room21'],
	'D': ['room30','room31']
};

const neighbourRoom = {
	'room00': 'room01',
	'room01': 'room00',
	'room10': 'room11',
	'room11': 'room10',
	'room20': 'room21',
	'room21': 'room20',
	'room30': 'room31',
	'room31': 'room30'
};

const bottomRooms = ['room00','room10','room20','room30'];
const rooms = ['room00','room01','room10','room11','room20','room21','room30','room31'];
const halls = ['hall0', 'hall1', 'hall3', 'hall5', 'hall7', 'hall9', 'hall10'];

const bestCosts = new Map();
bestCosts.set(['hall0', 'hall1'].toString(), 1);

bestCosts.set(['hall1', 'hall0'].toString(), 1);
bestCosts.set(['hall1', 'room01'].toString(), 2);
bestCosts.set(['hall1', 'room00'].toString(), 3);
bestCosts.set(['hall1', 'hall3'].toString(), 2);

bestCosts.set(['hall3', 'hall1'].toString(), 2);
bestCosts.set(['hall3', 'room01'].toString(), 2);
bestCosts.set(['hall3', 'room00'].toString(), 3);
bestCosts.set(['hall3', 'room11'].toString(), 2);
bestCosts.set(['hall3', 'room10'].toString(), 3);
bestCosts.set(['hall3', 'hall5'].toString(), 2);

bestCosts.set(['hall5', 'hall3'].toString(), 2);
bestCosts.set(['hall5', 'room11'].toString(), 2);
bestCosts.set(['hall5', 'room10'].toString(), 3);
bestCosts.set(['hall5', 'room21'].toString(), 2);
bestCosts.set(['hall5', 'room20'].toString(), 3);
bestCosts.set(['hall5', 'hall7'].toString(), 2);

bestCosts.set(['hall7', 'hall5'].toString(), 2);
bestCosts.set(['hall7', 'room21'].toString(), 2);
bestCosts.set(['hall7', 'room20'].toString(), 3);
bestCosts.set(['hall7', 'room31'].toString(), 2);
bestCosts.set(['hall7', 'room30'].toString(), 3);
bestCosts.set(['hall7', 'hall9'].toString(), 2);

bestCosts.set(['hall9', 'hall7'].toString(), 2);
bestCosts.set(['hall9', 'room31'].toString(), 2);
bestCosts.set(['hall9', 'room30'].toString(), 3);
bestCosts.set(['hall9', 'hall10'].toString(), 1);

bestCosts.set(['hall10', 'hall9'].toString(), 1);

bestCosts.set(['room01', 'hall1'].toString(), 2);
bestCosts.set(['room01', 'hall3'].toString(), 2);

bestCosts.set(['room00', 'hall1'].toString(), 3);
bestCosts.set(['room00', 'hall3'].toString(), 3);

bestCosts.set(['room11', 'hall3'].toString(), 2);
bestCosts.set(['room11', 'hall5'].toString(), 2);

bestCosts.set(['room10', 'hall3'].toString(), 3);
bestCosts.set(['room10', 'hall5'].toString(), 3);

bestCosts.set(['room21', 'hall5'].toString(), 2);
bestCosts.set(['room21', 'hall7'].toString(), 2);

bestCosts.set(['room20', 'hall5'].toString(), 3);
bestCosts.set(['room20', 'hall7'].toString(), 3);

bestCosts.set(['room31', 'hall7'].toString(), 2);
bestCosts.set(['room31', 'hall9'].toString(), 2);

bestCosts.set(['room30', 'hall7'].toString(), 3);
bestCosts.set(['room30', 'hall9'].toString(), 3);



let world = {};
world.amphipods = [];
world.amphipods[0] = {};
world.amphipods[0].pos = 'room01';
world.amphipods[0].colour = input[0][0];
world.amphipods[1] = {};
world.amphipods[1].pos = 'room00';
world.amphipods[1].colour = input[1][0];
world.amphipods[2] = {};
world.amphipods[2].pos = 'room11';
world.amphipods[2].colour = input[0][1];
world.amphipods[3] = {};
world.amphipods[3].pos = 'room10';
world.amphipods[3].colour = input[1][1];
world.amphipods[4] = {};
world.amphipods[4].pos = 'room21';
world.amphipods[4].colour = input[0][2];
world.amphipods[5] = {};
world.amphipods[5].pos = 'room20';
world.amphipods[5].colour = input[1][2];
world.amphipods[6] = {};
world.amphipods[6].pos = 'room31';
world.amphipods[6].colour = input[0][3];
world.amphipods[7] = {};
world.amphipods[7].pos = 'room30';
world.amphipods[7].colour = input[1][3];
world.price = 0;

const queue = [world];
const bestStatePrice = new Map();
const winPrices = [];

// let moves = 10000000;
while(queue.length >0){
	// moves--;
	const currWroldState = queue.shift();
	// console.log(currWroldState);
    
	//Check if one of the winner states
	let winner = true;
	for(let i=0; i<8; i++)
		winner = winner && destinationRoomFor[currWroldState.amphipods[i].colour].includes(currWroldState.amphipods[i].pos);
	if(winner){
		winPrices.push(currWroldState.price);
		continue;
	}

	const currUsedPlaces = [];
	const whatIsInPlace = [];
	for(let amphIndex=0; amphIndex<8; amphIndex++){
		currUsedPlaces.push(currWroldState.amphipods[amphIndex].pos);
		whatIsInPlace[currWroldState.amphipods[amphIndex].pos] = currWroldState.amphipods[amphIndex].colour;
	}


	//Find every possible move for each amphipod
	for(let amphIndex=0; amphIndex<8; amphIndex++){
		const currPosName = currWroldState.amphipods[amphIndex].pos;
		if(rooms.includes(currPosName)){ // Im in a room
			if(destinationRoomFor[currWroldState.amphipods[amphIndex].colour].includes(currPosName)){ // Im in my final room
				if(bottomRooms.includes(currPosName)){ // In my room at the bottom, dont move
					continue;
				}
				if(whatIsInPlace[neighbourRoom[currWroldState.amphipods[amphIndex].pos]] === currWroldState.amphipods[amphIndex].colour){ // Both spots are perfect, dont move
					continue;
				}
				// I am in my final room but I am blocking so I have to move to the hallway
				// will move outside of this 'if'
			}
			// I am in a room but it's not my final room
			if(bottomRooms.includes(currPosName) && whatIsInPlace[neighbourRoom[currPosName]] !== undefined){
				continue; //I am in the bottom room and there is someone blocking me so stay here
			}

			const placesToMoveTo = [];
			const placesToMoveToNames = [];
			let miniqueue = [...connections[currPosName].map(connection => [connection, bestCosts.get([currPosName, connection].toString())])];
			while(miniqueue.length > 0){
				const [currPlaceToTry, currPrice] = miniqueue.pop();
				if(halls.includes(currPlaceToTry) && !placesToMoveToNames.includes(currPlaceToTry) && whatIsInPlace[currPlaceToTry] === undefined){
					placesToMoveTo.push([currPlaceToTry, currPrice]);
					placesToMoveToNames.push(currPlaceToTry);
					miniqueue = [...miniqueue, ...connections[currPlaceToTry].map(connection => [connection, bestCosts.get([currPlaceToTry, connection].toString()) + currPrice])];
				}
			}
			placesToMoveTo.forEach(placeToMove =>{
				const newState = structuredClone(currWroldState);
				newState.amphipods[amphIndex].pos = placeToMove[0];
				newState.price += placeToMove[1] * priceToMove[currWroldState.amphipods[amphIndex].colour];
				const bestOldPrice = bestStatePrice.get(JSON.stringify(newState)) || 999_999_999;
				if(newState.price < bestOldPrice){
					bestStatePrice.set(JSON.stringify(newState), newState.price);
					queue.push(newState);
				}
			});
		} else { // I am in a hallway
            
		}
	}
}

console.log(winPrices);