import * as fs from 'fs';

const sameAsLastFour = (array: string[], index:number): boolean => {
	if(index < 4)
		return true;
	const lastFour = array.slice(index-4, index);
	const uniqueLetters = [...new Set(lastFour)];

	return uniqueLetters.length != lastFour.length;
};

const input = fs.readFileSync('inputs/day06.txt', 'utf8').split('');

const answer = input.findIndex((_, i, arr) => !sameAsLastFour(arr, i));

console.log(answer);
