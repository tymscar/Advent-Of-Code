const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const steps = [];

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

const notTouching = (a, b) => {
	return Math.max(a.x[0], b.x[0]) > Math.min(a.x[1], b.x[1])
	|| Math.max(a.y[0], b.y[0]) > Math.min(a.y[1], b.y[1])
	|| Math.max(a.z[0], b.z[0]) > Math.min(a.z[1], b.z[1]);
};

let cuboids = [];

steps.forEach(step => {
	let currCube = createCube(step.x, step.y, step.z);
	let newCuboids = [];

	if(step.action)
		newCuboids.push(currCube);

	cuboids.forEach(cube =>{
		if(notTouching(cube, currCube)){
			newCuboids.push(cube);
		} else {
			// Slice left
			if (cube.x[0] < currCube.x[0]) {
				newCuboids.push(createCube([cube.x[0], currCube.x[0] - 1], [cube.y[0], cube.y[1]], [cube.z[0], cube.z[1]]));
				cube.x[0] = currCube.x[0];
			}

			// Slice Right
			if (cube.x[1] > currCube.x[1]) {
				newCuboids.push(createCube([currCube.x[1] + 1, cube.x[1]], [cube.y[0], cube.y[1]], [cube.z[0], cube.z[1]]));
				cube.x[1] = currCube.x[1];
			}

			// Slice Top
			if (cube.y[0] < currCube.y[0]) {
				newCuboids.push(createCube([cube.x[0], cube.x[1]], [cube.y[0], currCube.y[0] - 1], [cube.z[0], cube.z[1]]));
				cube.y[0] = currCube.y[0];
			}

			// Slice Bottom
			if (cube.y[1] > currCube.y[1]) {
				newCuboids.push(createCube([cube.x[0], cube.x[1]], [currCube.y[1] + 1, cube.y[1]], [cube.z[0], cube.z[1]]));
				cube.y[1] = currCube.y[1];
			}

			// Slice Front
			if (cube.z[0] < currCube.z[0]) {
				newCuboids.push(createCube([cube.x[0], cube.x[1]], [cube.y[0], cube.y[1]], [cube.z[0], currCube.z[0] - 1]));
				cube.z[0] = currCube.z[0];
			}

			// Slice Back
			if (cube.z[1] > currCube.z[1]) {
				newCuboids.push(createCube([cube.x[0], cube.x[1]], [cube.y[0], cube.y[1]], [currCube.z[1] + 1, cube.z[1]]));
				cube.z[1] = currCube.z[1];
			}
		}
	});

	cuboids = [...newCuboids];
});

let totalOn = 0;
cuboids.forEach(cuboid => {
	const xlen = Math.abs(cuboid.x[0] - cuboid.x[1] - 1);
	const ylen = Math.abs(cuboid.y[0] - cuboid.y[1] - 1);
	const zlen = Math.abs(cuboid.z[0] - cuboid.z[1] - 1);
	totalOn += (xlen * ylen * zlen);
});

console.log(totalOn);
