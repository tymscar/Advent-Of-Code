const fs = require('fs');

const map = fs.readFileSync('input.txt', 'utf8').split('\n').map(a => a.split('').map(Number));

let totalRiskLevel = 0;

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        const neighbours = [];
        if (i >= 1)
            neighbours.push(map[i - 1][j]);
        if (j >= 1)
            neighbours.push(map[i][j - 1]);
        if (i < map.length - 1)
            neighbours.push(map[i + 1][j]);
        if (j < map[0].length - 1)
            neighbours.push(map[i][j + 1]);
        if (Math.min(...neighbours) > map[i][j])
            totalRiskLevel += map[i][j] + 1;
    }
}

console.log(totalRiskLevel);