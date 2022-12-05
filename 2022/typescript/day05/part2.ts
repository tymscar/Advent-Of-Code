import * as fs from 'fs';

interface IInstruction{
	count: number,
	from: number,
	to: number
}

const parseInstruction = (instruction: string): IInstruction => {
	const match = instruction.match(/move (\d+) from (\d+) to (\d+)/) || ['','','',''];
	return {
		count: Number(match[1]),
		from: Number(match[2]) - 1,
		to: Number(match[3]) - 1
	};
};

const applyInstruction = (stacks: string[][], instruction: IInstruction): string[][] => {
	const newStack = stacks.map((stack, idx) => {
		if(idx === instruction.from)
			return stack.slice(0, stack.length - instruction.count);
		if(idx === instruction.to)
			return stack.concat(stacks[instruction.from].slice(stacks[instruction.from].length - instruction.count));
		return stack;
	});
	
	return newStack;
};

const input = fs.readFileSync('inputs/day05.txt', 'utf8').split('\n').filter(line => line.length !== 0);

const legendIdx = input.findIndex(line => line.includes(' 1 '));

const crates = input.slice(0, legendIdx).map(crate => Array.from(
	new Array(Math.ceil(crate.length / 4)),
	(_, i) => crate.slice(i * 4 + 1, i * 4 + 2)
)).reverse();
const stacks = crates[0].map((_, i) => crates.map(crate => crate[i]).filter(crate => crate !== ' '));

const instructions: IInstruction[] = input.slice(legendIdx + 1).map(parseInstruction);

const afterInstructions = instructions.reduce((crateStacks, instruction: IInstruction) => applyInstruction(crateStacks, instruction), stacks);
const answer = afterInstructions.map(crates => crates[crates.length - 1]).join('');

console.log(answer);
