import * as fs from 'fs';

const sum = (a: number, b: number): number => a + b;

const input = fs.readFileSync('inputs/day01.txt', 'utf8').split('\n');
const numbers = input.map(line => line.split("").filter(char =>  Number.isFinite(+char))).map(digits => digits[0] + digits[digits.length-1])
const answer = numbers.map(number => +number).reduce(sum, 0)

console.log(answer);
