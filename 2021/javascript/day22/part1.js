const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const steps = [];
const map = [];

input.forEach(line => {
	const step = {};
	const command = line.split(' ');
	step.action = command[0] === 'on';
	const coords = command[1].split(',').map(a=>a.split('=')[1]).map(a=>a.split('..').map(Number));
	step.x = coords[0];
	if(step.x[1] < - 50 || step.x[0] > 50)
		return;
	step.y = coords[1];
	if(step.y[1] < - 50 || step.y[0] > 50)
		return;
	step.z = coords[2];
	if(step.z[1] < - 50 || step.z[0] > 50)
		return;
	steps.push(step);
});

steps.forEach(step => {
	for(let i = step.x[0]; i<= step.x[1]; i++){
		for(let j = step.y[0]; j<= step.y[1]; j++){
			for(let k = step.z[0]; k<= step.z[1]; k++){
				map[[i,j,k]] = step.action;
			}
		}
	}
});


let totalOn = 0;
for(let val in map){
	if(map[val])
		totalOn++;
}

console.log(totalOn);