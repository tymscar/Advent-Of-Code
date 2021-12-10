const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(a => a.split(''));

const opposite = { '(': ')', '[': ']', '{': '}', '<': '>', ')': '(', ']': '[', '}': '{', '>': '<' };
const opening = ['(', '[', '{', '<'];
const value = { ')': 1, ']': 2, '}': 3, '>': 4 };

const isLineIncomplete = line => {
    const stack = [];
    for (let i = 0; i < line.length; i++) {
        const curr = line[i];
        if (opening.includes(curr)) {
            stack.push(curr);
        } else {
            const lastInStack = stack.pop();
            if (opposite[lastInStack] != curr)
                return false;
        }
    }
    return stack.length == 0 ? false : true;
}

const incompleteLines = input.filter(isLineIncomplete);

const allScores = [];

incompleteLines.forEach(line => {
    const stack = [];
    for (let i = 0; i < line.length; i++) {
        const curr = line[i];
        if (opening.includes(curr)) {
            stack.push(curr);
        } else {
            stack.pop();
        }
    }

    const needToAdd = [];
    while (stack.length > 0) {
        needToAdd.push(opposite[stack.pop()]);
    }

    const totalValueOnLine = needToAdd.reduce((total, curr) => (total * 5) + value[curr], 0);
    allScores.push(totalValueOnLine);
})

const allScoresOrdered = allScores.sort((a, b) => a - b);

console.log(allScoresOrdered[Math.floor(allScoresOrdered.length / 2)])