import * as fs from 'fs';

type Position = [number, number];

type Point = {
    height: number,
    isEnd: boolean,
}

type CostMap = {
    [name: string]: number
}

const getHeightOfChar = (char: string): number => char.charCodeAt(0)-97;

const getNeighbours = (from: Position, map: Point[][]): Position[] => {
	return [
		from[0] > 0 ? [from[0] - 1, from[1]] : [-1, -1],
		from[1] > 0 ? [from[0], from[1] - 1] : [-1, -1],
		from[0] < map.length - 1 ? [from[0] + 1, from[1]] : [-1, -1], // Maybe bug
		from[1] < map[0].length - 1 ? [from[0], from[1] + 1] : [-1, -1], // Maybe bug
	].filter(a => a[0] !== -1) as Position[];
};

const input = fs.readFileSync('inputs/day12.txt', 'utf8')
	.split('\n')
	.filter(l => l.length > 0)
	.map(l => l.split(''));

const starting: Position[] = input.map((row, i) => {
	return row.map((point, j) => {
		if(point === 'a' || point === 'S')
			return [i, j];
	}).filter(a => a != undefined);
}).flat() as Position[];

const endPosx = input.findIndex(l => l.includes('E'));
const endPosy = input[endPosx].findIndex(l => l === 'E');
const end: Position = [endPosx, endPosy];

const map = input.map(row => row.map(point => {
	if(point === 'S')
		return {
			height: getHeightOfChar('a'),
			isEnd: false
		} as Point;
	else if(point === 'E')
		return {
			height: getHeightOfChar('z'),
			isEnd: true
		} as Point;
	return {
		height: getHeightOfChar(point),
		isEnd: false
	} as Point;
}));

const dijkstra = (start: Position, endPositions: Position[], map: Point[][]): number => {
  
	const visited: string[] = [];
	const toVisit: Position[] = [start];
	const lowestCost: CostMap = { 
		[start.toString()]: 0 
	};
  
	let curr;
	while ((curr = toVisit.shift())) {
		if(visited.includes(curr.toString()))
			continue;
		const currHeight = map[curr[0]][curr[1]].height;
		const neighbours = getNeighbours(curr, map).filter((n: Position) => !visited.includes(n.toString()));
		const reachableNeighbours = neighbours.filter(neighbour => map[neighbour[0]][neighbour[1]].height + 1 >= currHeight);
  
		toVisit.push(...reachableNeighbours);
  
		const costToCurr = lowestCost[curr.toString()];
  
		reachableNeighbours.forEach(neighbour => {
			const newCostToNeighbour = costToCurr + 1;
			const costToNeighbour = lowestCost[neighbour.toString()] === undefined ? newCostToNeighbour : lowestCost[neighbour.toString()];
			
			if (newCostToNeighbour <= costToNeighbour) {
				lowestCost[neighbour.toString()] = newCostToNeighbour;
			}
		});
  
		visited.push(curr.toString());
	}

	const startingCosts = endPositions.map(startPos => lowestCost[startPos.toString()]).filter(p => p !== undefined);

	return Math.min(...startingCosts);
};

const answer = dijkstra(end, starting, map);

console.log(answer);
