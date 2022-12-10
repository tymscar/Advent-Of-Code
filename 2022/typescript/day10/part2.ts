import * as fs from 'fs';

const WIDHT = 40;
const HEIGHT = 6;

const renderCRT = (frameBuffer: boolean[]): void => {
	frameBuffer.forEach((pixelOn, index) => {
		const sprite = pixelOn ? '█' : ' ';

		process.stdout.write(sprite);

		if((index + 1) % 40 === 0)
			process.stdout.write('\n');
	});
	
};

const calculatePixelsOn = (register: number, position: number): boolean => {
	const currPos = position % 40;
	const lit = [register - 1, register, register + 1];

	return lit.includes(currPos) ? true : false;
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
const litPixels = regValues.map(calculatePixelsOn);

renderCRT(litPixels);
