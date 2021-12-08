const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(l => l.split(' | ')[1]).flatMap(l => l.split(" "));

const answer = input.reduce((total, curr) => total + ([2, 3, 4, 7].includes(curr.length) ? 1 : 0), 0)

console.log(answer)
