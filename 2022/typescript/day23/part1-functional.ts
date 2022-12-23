import * as fs from 'fs';

type Elf = {
	pos: number[],
	tentative: number[],
	neighbours: Neighbour[],
	willMove: boolean
}

type Nobody = undefined;

type Neighbour = Elf | Nobody

type ElfMap = {
	[pos: string]: Elf
}

type Proposal = {
	[pos: string]: number
}

const getNeighbours = (elf: Elf, map: ElfMap): Neighbour[] => {
	const curr = elf.pos;
	return [
		map[[curr[0] - 1, curr[1] - 1].toString()], // NW
		map[[curr[0] - 1, curr[1]    ].toString()], // N
		map[[curr[0] - 1, curr[1] + 1].toString()], // NE
		map[[curr[0],     curr[1] + 1].toString()], // E
		map[[curr[0] + 1, curr[1] + 1].toString()], // SE
		map[[curr[0] + 1, curr[1]    ].toString()], // S
		map[[curr[0] + 1, curr[1] - 1].toString()], // SW
		map[[curr[0],     curr[1] - 1].toString()], // W

	];
};

const northCheck = (elf: Elf): Elf | Nobody => {
	if(elf.neighbours[0] === undefined && elf.neighbours[1] === undefined && elf.neighbours[2] === undefined){ // North
		return {
			...elf,
			tentative: [elf.pos[0] - 1, elf.pos[1]]
		};
	}
	return undefined;
};

const southCheck = (elf: Elf): Elf | Nobody => {
	if(elf.neighbours[4] === undefined && elf.neighbours[5] === undefined && elf.neighbours[6] === undefined){ // South
		return {
			...elf,
			tentative: [elf.pos[0] + 1, elf.pos[1]]
		};
	}
	return undefined;
};

const westCheck = (elf: Elf): Elf | Nobody => {
	if(elf.neighbours[0] === undefined && elf.neighbours[6] === undefined && elf.neighbours[7] === undefined){ // West
		return {
			...elf,
			tentative: [elf.pos[0], elf.pos[1] - 1]
		};
	}
	return undefined;
};

const eastCheck = (elf: Elf): Elf | Nobody => {
	if(elf.neighbours[2] === undefined && elf.neighbours[3] === undefined && elf.neighbours[4] === undefined){ // East
		return {
			...elf,
			tentative: [elf.pos[0], elf.pos[1] + 1]
		};
	}
	return undefined;
};

const getNewElfBasedOnRound = (elf: Elf, round: number): Elf => {

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
	
	
	return {
		...elf,
		willMove: false
	};
};

const moveRound = (elves: Elf[], round: number): Elf[] => {

	const map: ElfMap = elves.reduce((map, elf) => {
		return {
			...map,
			[elf.pos.toString()]: elf
		};
	}, {});

	const ElvesWithNeighbours = elves.map(elf => ({
		...elf,
		neighbours: getNeighbours(elf, map)
	}));
	
	const elvesThatCanMove = ElvesWithNeighbours.map(elf => {
		return {
			...elf,
			willMove: elf.neighbours.filter(n => n != undefined).length > 0
		} as Elf;
	});

	const tentativeElves: Elf[] = elvesThatCanMove.map(elf => {
		if(!elf.willMove)
			return elf;
		return getNewElfBasedOnRound(elf, round);
	}) as Elf[];

	const proposals: Proposal = tentativeElves.reduce((prop, elf) => {
		const prev = prop[elf.tentative.toString()] === undefined ? 0 : prop[elf.tentative.toString()];
		return {
			...prop,
			[elf.tentative.toString()]: prev + 1
		};
	}, {} as Proposal);

	const decidedElves = tentativeElves.map(elf => {
		return {
			...elf,
			pos: proposals[elf.tentative.toString()] < 2 && elf.willMove ? elf.tentative : elf.pos
		};
	});

	return decidedElves;
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
				neighbours: [],
				willMove: false
			} as Elf;
		return undefined;
	}).filter(l => l !== undefined) as Elf[];
});

const howManyRounds = 10;
const finalElves = Array.from({length: howManyRounds}, (_, i) => i).reduce(moveRound, elves);
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
