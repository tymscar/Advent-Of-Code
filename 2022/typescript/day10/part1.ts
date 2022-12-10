import * as fs from 'fs';

const sum = (total: number, curr: number): number => total + curr;

const applyInstruction = (history: number[], command: string): number[] => {
	const [instruction, V] = command.split(' ');
	const lastValue = history[history.length - 1];
	const newValue = Number(V) + lastValue;

	if(instruction === 'noop')
		return [...history, lastValue];
	
	return [...history, lastValue, newValue];
};

const input = fs.readFileSync('inputs/day10.txt', 'utf8').split('\n').filter(l => l.length > 0);

const regValues = input.reduce(applyInstruction, [1]);
const impCycles = Array(6).fill(0).map((_, i) => i * 40 + 20);
const answer = impCycles.map(cycle => cycle * regValues[cycle-1]).reduce(sum);

console.log(answer);
