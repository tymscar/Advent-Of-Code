const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const steps = [];
let cuboids = [];

input.forEach(line => {
	const step = {};
	const command = line.split(' ');
	step.action = command[0] === 'on';
	const coords = command[1].split(',').map(a=>a.split('=')[1]).map(a=>a.split('..').map(Number));
	step.x = coords[0];
	step.y = coords[1];
	step.z = coords[2];
	steps.push(step);
});

const createCube = (x, y, z) =>{
	const cube = {};
	cube.x = x;
	cube.y = y;
	cube.z = z;
	return cube;
};

const inside = (thatCube, thisCube) => {
	if((thisCube.x[0] >= thatCube.x[0] && thisCube.x[0] <= thatCube.x[1] &&
			thisCube.y[0] >= thatCube.y[0] && thisCube.y[0] <= thatCube.y[1] &&
			thisCube.z[0] >= thatCube.z[0] && thisCube.z[0] <= thatCube.z[1]) ||
		(thatCube.x[0] >= thisCube.x[0] && thatCube.x[0] <= thisCube.x[1] &&
			thatCube.y[0] >= thisCube.y[0] && thatCube.y[0] <= thisCube.y[1] &&
			thatCube.z[0] >= thisCube.z[0] && thatCube.z[0] <= thisCube.z[1])){
		return true;
	} else {
		return false;
	}
};

const intersect = (a, b) => {
	const sizeA = [Math.abs(a.x[1] - a.x[0]), Math.abs(a.y[1] - a.y[0]), Math.abs(a.z[1] - a.z[0])];
	const sizeB = [Math.abs(b.x[1] - b.x[0]), Math.abs(b.y[1] - b.y[0]), Math.abs(b.z[1] - b.z[0])];
	//check the X axis
	if(Math.abs(a.x[0] - b.x[0]) < sizeA[0] + sizeB[0])
	{
		//check the Y axis
		if(Math.abs(a.y[0] - b.y[0]) < sizeA[1] + sizeB[1])
		{
			//check the Z axis
			if(Math.abs(a.z[0]  - b.z[0]) < sizeA[2] + sizeB[2])
			{
				return true;
			}
		}
	}

	return false;
};



