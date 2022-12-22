import * as fs from 'fs';

type Player = {
	pos: number[],
	direction: number
}

type Instruction = string | number

const getNewDirection = (oldDir: number, instruction: string): number => {
	if(instruction === 'R'){
		if(oldDir === 3)
			return 0;
		return oldDir + 1;
	} else {
		if(oldDir === 0)
			return 3;
		return oldDir - 1;
	}
};

const getPosAfterSteps = (player: Player, steps: number, map: string[][]): number[] => {
	let currPos = player.pos;
	let stepsLeft = steps;
	while(stepsLeft > 0){
		if(player.direction === 0){ // Go right
			let nextPos = [currPos[0], currPos[1] + 1];
			if(nextPos[1] >= map[0].length || map[nextPos[0]][nextPos[1]] === ' ')
				nextPos = [nextPos[0], map[nextPos[0]].findIndex(l => l !== ' ')];
			if(map[nextPos[0]][nextPos[1]] === '#')
				return currPos;
			currPos = nextPos;
			stepsLeft--;
		} else if (player.direction === 2){ // Go left
			let nextPos = [currPos[0], currPos[1] - 1];
			if(nextPos[1] < 0 || map[nextPos[0]][nextPos[1]] === ' ')
				nextPos = [nextPos[0], map[nextPos[0]].reduce((prev, curr, idx) => curr != ' ' ? idx : prev, 0)];
			if(map[nextPos[0]][nextPos[1]] === '#')
				return currPos;
			currPos = nextPos;
			stepsLeft--;
		} else if (player.direction === 1){ // Go down
			let nextPos = [currPos[0] + 1, currPos[1]];
			if(nextPos[0] >= map.length || map[nextPos[0]][nextPos[1]] === ' ')
				nextPos = [map.findIndex(l => l[nextPos[1]] !== ' '), nextPos[1]];
			if(map[nextPos[0]][nextPos[1]] === '#')
				return currPos;
			currPos = nextPos;
			stepsLeft--;
		} else { // Go up
			let nextPos = [currPos[0] - 1, currPos[1]];
			if(nextPos[0] < 0 || map[nextPos[0]][nextPos[1]] === ' ')
				nextPos = [map.reduce((prev, curr, idx) => curr[nextPos[1]] != ' ' ? idx : prev, 0), nextPos[1]];
			if(map[nextPos[0]][nextPos[1]] === '#')
				return currPos;
			currPos = nextPos;
			stepsLeft--;
		}
	}
	return currPos;
};

const getNextPlayer = (player: Player, instruction: Instruction, map: string[][]): Player => {
	if(typeof instruction === 'string')
		return {
			...player,
			direction: getNewDirection(player.direction, instruction)
		};

	return {
		...player,
		pos: getPosAfterSteps(player, instruction, map)
	};
};

const input = fs.readFileSync('inputs/day22.txt', 'utf8')
	.split('\n')
	.filter(l => l.length !== 0);

const movement = input[input.length-1]
	.match(/\d+|[A-Z]/g)
	?.map(instr => {
		if (instr.match(/\d+/))
			return Number(instr);
		return instr;
	}) as Instruction[];

const height = input.length-1;
const width = Math.max(...input.slice(0, height).map(l => l.length));

const map = input
	.slice(0, height)
	.map(l => {
		return l.padEnd(width, ' ').split('');
	});

const startingPlayer: Player = {
	pos: [0, map[0].findIndex(l => l === '.')],
	direction: 0
};

const finalPlayer = movement.reduce((player: Player, instruction: Instruction) => getNextPlayer(player, instruction, map), startingPlayer);

const answer = 1000 * (finalPlayer.pos[0] + 1) + 4 * (finalPlayer.pos[1] + 1) + finalPlayer.direction;

console.log(answer);
