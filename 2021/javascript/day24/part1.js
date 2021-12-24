const fs = require('fs');
const {Operation} = require('./Operation');
const {Alu} = require('./Alu');

const instructions = fs.readFileSync('input.txt', 'utf8').split('\n');

let aluMaxes = [[new Alu(), 0]];

instructions.forEach(instruction => {
	const currOperation = new Operation(instruction);
	if(currOperation.code === 'inp'){
		let newAluMaxes = [];
		const newAluMaxesIndex = new Map();
		aluMaxes.forEach(oldAluMax => {
			for(let value=1; value <= 9; value++){
				let newAluMax = [new Alu(oldAluMax[0]), oldAluMax[1]];
				// console.log(newAluMax);
				newAluMax[0].setInput(currOperation.target, value);
				newAluMax[1] = newAluMax[1] * 10 + value;
				const indexLocation = newAluMaxesIndex.get(JSON.stringify(newAluMax[0])) || -1;
				if(indexLocation >= 0){
					newAluMaxes[indexLocation][1] = Math.max(newAluMaxes[indexLocation][1], newAluMax[1]);
				} else {
					newAluMaxesIndex.set(JSON.stringify(newAluMax[0]), newAluMaxes.length);
					newAluMaxes.push(newAluMax);
				}
			}
		});
		aluMaxes = [...newAluMaxes];
		console.log(`Processing ${aluMaxes.length} alu states.`);

	} else {
		aluMaxes.forEach(aluMax => {
			aluMax[0].runInstruction(currOperation);
		});
	}
});