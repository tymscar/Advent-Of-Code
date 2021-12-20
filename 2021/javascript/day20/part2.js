const fs = require('fs');
const {defaultDict} = require('./defaultDict');

const input = fs.readFileSync('input.txt', 'utf8').split('\n\n');
const initialImage = input[1].split('\n').map(a=>a.split('').map(a=> a === '#' ? 1 : 0));
let min = [0,0];
let max = [initialImage.length, initialImage[0].length];

const enhAlgo = input[0].split('').map(a=> a === '#' ? 1 : 0);


let map = new defaultDict(0);

for(let i=0; i<initialImage.length; i++){
	for(let j=0; j<initialImage[0].length; j++){
		map[[i,j]] = initialImage[i][j];
	}
}

const getNewOutputForPoint = pos => {
	const arr = [
		map[[pos[0] - 1,pos[1] - 1]],
		map[[pos[0] - 1,pos[1]]],
		map[[pos[0] - 1,pos[1] + 1]],
		map[[pos[0],pos[1] - 1]],
		map[[pos[0],pos[1]]],
		map[[pos[0],pos[1] + 1]],
		map[[pos[0] + 1,pos[1] - 1]],
		map[[pos[0] + 1,pos[1]]],
		map[[pos[0] + 1,pos[1] + 1]]
	];
	const indexInAlgo = parseInt(arr.join(''), 2);
	return enhAlgo[indexInAlgo];
};


let totalLightUp = 0;
for(let times=0; times < 50; times++) {
	let borderValue = enhAlgo[511];
	if(times%2 === 0)
		borderValue = enhAlgo[0];

	const newMap = new defaultDict(borderValue);
	for (let i = min[0] - 1; i < max[0] + 1; i++) {
		for (let j = min[1] - 1; j < max[1] + 1; j++) {
			newMap[[i, j]] = getNewOutputForPoint([i, j]);
		}
	}

	totalLightUp = 0;
	for (let i = min[0] - 1; i < max[0] + 1; i++) {
		for (let j = min[1] - 1; j < max[1] + 1; j++) {
			if (newMap[[i, j]] === 1)
				totalLightUp++;
		}
	}

	min[0]-= 1;
	min[1]-= 1;
	max[0]+= 1;
	max[1]+= 1;
	map = newMap;
}

console.log(totalLightUp);