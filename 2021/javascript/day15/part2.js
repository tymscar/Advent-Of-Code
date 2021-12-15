const fs = require('fs');

const inputMap = fs.readFileSync('input.txt', 'utf8').split('\n').map(a=>a.split('').map(Number));

const height = inputMap.length;
const width = inputMap[0].length;
const expansion = 5;

const getNeighbours = pos => {
	const neighbours = [];
	if(pos[0] > 0)
		neighbours.push([pos[0]-1, pos[1]]);
	if(pos[1] > 0)
		neighbours.push([pos[0], pos[1]-1]);
	if(pos[0] + 1 < (height * expansion))
		neighbours.push([pos[0]+1, pos[1]]);
	if(pos[1] + 1 < (width * expansion))
		neighbours.push([pos[0], pos[1]+1]);
	return neighbours;
};

const getCostAt = pos => {
	const possibleValues = [1,2,3,4,5,6,7,8,9];

	const addY = Math.floor(pos[0] / height);
	const addX = Math.floor(pos[1] / width);
	const offset = addX + addY;

	const initialValueIndex = possibleValues.findIndex(el => el === inputMap[pos[0] % height][pos[1] %width]);
	const newValueIndex = (initialValueIndex + offset) % possibleValues.length;

	return possibleValues[newValueIndex];
};

const map = Array(width*expansion).fill().map(() => Array(height * expansion).fill(0));
for(let i=0; i<map.length; i++){
	for(let j=0; j<map[0].length; j++){
		map[i][j] = getCostAt([i,j]);
	}
}

const start = [0,0];
const end = [(height * expansion) - 1, (width * expansion) -1];

const total = [];
const parent = [];
const visited = [];
let queue = [start];
visited[start] = true;

for(let i= 0; i<height*expansion; i++){
	for(let j= 0; j<width*expansion; j++){
		total[[i,j]]= Number.MAX_VALUE;
		visited[[i,j]] = false;
	}
}
total[start] = 0;

while (queue.length > 0){
	let curr = queue[0];
	for(let i=0; i<queue.length; i++)
		if(total[queue[i]] < total[curr])
			curr = queue[i];

	queue = queue.filter(el => el[0] !== curr[0] || el[1] !== curr[1]);

	if(curr[0] === end[0] && curr[1] === end[1]){
		let risk = 0;
		let loc = curr;
		while (parent[loc]){
			risk += map[loc[0]][loc[1]];
			loc = parent[loc];
		}
		console.log(risk);
		break;
	}

	getNeighbours(curr).forEach(pos => {
		if(visited[pos] === false) {
			const possibleCost = map[pos[0]][pos[1]] + total[curr];
			if (possibleCost < total[pos]) {
				total[pos] = possibleCost;
				parent[pos] = curr;
			}
			visited[pos] = true;
			queue.push(pos);
		}
	});
}
