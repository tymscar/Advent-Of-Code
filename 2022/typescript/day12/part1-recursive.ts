// Wanted to do a recursive version but it exceeds the max call stack on actual input, although it works on demo data!
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
		from[0] < map.length - 1 ? [from[0] + 1, from[1]] : [-1, -1],
		from[1] < map[0].length - 1 ? [from[0], from[1] + 1] : [-1, -1],
	].filter(a => a[0] !== -1) as Position[];
};

const input = fs.readFileSync('day12.txt', 'utf8')
	.split('\n')
	.filter(l => l.length > 0)
	.map(l => l.split(''));

const startPosx = input.findIndex(l => l.includes('S'));
const startPosy = input[startPosx].findIndex(l => l === 'S');
const start: Position = [startPosx, startPosy];

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

const dijkstra = (visited: string[], toVisit: Position[], lowestCost: CostMap, map: Point[][]): CostMap => {
	
	if(toVisit.length === 0)
		return lowestCost;

	const curr = toVisit[0];
	
	const currToVisit = toVisit.slice(1);
	
	if(!visited.includes(curr.toString())){
		const currHeight = map[curr[0]][curr[1]].height;
		const neighbours = getNeighbours(curr, map).filter((n: Position) => !visited.includes(n.toString()));
		const reachableNeighbours = neighbours.filter(neighbour => map[neighbour[0]][neighbour[1]].height <= (currHeight + 1));
		const costToCurr = lowestCost[curr.toString()];
	
		reachableNeighbours.forEach(neighbour => {
			const newCostToNeighbour = costToCurr + 1;
			const costToNeighbour = lowestCost[neighbour.toString()] === undefined ? newCostToNeighbour : lowestCost[neighbour.toString()];
				
			if (newCostToNeighbour <= costToNeighbour) {
				lowestCost[neighbour.toString()] = newCostToNeighbour;
			}
		});
		const newToVisit = [...currToVisit, ...reachableNeighbours];
		const newVisited = [...visited, curr.toString()];
		return dijkstra(newVisited, newToVisit, lowestCost, map);
	} else {
		if(currToVisit.length === 0)
			return lowestCost;
		return dijkstra(visited, currToVisit, lowestCost, map);
	}
};

const runDijkstra = (start: Position, end: Position, map: Point[][]): number => {

	const cost = dijkstra([], [start], { [start.toString()]: 0 }, map);

	return cost[end.toString()];
};

console.log(runDijkstra(start, end, map));
