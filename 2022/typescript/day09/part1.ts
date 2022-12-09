import * as fs from 'fs';

type Instruction = 'U' | 'R' | 'D' | 'L'
type Location = [number, number]
type State = {
    headLoc: Location,
	lastHeadLoc: Location,
	tailLoc: Location,
	visitedByTail: Location[]
}

const startingPos: Location = [0,0];

const getNewLoc = (oldLoc: Location, instruction: Instruction): Location => {
	switch(instruction){
	case 'U':
		return [oldLoc[0] - 1, oldLoc[1]];
	case 'R':
		return [oldLoc[0], oldLoc[1] + 1];
	case 'D':
		return [oldLoc[0] + 1, oldLoc[1]];
	case 'L':
		return [oldLoc[0], oldLoc[1] - 1];
	}
};

const isAdjacent = (a: Location, b: Location): boolean => {
	const inRange = [
		[a[0], a[1]],
		[a[0] + 1, a[1]],
		[a[0] + 1, a[1] + 1],
		[a[0], a[1] + 1],
		[a[0] - 1, a[1] + 1],
		[a[0] - 1, a[1]],
		[a[0] - 1, a[1] - 1],
		[a[0], a[1] - 1],
		[a[0] + 1, a[1] - 1],
	];

	return inRange.map(pos => pos.toString()).includes(b.toString());
};

const applyInstruction = (oldState: State, instruction: Instruction): State => {
	const newHeadLoc = getNewLoc(oldState.headLoc, instruction);
	const lastHeadLoc = oldState.headLoc;

	if(!isAdjacent(oldState.tailLoc, newHeadLoc)){
		return {
			headLoc: newHeadLoc,
			lastHeadLoc: lastHeadLoc,
			tailLoc: lastHeadLoc,
			visitedByTail: [...oldState.visitedByTail, lastHeadLoc]
		};
	}

	return {
		...oldState,
		headLoc: newHeadLoc,
		lastHeadLoc: lastHeadLoc,
	};
};

const input = fs.readFileSync('inputs/day09.txt', 'utf8').split('\n').filter(l => l.length > 0);
const instructions: Instruction[] = input.flatMap(line => {
	const current = line.split(' ');
	const direction = current[0] as Instruction;
	const count = Number(current[1]);
	return Array(count).fill(direction);
});

const finalState: State = instructions.reduce(applyInstruction, {
	headLoc: startingPos,
	lastHeadLoc: startingPos,
	tailLoc: startingPos,
	visitedByTail: [startingPos]
} as State);

const uniqueTailVisits = new Set(finalState.visitedByTail.map(loc => loc.toString()));

console.log(uniqueTailVisits.size);
