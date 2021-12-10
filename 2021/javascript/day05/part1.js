const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(a => a.split(" -> ").map(a => a.split(",").map(Number)));

const part1Input = input.filter(line => line[0][0] == line[1][0] || line[0][1] == line[1][1]);

const maxVal = part1Input.reduce((final, curr) => Math.max(final, Math.max(Math.max(...curr[0]), Math.max(...curr[1]))), 0);

const map = Array(maxVal + 1).fill().map(() => Array(maxVal + 1).fill(0));

part1Input.forEach(line => {
    let start, end;
    if (line[0][1] < line[1][1] || line[0][0] < line[1][0]) {
        start = line[0];
        end = line[1];
    } else {
        start = line[1];
        end = line[0];
    }
    for (let i = start[0]; i <= end[0]; i++) {
        for (let j = start[1]; j <= end[1]; j++) {
            map[i][j]++;
        }
    }
});

const atLeastTwo = map.reduce((total, curr) => total += curr.filter(a => a >= 2).length, 0);

console.log(atLeastTwo);