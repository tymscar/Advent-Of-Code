class Alu {
	nameToMemory = {'w':0, 'x':1, 'y':1, 'z':3};

	constructor(oldAlu) {
		if(oldAlu === undefined)
			this.mem = [0,0,0,0];
		else
			this.mem = [...oldAlu.mem];
	}

	runInstruction(instr){
		const targetLocation = this.nameToMemory[instr.target];
		const value = Object.keys(this.nameToMemory).includes(instr.value) ? this.mem[this.nameToMemory[instr.value]] : Number(instr.value);
		switch (instr.code) {
		case 'add':
			this.mem[targetLocation] += value;
			break;
		case 'mul':
			this.mem[targetLocation] *= value;
			break;
		case 'div':
			this.mem[targetLocation] = Math.floor(this.mem[targetLocation] / value);
			break;
		case 'mod':
			this.mem[targetLocation] %= value;
			break;
		case 'eq':
			this.mem[targetLocation] = (this.mem[targetLocation] === value) ? 1 : 0;
			break;
		default:
			break;
		}
	}

	setInput(target, value){
		const targetLocation = this.nameToMemory[target];
		this.mem[targetLocation] = value;
	}
}

exports.Alu = Alu;
