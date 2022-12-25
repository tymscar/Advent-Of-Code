import * as fs from 'fs';

const sum = (a: number, b: number): number => a + b;

const toHumanNumber = (snafuNumber: string): number => {
	return snafuNumber.split('').map((digit: string, index: number) => {
		const offset = 5 ** (snafuNumber.length - index - 1);
		switch(digit){
		case '-':
			return offset * -1;
		case '=':
			return offset * -2;
		default:
			return offset * Number(digit);
		}
	}).reduce(sum);
};

function toSnafuNumber( humanNumber: number ): string {
	const digits: number[] = [];

	while ( humanNumber > 0 ) {
		digits.push(( (humanNumber + 2) % 5 ));
		humanNumber = Math.floor( (humanNumber + 2)/ 5 );
	}

	return digits.reverse().map(digit =>{
		switch(digit){
		case 0:
			return '=';
		case 1: 
			return '-';
		case 2:
			return '0';
		case 3: 
			return '1';
		case 4:
			return '2';
		}
	}).join('');
}

const totalSum = fs.readFileSync('inputs/day25.txt', 'utf8')
	.split('\n')
	.filter(l => l.length !== 0)
	.map(l => toHumanNumber(l))
	.reduce(sum);

const answer = toSnafuNumber(totalSum);

console.log(answer);
