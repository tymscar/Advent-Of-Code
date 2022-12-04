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

const elfsIngroup = 3;

const groups: Group[] = Array.from(
	new Array(Math.ceil(input.length / elfsIngroup)),
	(_, i) => input.slice(i * elfsIngroup, i * elfsIngroup + elfsIngroup)
).filter(group => group.length === elfsIngroup);


const answer = groups.map(commonLetter)
	.map(letterValue)
	.reduce((a,b) => a + b);

console.log(answer);
