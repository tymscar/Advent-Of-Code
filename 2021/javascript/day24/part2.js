const fs = require('fs');
const {Operation} = require('./Operation');

const steps = [];
const instructions = fs.readFileSync('input.txt', 'utf8').split('\n');
instructions.forEach(instruction => {
	steps.push(new Operation(instruction));
});

const parameters = [];
for(let index=0; index < 18*14; index+=18){
	const p1 = Number(steps[index + 4].value);
	const p2 = Number(steps[index + 5].value);
	const p3 = Number(steps[index + 15].value);
	parameters.push([p1, p2, p3]);
}

// Thanks /u/i_have_no_biscuits on Reddit for figuring this out!
const theFunctionThatRepeats = (params, z, w) => {
	if ((z%26 + params[1]) !== w)
		return  Math.floor(z / params[0]) * 26 + w + params[2];
	return Math.floor(z / params[0]);
};

let minForZ = {0: 0};

parameters.forEach(param => {
	const newMinForZ = {};
	for (let z in minForZ) {
		for (let inputDigit = 1; inputDigit <= 9; inputDigit++) {
			const newZ = theFunctionThatRepeats(param, z, inputDigit);
			if (param[0] === 1 || (param[0] === 26 && newZ < z)) {
				if (newMinForZ[newZ] === undefined) {
					newMinForZ[newZ] = minForZ[z] * 10 + inputDigit;
				} else {
					newMinForZ[newZ] = Math.min(newMinForZ[newZ], minForZ[z] * 10 + inputDigit);
				}
			}
		}
	}
	minForZ = structuredClone(newMinForZ);
});

console.log(minForZ['0']);
