import * as fs from 'fs';

const sum = (a: number, b: number): number => a + b;

const input: string[] = fs.readFileSync('inputs/day01.txt', 'utf8').split('\n\n');
const elfBags: number[][] = input.map(bag => bag.split('\n').map(Number));
const caloriesPerElf: number[] = elfBags.map(bag => bag.reduce(sum, 0));
const sortedBags: number[] = caloriesPerElf.sort((a,b) => b-a);

console.log(sortedBags.slice(0, 3).reduce(sum, 0));
