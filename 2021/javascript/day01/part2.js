const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split("\n").map(depth => Number(depth));
let increases = 0;

const newDepthList = [];
for (let i = 2; i < input.length; i++) {
    newDepthList.push(input[i] + input[i - 1] + input[i - 2]);
}

for (let i = 1; i < newDepthList.length; i++) {
    if (newDepthList[i] > newDepthList[i - 1]) {
        increases++;
    }
}

console.log(increases);