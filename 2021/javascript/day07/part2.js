const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);
const minPos = Math.min(...input);
const maxPos = Math.max(...input);

let bestCost = Number.MAX_SAFE_INTEGER;

const memoize = (functionToOptimise) => {
    const memo = {};
    return (...args) => {
        const aguments = JSON.stringify(args);
        if (!memo[aguments]) {
            memo[aguments] = functionToOptimise(...args);
        }
        return memo[aguments];
    };
};

const calculateCost = memoize((start, end) => {
    const actualStart = Math.min(start, end);
    const actualEnd = Math.max(start, end);
    let cost = 0;
    let step = 0;
    for (let i = actualStart; i < actualEnd; i++) {
        step++;
        cost += step;
    }
    return cost;
});


for (let i = minPos; i < maxPos; i++) {
    let cost = 0;
    for (let j = 0; j < input.length; j++) {
        cost += calculateCost(input[j], i);
    }
    bestCost = cost < bestCost ? cost : bestCost;
}

console.log(bestCost);