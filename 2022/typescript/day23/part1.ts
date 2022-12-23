import * as fs from 'fs';

type State = {
    elves: Elf[],
    moved: boolean
}

type Elf = {
	pos: number[],
	tentative: number[],
    neighboursPos: number[][],
    neighbours: (number[] | undefined)[],
	willMove: boolean
}

const getNeighbourPos = (elf: Elf): number[][] => {
	const curr = elf.pos;
	return [
		[curr[0] - 1, curr[1] - 1], // NW
		[curr[0] - 1, curr[1]    ], // N
		[curr[0] - 1, curr[1] + 1], // NE
		[curr[0],     curr[1] + 1], // E
		[curr[0] + 1, curr[1] + 1], // SE
		[curr[0] + 1, curr[1]    ], // S
		[curr[0] + 1, curr[1] - 1], // SW
		[curr[0],     curr[1] - 1], // W

	];
};

const northCheck = (elf: Elf): number[] | undefined => {
	if(elf.neighbours[0] === undefined && elf.neighbours[1] === undefined && elf.neighbours[2] === undefined){ // North
		return [elf.pos[0] - 1, elf.pos[1]];
	}
	return undefined;
};

const southCheck = (elf: Elf): number[] | undefined => {
	if(elf.neighbours[4] === undefined && elf.neighbours[5] === undefined && elf.neighbours[6] === undefined){ // South
		return [elf.pos[0] + 1, elf.pos[1]];
	}
	return undefined;
};

const westCheck = (elf: Elf): number[] | undefined => {
	if(elf.neighbours[0] === undefined && elf.neighbours[6] === undefined && elf.neighbours[7] === undefined){ // West
		return [elf.pos[0], elf.pos[1] - 1];
	}
	return undefined;
};

const eastCheck = (elf: Elf): number[] | undefined => {
	if(elf.neighbours[2] === undefined && elf.neighbours[3] === undefined && elf.neighbours[4] === undefined){ // East
		return [elf.pos[0], elf.pos[1] + 1];
	}
	return undefined;
};

const getTentativeBasedOnRound = (elf: Elf, round: number): number[] | undefined => {

	if(round % 4 === 0){
		const newLocations = [
			northCheck,
			southCheck,
			westCheck,
			eastCheck
		].map(check => check(elf));
		const firstValid = newLocations.find(loc => loc !== undefined);
		if(firstValid !== undefined)
			return firstValid;
	} else if(round % 4 === 1){
		const newLocations = [
			southCheck,
			westCheck,
			eastCheck,
			northCheck
		].map(check => check(elf));
		const firstValid = newLocations.find(loc => loc !== undefined);
		if(firstValid !== undefined)
			return firstValid;
	} else if(round % 4 === 2){
		const newLocations = [
			westCheck,
			eastCheck,
			northCheck,
			southCheck
		].map(check => check(elf));
		const firstValid = newLocations.find(loc => loc !== undefined);
		if(firstValid !== undefined)
			return firstValid;
	} else {
		const newLocations = [
			eastCheck,
			northCheck,
			southCheck,
			westCheck
		].map(check => check(elf));
		const firstValid = newLocations.find(loc => loc !== undefined);
		if(firstValid !== undefined)
			return firstValid;
	}
	
	return undefined;
};

const moveRound = (elves: Elf[], round: number): State => {
	const currentElves: Elf[] = JSON.parse(JSON.stringify(elves));
	const occupied = new Set();
	const tentativeMap = new Map<string, number>();
	let moved = false;

	currentElves.forEach(elf =>{
		occupied.add(elf.pos.toString());
		elf.neighboursPos = getNeighbourPos(elf);
	});

	currentElves.forEach(elf =>{
		occupied.add(elf.pos.toString());
		elf.neighbours = elf.neighboursPos.map(n => {
			if(occupied.has((n as number[]).toString())){
				return n;
			}
			return undefined;
		});
	});

	currentElves.forEach(elf => {
		const occupiedNeighbours = elf.neighboursPos.filter(n => occupied.has(n.toString())).length;
		elf.willMove = occupiedNeighbours > 0 ? true : false;
		if (elf.willMove) { 
			const tentative = getTentativeBasedOnRound(elf, round);
			if(tentative === undefined){
				elf.willMove = false;
			} else {
				elf.tentative = tentative;
				const oldVal = tentativeMap.get(tentative.toString());
				const newVal = oldVal === undefined ? 1 : oldVal + 1;
				if (elf.willMove) { 
					tentativeMap.set(tentative.toString(), newVal);
				}
			}
		}
	});

	currentElves.forEach(elf =>{
		if(elf.willMove){
			if((tentativeMap.get(elf.tentative.toString()) as number) < 2){
				elf.pos = elf.tentative;
				moved = true;
			}
		}
	});

	return {
		elves: currentElves,
		moved: moved
	};
};

const input = fs.readFileSync('inputs/day23.txt', 'utf8')
	.split('\n')
	.filter(l => l.length !== 0)
	.map(l => l.split(''));

const elves: Elf[] = input.flatMap((m, i) => {
	return m.map((l, j) => {
		if(l === '#')
			return {
				pos: [i, j],
				tentative: [i, j],
				neighboursPos: [],
				neighbours: [],
				willMove: false
			} as Elf;
		return undefined;
	}).filter(l => l !== undefined) as Elf[];
});

const howManyRounds = 10;
const finalElves = Array.from({length: howManyRounds}, (_, i) => i).reduce((elves, round) => {
	return moveRound(elves, round).elves;
}, elves);
const minPos = finalElves.reduce((min, elf) => {
	return [Math.min(min[0], elf.pos[0]), Math.min(min[1], elf.pos[1])];
}, [Number.MAX_VALUE, Number.MAX_VALUE]);
const maxPos = finalElves.reduce((max, elf) => {
	return [Math.max(max[0], elf.pos[0]), Math.max(max[1], elf.pos[1])];
}, [Number.MIN_VALUE, Number.MIN_VALUE]);

const height = (maxPos[0] - minPos[0]) + 1;
const width = (maxPos[1] - minPos[1]) + 1;

const answer = height * width - finalElves.length;

console.log(answer);
