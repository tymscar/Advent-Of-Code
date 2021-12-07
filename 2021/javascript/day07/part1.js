const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);

let bestCost = Number.MAX_SAFE_INTEGER;

for (let i = 0; i < input.length; i++) {
    let cost = 0;
    for (let j = 0; j < input.length; j++) {
        cost += Math.abs(input[j] - input[i]);
    }
    bestCost = cost < bestCost ? cost : bestCost;
}

console.log(bestCost);