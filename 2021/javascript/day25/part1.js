const fs = require('fs');

let map = fs.readFileSync('input.txt', 'utf8').split('\n').map(a=>a.split(''));
const height = map.length;
const width = map[0].length;


const printMap = () => {
	for(let i=0; i<height; i++){
		for(let j=0; j<width; j++){
			process.stdout.write(map[i][j]);
		}
		console.log();
	}
};

let moved = true;
let steps = 0;

while (moved){
	steps++;
	moved = false;

	// Handle right facing cucumbers
	let newMap = structuredClone(map);
	for(let i=0; i<height; i++){
		for(let j=0; j<width; j++){
			if(map[i][j] === '>' && map[i][(j+1)%width] === '.'){
				newMap[i][j] = '.';
				newMap[i][(j+1)%width] = '>';
				moved = true;
			}
		}
	}

	// Handle down facing cucumbers
	map = structuredClone(newMap);
	for(let i=0; i<height; i++){
		for(let j=0; j<width; j++){
			if(newMap[i][j] === 'v' && newMap[(i + 1) % height][j] === '.'){
				map[i][j] = '.';
				map[(i + 1) % height][j] = 'v';
				moved = true;
			}
		}
	}

}

printMap();
console.log(steps);