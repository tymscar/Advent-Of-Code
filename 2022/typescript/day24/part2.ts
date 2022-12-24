import * as fs from 'fs';

type Blizzard = {
	pos: number[],
	dir: number[]
}

const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

const input = fs.readFileSync('inputs/day24.txt', 'utf8')
	.split('\n')
	.filter(l => l.length !== 0)
	.map(l => l.split(''));

const startPos = [0, input[0].findIndex(l => l === '.')];
const endPos = [input.length - 1, input[input.length - 1].findIndex(l => l === '.')];

const walls = new Set(input.flatMap((l, i) => l.map((c, j) => c === '#' ? [i,j].toString() : '').filter(a => a !== '')));
walls.add([startPos[0] - 1, startPos[1]].toString());
walls.add([endPos[0] + 1, endPos[1]].toString());

const blizzards: Blizzard[] = input.flatMap((l, i) => l.map((c, j) => {
	switch(c){
	case '^':
		return {
			pos: [i,j],
			dir: directions[0]
		} as Blizzard;
	case '>':
		return {
			pos: [i,j],
			dir: directions[1]
		} as Blizzard;
	case 'v':
		return {
			pos: [i,j],
			dir: directions[2]
		} as Blizzard;
	case '<':
		return {
			pos: [i,j],
			dir: directions[3]
		} as Blizzard;
	}
	return '';
}).filter(a => a !== '')) as Blizzard[];

const updateBlizzards = (): void => {
	blizzards.forEach(blizzard => {
		blizzard.pos = [blizzard.pos[0] + blizzard.dir[0], blizzard.pos[1] + blizzard.dir[1]];
		if(blizzard.pos[0] >= input.length - 1)
			blizzard.pos = [1, blizzard.pos[1]];
		if(blizzard.pos[0] <= 0)
			blizzard.pos = [input.length - 2, blizzard.pos[1]];
		if(blizzard.pos[1] >= input[0].length - 1)
			blizzard.pos = [blizzard.pos[0], 1];
		if(blizzard.pos[1] <= 0)
			blizzard.pos = [blizzard.pos[0], input[0].length - 2];
	});
};


const howManyMinutesToFinish = (start: number[], finish: number[], time: number): number => {
	let toCheck = new Set<string>();
	toCheck.add(start.toString());
	while(toCheck.size > 0){
		const nextToCheck = new Set<string>();
		updateBlizzards();
		const nextOccupied = new Set<string>(blizzards.map(b => b.pos.toString()));
		for(const pos of toCheck) {
			if(pos === finish.toString())
				return time;
			
			if(!nextOccupied.has(pos))
				nextToCheck.add(pos);

			const currNumPos = pos.split(',').map(Number);
			directions.forEach(direction => {
				const nextPos = [currNumPos[0] + direction[0], currNumPos[1] + direction[1]].toString();
				if(!nextOccupied.has(nextPos) && !walls.has(nextPos))
					nextToCheck.add(nextPos);
			});
		}
		toCheck = nextToCheck;
		time++;
	}
	return time;
};

const firstTimeToCross = howManyMinutesToFinish(startPos, endPos, 0);
const timeBackToStart = howManyMinutesToFinish(endPos, startPos, firstTimeToCross + 1);
const timeBackToFinish = howManyMinutesToFinish(startPos, endPos, timeBackToStart + 1);

console.log(timeBackToFinish);
