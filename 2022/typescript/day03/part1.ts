import * as fs from 'fs';

const commonLetter = (rucksack: string): string => {
	const compA = [...rucksack.slice(0, rucksack.length/2)];
	const compB = rucksack.slice(rucksack.length/2, rucksack.length);

	return compA.reduce((def, curr) => {
		if(compB.includes(curr))
			return curr;
		return def;
	}, 'none');
};

const letterValue = (letter: string): number => {
	const lowercase = 'abcdefghijklmnopqrstuvwxyz';

	if(lowercase.includes(letter))
		return letter.charCodeAt(0) - 96;
	else
		return letter.charCodeAt(0) - 38;
};

const input = fs.readFileSync('inputs/day03.txt', 'utf8').split('\n').filter(line => line.length !== 0);

const answer = input.map(commonLetter)
	.filter(l => l !== 'none')
	.map(letterValue)
	.reduce((a,b) => a + b);

console.log(answer);
