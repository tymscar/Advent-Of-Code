const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(a => a.split(''));

const opposite = { '(': ')', '[': ']', '{': '}', '<': '>' };
const opening = ['(', '[', '{', '<'];
const value = { ')': 3, ']': 57, '}': 1197, '>': 25137 };

const foundErrors = [];

input.forEach(line => {
    const stack = [];
    for (let i = 0; i < line.length; i++) {
        const curr = line[i];
        if (opening.includes(curr)) {
            stack.push(curr);
        } else {
            const lastInStack = stack.pop();
            if (opposite[lastInStack] != curr) {
                foundErrors.push(curr);
                break;
            }
        }
    }
})

let totalScore = foundErrors.reduce((total, curr) => total + value[curr], 0);

console.log(totalScore);