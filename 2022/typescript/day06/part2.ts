import * as fs from 'fs';

const sameAsLastFourteen = (array: string[], index:number): boolean => {
	if(index < 14)
		return true;
	const lastFour = array.slice(index-14, index);
	const uniqueLetters = [...new Set(lastFour)];

	return uniqueLetters.length != lastFour.length;
};

const input = fs.readFileSync('inputs/day06.txt', 'utf8').split('');

const answer = input.findIndex((_, i, arr) => !sameAsLastFourteen(arr, i));

console.log(answer);
