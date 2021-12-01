const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split("\n").map(depth => Number(depth));
let increases = 0;

for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i - 1]) {
        increases++;
    }
}

console.log(increases);