import * as fs from 'fs';

const sum = (a: number, b: number): number => a + b;

const mapping = {
	"one": 1,
	"two": 2,
	"three": 3,
	"four": 4,
	"five": 5,
	"six": 6,
	"seven": 7,
	"eight": 8,
	"nine": 9
}

const replaceWordsWithNumbers = (string: string): [string] => {
	const numbers = []
	for(let i=0; i< string.length; i++){
		const curr = string[i];
		if(Number.isFinite(+curr))
			numbers.push(curr)
		for (let key in mapping) {
			if(string.substring(i).startsWith(key))
				numbers.push(`${mapping[key]}`)
		}
	}
	
	return numbers;
} 

const input = fs.readFileSync('inputs/day01.txt', 'utf8').split('\n');
const numbers = input.map(line => replaceWordsWithNumbers(line))
					 .map(digits => digits[0] + digits[digits.length-1])
const answer = numbers.map(number => +number).reduce(sum, 0)

console.log(answer);
