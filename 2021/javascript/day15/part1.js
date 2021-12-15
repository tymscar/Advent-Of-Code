const fs = require('fs');

const map = fs.readFileSync('input.txt', 'utf8').split('\n').map(a=>a.split('').map(Number));

const height = map.length;
const width = map[0].length;

const getNeighbours = pos => {
	const neighbours = [];
	if(pos[0] > 0)
		neighbours.push([pos[0]-1, pos[1]]);
	if(pos[1] > 0)
		neighbours.push([pos[0], pos[1]-1]);
	if(pos[0] + 1 < height)
		neighbours.push([pos[0]+1, pos[1]]);
	if(pos[1] + 1 < width)
		neighbours.push([pos[0], pos[1]+1]);
	return neighbours;
};

const start = [0,0];
const end = [height - 1, width -1];

const total = [];
const parent = [];
const visited = [];
let queue = [start];
visited[start] = true;

for(let i= 0; i<height; i++){
	for(let j= 0; j<width; j++){
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