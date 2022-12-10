import * as fs from 'fs';
import decode from './ocr';

const WIDHT = 40;
const HEIGHT = 6;
const CHARACTERS = 8;

const calculatePixels = (register: number, position: number): string => {
	const currPos = position % 40;
	const lit = [register - 1, register, register + 1];

	return lit.includes(currPos) ? '#' : '.';
};

const applyInstruction = (history: number[], command: string): number[] => {
	const [instruction, V] = command.split(' ');
	const lastValue = history[history.length - 1];
	const newValue = Number(V) + lastValue;

	if(instruction === 'noop')
		return [...history, lastValue];
	
	return [...history, lastValue, newValue];
};

const input = fs.readFileSync('inputs/day10.txt', 'utf8').split('\n').filter(l => l.length > 0);
const regValues = input.reduce(applyInstruction, [1]).slice(0, WIDHT * HEIGHT);
const litPixels = regValues.map(calculatePixels);
const chars = Array(CHARACTERS).fill(0).map((_, i) => 
	Array(HEIGHT).fill(0).map((_, j) =>
		litPixels.slice(i * (HEIGHT - 1) + j * WIDHT, (i + 1) * (HEIGHT - 1)  + j * WIDHT)
	).map(a=>a.join(''))
);

const answer = chars.map(decode).map(c => c.toUpperCase()).join('');

console.log(answer);
