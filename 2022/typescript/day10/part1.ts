import * as fs from 'fs';

const input = fs.readFileSync('inputs/day10.txt', 'utf8').split('\n').filter(l => l.length > 0);

console.log(input);
