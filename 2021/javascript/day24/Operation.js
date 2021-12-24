class Operation {
	constructor(instructionText) {
		const instr = instructionText.split(' ');
		this.code = instr[0];
		this.target = instr[1];
		this.value = instr[2] || '0';
	}
}

exports.Operation = Operation;