const differenceBetween = (thatCube, thisCube) => {
	if(intersect(thatCube, thisCube)){ //partially at least inside
		const newCubes = [];
		let top = false;
		let bot = false;
		let right = false;
		let left = false;
		let front = false;
		let back = false;

		if(thisCube.z[1] > thatCube.z[1]){ //new cuboid above thatCube
			top = true;
			const cube = {};
			cube.x = [Math.max(thatCube.x[0], thisCube.x[0]), Math.min(thatCube.x[1], thisCube.x[1])];
			cube.y = [Math.max(thatCube.y[0], thisCube.y[0]), Math.min(thatCube.y[1], thisCube.y[1])];
			cube.z = [thatCube.z[1], thisCube.z[1]];
			newCubes.push(cube);
		}
		if(thisCube.z[0] < thatCube.z[0]){ //new cuboid under thatCube
			bot = true;
			const cube = {};
			cube.x = [Math.max(thatCube.x[0], thisCube.x[0]), Math.min(thatCube.x[1], thisCube.x[1])];
			cube.y = [Math.max(thatCube.y[0], thisCube.y[0]), Math.min(thatCube.y[1], thisCube.y[1])];
			cube.z = [thisCube.z[0], thatCube.z[0]];
			newCubes.push(cube);
		}
		if(thisCube.y[1] > thatCube.y[1]){ //new cuboid in front of thatCube
			front = true;
			const cube = {};
			cube.x = [Math.max(thatCube.x[0], thisCube.x[0]), Math.min(thatCube.x[1], thisCube.x[1])];
			cube.y = [thatCube.y[1], thisCube.y[1]];
			cube.z = [Math.max(thatCube.z[0], thisCube.z[0]), Math.min(thatCube.z[1], thisCube.z[1])];
			newCubes.push(cube);
		}
		if(thisCube.y[0] < thatCube.y[0]){ //new cuboid behind thatCube
			back = true;
			const cube = {};
			cube.x = [Math.max(thatCube.x[0], thisCube.x[0]), Math.min(thatCube.x[1], thisCube.x[1])];
			cube.y = [thisCube.y[0], thatCube.y[0]];
			cube.z = [Math.max(thatCube.z[0], thisCube.z[0]), Math.min(thatCube.z[1], thisCube.z[1])];
			newCubes.push(cube);
		}
		if(thisCube.x[1] > thatCube.x[1]){ //new cuboid right of thatCube
			right = true;
			const cube = {};
			cube.x = [thatCube.x[1], thisCube.x[1]];
			cube.y = [Math.max(thatCube.y[0], thisCube.y[0]), Math.min(thatCube.y[1], thisCube.y[1])];
			cube.z = [Math.max(thatCube.z[0], thisCube.z[0]), Math.min(thatCube.z[1], thisCube.z[1])];
			newCubes.push(cube);
		}
		if(thisCube.x[0] < thatCube.x[0]){ //new cuboid left thatCube
			left = true;
			const cube = {};
			cube.x = [thisCube.x[0], thatCube.x[0]];
			cube.y = [Math.max(thatCube.y[0], thisCube.y[0]), Math.min(thatCube.y[1], thisCube.y[1])];
			cube.z = [Math.max(thatCube.z[0], thisCube.z[0]), Math.min(thatCube.z[1], thisCube.z[1])];
			newCubes.push(cube);
		}

		if(top && front){
			const cube = {};
			cube.x = [Math.max(thatCube.x[0], thisCube.x[0]), Math.min(thatCube.x[1], thisCube.x[1])];
			cube.y = [thatCube.y[1], thisCube.y[1]];
			cube.z = [thatCube.z[1], thisCube.z[1]];
			newCubes.push(cube);
		}
		if(bot && front){
			const cube = {};
			cube.x = [Math.max(thatCube.x[0], thisCube.x[0]), Math.min(thatCube.x[1], thisCube.x[1])];
			cube.y = [thatCube.y[1], thisCube.y[1]];
			cube.z = [thisCube.z[0], thatCube.z[0]];
			newCubes.push(cube);
		}
		if(top && back){
			const cube = {};
			cube.x = [Math.max(thatCube.x[0], thisCube.x[0]), Math.min(thatCube.x[1], thisCube.x[1])];
			cube.y = [thisCube.y[0], thatCube.y[0]];
			cube.z = [thatCube.z[1], thisCube.z[1]];
			newCubes.push(cube);
		}
		if(bot && back){
			const cube = {};
			cube.x = [Math.max(thatCube.x[0], thisCube.x[0]), Math.min(thatCube.x[1], thisCube.x[1])];
			cube.y = [thisCube.y[0], thatCube.y[0]];
			cube.z = [thisCube.z[0], thatCube.z[0]];
			newCubes.push(cube);
		}
		if(top && right){
			const cube = {};
			cube.x = [thatCube.x[1], thisCube.x[1]];
			cube.y = [Math.max(thatCube.y[0], thisCube.y[0]), Math.min(thatCube.y[1], thisCube.y[1])];
			cube.z = [thatCube.z[1], thisCube.z[1]];
			newCubes.push(cube);
		}
		if(bot && right){
			const cube = {};
			cube.x = [thatCube.x[1], thisCube.x[1]];
			cube.y = [Math.max(thatCube.y[0], thisCube.y[0]), Math.min(thatCube.y[1], thisCube.y[1])];
			cube.z = [thisCube.z[0], thatCube.z[0]];
			newCubes.push(cube);
		}
		if(top && left){
			const cube = {};
			cube.x = [thisCube.x[0], thatCube.x[0]];
			cube.y = [Math.max(thatCube.y[0], thisCube.y[0]), Math.min(thatCube.y[1], thisCube.y[1])];
			cube.z = [thatCube.z[1], thisCube.z[1]];
			newCubes.push(cube);
		}
		if(bot && left){
			const cube = {};
			cube.x = [thisCube.x[0], thatCube.x[0]];
			cube.y = [Math.max(thatCube.y[0], thisCube.y[0]), Math.min(thatCube.y[1], thisCube.y[1])];
			cube.z = [thisCube.z[0], thatCube.z[0]];
			newCubes.push(cube);
		}
		if(front && right){
			const cube = {};
			cube.x = [thatCube.x[1], thisCube.x[1]];
			cube.y = [thatCube.y[1], thisCube.y[1]];
			cube.z = [Math.max(thatCube.z[0], thisCube.z[0]), Math.min(thatCube.z[1], thisCube.z[1])];
			newCubes.push(cube);
		}
		if(front && left){
			const cube = {};
			cube.x = [thisCube.x[0], thatCube.x[0]];
			cube.y = [thatCube.y[1], thisCube.y[1]];
			cube.z = [Math.max(thatCube.z[0], thisCube.z[0]), Math.min(thatCube.z[1], thisCube.z[1])];
			newCubes.push(cube);
		}
		if(back && right){
			const cube = {};
			cube.x = [thatCube.x[1], thisCube.x[1]];
			cube.y = [thisCube.y[0], thatCube.y[0]];
			cube.z = [Math.max(thatCube.z[0], thisCube.z[0]), Math.min(thatCube.z[1], thisCube.z[1])];
			newCubes.push(cube);
		}
		if(back && left){
			const cube = {};
			cube.x = [thisCube.x[0], thatCube.x[0]];
			cube.y = [thisCube.y[0], thatCube.y[0]];
			cube.z = [Math.max(thatCube.z[0], thisCube.z[0]), Math.min(thatCube.z[1], thisCube.z[1])];
			newCubes.push(cube);
		}
		if(front && top && right){
			const cube = {};
			cube.x = [thatCube.x[1], thisCube.x[1]];
			cube.y = [thatCube.y[1], thisCube.y[1]];
			cube.z = [thatCube.z[1], thisCube.z[1]];
			newCubes.push(cube);
		}
		if(front && bot && right){
			const cube = {};
			cube.x = [thatCube.x[1], thisCube.x[1]];
			cube.y = [thatCube.y[1], thisCube.y[1]];
			cube.z = [thisCube.z[0], thatCube.z[0]];
			newCubes.push(cube);
		}
		if(front && top && left){
			const cube = {};
			cube.x = [thisCube.x[0], thatCube.x[0]];
			cube.y = [thatCube.y[1], thisCube.y[1]];
			cube.z = [thatCube.z[1], thisCube.z[1]];
			newCubes.push(cube);
		}
		if(front && bot && left){
			const cube = {};
			cube.x = [thisCube.x[0], thatCube.x[0]];
			cube.y = [thatCube.y[1], thisCube.y[1]];
			cube.z = [thisCube.z[0], thatCube.z[0]];
			newCubes.push(cube);
		}
		if(back && top && left){
			const cube = {};
			cube.x = [thisCube.x[0], thatCube.x[0]];
			cube.y = [thisCube.y[0], thatCube.y[0]];
			cube.z = [thatCube.z[1], thisCube.z[1]];
			newCubes.push(cube);
		}
		if(back && bot && left){
			const cube = {};
			cube.x = [thisCube.x[0], thatCube.x[0]];
			cube.y = [thisCube.y[0], thatCube.y[0]];
			cube.z = [thisCube.z[0], thatCube.z[0]];
			newCubes.push(cube);
		}
		if(back && top && right){
			const cube = {};
			cube.x = [thatCube.x[1], thisCube.x[1]];
			cube.y = [thisCube.y[0], thatCube.y[0]];
			cube.z = [thatCube.z[1], thisCube.z[1]];
			newCubes.push(cube);
		}
		if(back && bot && right){
			const cube = {};
			cube.x = [thatCube.x[1], thisCube.x[1]];
			cube.y = [thisCube.y[0], thatCube.y[0]];
			cube.z = [thisCube.z[0], thatCube.z[0]];
			newCubes.push(cube);
		}
		return newCubes;
	} else {
		return [];
	}
};

let osc = 1;
steps.forEach(step => {
	console.log(osc);
	osc++;
	let currCube = createCube(step.x, step.y, step.z);
	let newCuboids = [];

	cuboids.forEach(oldCube => {
		const diff = differenceBetween(currCube, oldCube);
		if(diff.length === 0 && !inside(oldCube, currCube))
			newCuboids.push( oldCube);
		newCuboids = [...newCuboids, ...diff];
	});
	if(step.action)
		cuboids = [ ...newCuboids, currCube];
	else
		cuboids = [...newCuboids];
});

let totalOn = 0;
cuboids.forEach(cuboid => {
	const xlen = cuboid.x[1] - cuboid.x[0];
	const ylen = cuboid.y[1] - cuboid.y[0];
	const zlen = cuboid.z[1] - cuboid.z[0];
	totalOn += (xlen * ylen * zlen);
});


console.log(totalOn);