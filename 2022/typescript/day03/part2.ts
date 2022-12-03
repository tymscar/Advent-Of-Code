import * as fs from 'fs';

type Group = string[]
const lowercase = 'abcdefghijklmnopqrstuvwxyz';

const commonLetter = (group: Group): string => {
	const alphabet = [... lowercase + lowercase.toUpperCase()];
	
	return alphabet.filter(letter => {
		if(group[0].includes(letter) &&
           group[1].includes(letter) &&
           group[2].includes(letter))
			return true;
		return false;
	})[0];
};

const letterValue = (letter: string): number => {
	if(lowercase.includes(letter))
		return letter.charCodeAt(0) - 96;
	else
		return letter.charCodeAt(0) - 38;
};

const input = fs.readFileSync('inputs/day03.txt', 'utf8').split('\n');
const groups: Group[] = Array.from(
	new Array(Math.ceil(input.length / 3)),
	(_, i) => input.slice(i * 3, i * 3 + 3)
).filter(group => group.length !== 1);


const answer = groups.map(commonLetter)
	.map(letterValue)
	.reduce((a,b) => a + b);

console.log(answer);
