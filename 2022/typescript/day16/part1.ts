import * as fs from 'fs';

type Room = {
	name: string,
	flow: number,
	adj: string[]
}

type InputRoomMap = {
	[name: string]: Room
}

type CostMap = {
    [name: string]: number
}

type PricesRoomMap = {
	[name: string]: CostMap
}

type Path = {
	curr: string,
	toVisit: string[],
	timeLeft: number,
	finished: boolean,
	steps: string[],
	finalPressure: number
}

const sortPathByPressure = (a: Path, b: Path) => b.finalPressure - a.finalPressure;

const getMaxPressure = (time: number, destinations: Room[], priceMap: PricesRoomMap, roomsFromName: InputRoomMap) => {
	const paths: Path[] = [{
		curr: 'AA',
		toVisit: destinations.map(r => r.name),
		timeLeft: time,
		finished: false,
		steps: [],
		finalPressure: 0
	}];

	for (let n = 0; n < paths.length; n++) {
		const path = paths[n];
		if (path.timeLeft <= 0 || path.finished){
			path.finished = true;
			continue;
		}

		const currPrices = priceMap[path.curr];
		let madeNewPath = false;
		path.toVisit.forEach(room => {
			if (room !== path.curr && path.timeLeft - currPrices[room] > 1) {
				madeNewPath = true;
				paths.push({
					curr: room,
					toVisit: path.toVisit.filter(v => v != room),
					timeLeft: path.timeLeft - currPrices[room] - 1,
					finished: false,
					steps: [...path.steps, room],
					finalPressure: path.finalPressure + (path.timeLeft - currPrices[room] - 1) * roomsFromName[room].flow
				});
			}
		});
		if (!madeNewPath)
			path.finished = true;
	}

	return paths.filter(p => p.finished).sort(sortPathByPressure)[0].finalPressure;
};

const dijkstra = (start: Room, endPositions: Room[], map: InputRoomMap): CostMap => {
	const visited: string[] = [];
	const toVisit: Room[] = [start];
	const lowestCost: CostMap = { 
		[start.name]: 0 
	};
  
	let curr;
	while ((curr = toVisit.shift())) {
		if(visited.includes(curr.name))
			continue;
		
		const worthItAdj = curr.adj.filter(neighbour => !visited.includes(neighbour)).map(neighbour => map[neighbour]);
  
		toVisit.push(...worthItAdj);
  
		const costToCurr = lowestCost[curr.name];
  
		worthItAdj.forEach(neighbour => {
			const newCostToNeighbour = costToCurr + 1;
			const costToNeighbour = lowestCost[neighbour.name] === undefined ? newCostToNeighbour : lowestCost[neighbour.name];
			
			if (newCostToNeighbour <= costToNeighbour) {
				lowestCost[neighbour.name] = newCostToNeighbour;
			}
		});
  
		visited.push(curr.name);
	}

	return endPositions.reduce((map:CostMap, room:Room) => {
		return{
			...map,
			[room.name]: lowestCost[room.name]
		};
	}, {});
};

const input: Room[] = fs.readFileSync('inputs/day16.txt', 'utf8')
	.split('\n')
	.filter(line => line.length > 0)
	.map(l => {
		const line = l.split(' ');
		const name = line[1];
		const adj = line.slice(9).map(v => v.replace(',', ''));
		const flow = Number(line[4].split('=')[1].slice(0, -1));
		return {
			name: name,
			flow: flow,
			adj: adj
		} as Room;
	});

const inputRooms: InputRoomMap = input.reduce((map, currRoom) => ({
	...map,
	[currRoom.name]: currRoom
}), {} as InputRoomMap);

const startingRoom = inputRooms['AA'];

const startingRooms = [startingRoom, ...input.filter(room => room.flow != 0)];
const destinationRooms = input.filter(room => room.flow != 0);

const roomsMovePrices: PricesRoomMap = startingRooms.reduce((map: PricesRoomMap, room: Room) => {
	return {
		...map,
		[room.name]: dijkstra(room, destinationRooms.filter(r => r.name != room.name), inputRooms)
	};
}, {} as PricesRoomMap);

const answer = getMaxPressure(30, destinationRooms, roomsMovePrices, inputRooms);

console.log(answer);
