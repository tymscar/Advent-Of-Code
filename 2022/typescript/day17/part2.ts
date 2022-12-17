import * as fs from 'fs';
import { Shape, shapes } from './shapes';

type Move = {
    id: number,
    xPos: number
}

type Position = [number, number]

type SimulationAnswer = {
    moves: Move[],
    height: number
}

const validPos = (pos: Position, shape: Shape, map: Map<string, boolean>): boolean => {
	if(pos[1] < 0)
		return false;
	if(pos[0] < 0 || (pos[0] + shape.width) > 7 )
		return false;
	for(let i=0; i<shape.form.length; i++){
		for(let j=0; j<shape.form[0].length; j++){
			if(shape.form[i][j] === '#'){
				if(map.has([pos[0] + j, pos[1] + i].toString()))
					return false;
			}
		}
	}
	return true;
};

const simulateDrops = (wind: string[], howManyRocksToDrop: number): SimulationAnswer => {
	const map = new Map<string, boolean>();
	const moves: Move[] = [];
    
	let top = 0;
	let droppedRocks = 0;
	let rockIdx = 0;
	let windIdx = 0;
	while(droppedRocks < howManyRocksToDrop ){
		const currRock = shapes[rockIdx % shapes.length];
		rockIdx++;
		let currPos: Position = [2, top + 3];
		let stopped = false;
		while(!stopped){
			const move = wind[windIdx % wind.length];
			windIdx++;
			if(move === '>'){
				if(validPos([currPos[0] + 1, currPos[1]], currRock, map)){ // can go right
					currPos = [currPos[0] + 1, currPos[1]];
				}
			} else {
				if(validPos([currPos[0] - 1, currPos[1]], currRock, map)){ // can go left
					currPos = [currPos[0] - 1, currPos[1]];
				}
			}
			if(validPos([currPos[0], currPos[1] - 1], currRock, map)){ // can go down
				currPos = [currPos[0], currPos[1] - 1];
			} else { // touched down
				stopped = true;
				top = Math.max(top, currRock.height + currPos[1]);
				for(let i=0; i<currRock.form.length; i++){
					for(let j=0; j<currRock.form[0].length; j++){
						if(currRock.form[i][j] === '#')
							map.set([currPos[0] + j, currPos[1] + i].toString(), true);
					}
				}
			}
		}
		droppedRocks++;
		moves.push({
			id: currRock.id,
			xPos: currPos[0]
		});
	}

	return {
		moves: moves,
		height: top
	};
};

const wind = fs.readFileSync('inputs/day17.txt', 'utf8').trim().split('');

const rocksToDropToFindLoop = 10000;
const firstRun = simulateDrops(wind, rocksToDropToFindLoop);

let maxlen = -1;
let loopStart = 0;
let loopLenght = 0;
for(let firstStart = 0; firstStart < rocksToDropToFindLoop - 1; firstStart++){
	for(let nextStart = firstStart + 1; nextStart < rocksToDropToFindLoop; nextStart ++){
		let first = firstStart;
		let next = nextStart;
		while(next < rocksToDropToFindLoop){
			if(firstRun.moves[first].id != firstRun.moves[next].id || firstRun.moves[first].xPos != firstRun.moves[next].xPos)
				break;
			first++;
			next++;
		}
		if(first - firstStart > maxlen){
			maxlen = first - firstStart;
			loopStart = firstStart;
			loopLenght = nextStart - firstStart;
		}
	}
}

const linesInStart = simulateDrops(wind, loopStart).height;
const linesInLoop = simulateDrops(wind, loopStart + loopLenght).height - linesInStart;
const howManyLoops = Math.floor((1000000000000 - loopStart) / loopLenght);
const rocksInLoops = howManyLoops * loopLenght;
const rocksAfterLoops = 1000000000000 - loopStart - rocksInLoops;
const linesAfterLoop = simulateDrops(wind, loopStart + loopLenght + rocksAfterLoops).height - linesInLoop - linesInStart;

const answer = linesInStart + linesInLoop * howManyLoops + linesAfterLoop;

console.log(answer);
