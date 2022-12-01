import * as fs from 'fs';

const sum = (a: number, b: number): number => a + b;

const input = fs.readFileSync('inputs/day01.txt', 'utf8').split('\n\n');
const elfBags = input.map(bag => bag.split('\n').map(Number));
const caloriesPerElf = elfBags.map(bag => bag.reduce(sum, 0));

console.log(Math.max(...caloriesPerElf));
