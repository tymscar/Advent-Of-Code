import * as fs from 'fs';

type Instruction = 'U' | 'R' | 'D' | 'L'
type Location = [number, number]
type State = {
    knots: Location[],
	visitedByTail: Location[]
}

const startingPos: Location = [0,0];
const numOfKnots = 10;

const getNewLocFromInstruction = (oldLoc: Location, instruction: Instruction): Location => {
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

const getNewLocFromParent = (oldLoc: Location, parentLoc: Location): Location => {
	if(isAdjacent(oldLoc, parentLoc)){
		return oldLoc;
	}
	if(oldLoc[0] === parentLoc[0]){ // vertically aligned
		if(parentLoc[1] > oldLoc[1])
			return [oldLoc[0], oldLoc[1] + 1];
		else
			return [oldLoc[0], oldLoc[1] - 1];
	} else if(oldLoc[1] === parentLoc[1]){ // horizontally aligned
		if(parentLoc[0] > oldLoc[0])
			return [oldLoc[0] + 1, oldLoc[1]];
		else
			return [oldLoc[0] - 1, oldLoc[1]];
	} else { // diagonally removed
		if(parentLoc[0] > oldLoc[0] && parentLoc[1] > oldLoc[1]) // top right
			return [oldLoc[0] + 1, oldLoc[1] + 1];
		else if(parentLoc[0] < oldLoc[0] && parentLoc[1] > oldLoc[1]) // bottom right
			return [oldLoc[0] - 1, oldLoc[1] + 1];
		else if(parentLoc[0] < oldLoc[0] && parentLoc[1] < oldLoc[1]) // bottom left
			return [oldLoc[0] - 1, oldLoc[1] - 1];
		else // top left
			return [oldLoc[0] + 1, oldLoc[1] - 1];
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
	const newLocations = oldState.knots.reduce((locations, currKnot, currIndex) => {
		if(currIndex === 0)
			return [...locations, getNewLocFromInstruction(currKnot, instruction)];
		else{
			const parentKnot = locations[currIndex-1];
			return [...locations, getNewLocFromParent(currKnot, parentKnot)];
		}
	}, [] as Location[]);

	return {
		knots: newLocations,
		visitedByTail: [...oldState.visitedByTail, newLocations[newLocations.length -1]]
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
	knots: Array(numOfKnots).fill(startingPos),
	visitedByTail: [startingPos]
} as State);

const uniqueTailVisits = new Set(finalState.visitedByTail.map(loc => loc.toString()));

console.log(uniqueTailVisits.size);
