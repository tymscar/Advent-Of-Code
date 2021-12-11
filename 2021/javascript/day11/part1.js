const fs = require('fs');

const map = fs.readFileSync('input.txt', 'utf8').split('\n').map(a => a.split('').map(Number));

const w = map.length;
const h = map[0].length;

let totalFlashes = 0;

const getAdj = (loc) => {
    const x = loc[0];
    const y = loc[1]
    const adj = [
        [x + 1, y],
        [x + 1, y + 1],
        [x, y + 1],
        [x - 1, y + 1],
        [x - 1, y],
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1]
    ];

    return adj.filter(pos => {
        if (pos[0] < 0 || pos[0] >= w)
            return false;
        if (pos[1] < 0 || pos[1] >= h)
            return false;
        return true;
    });

};

for (let step = 0; step < 100; step++) {

    const flashed = [];
    const willFlash = [];
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            map[i][j]++;
            if (map[i][j] >= 10)
                willFlash.push([i, j]);
        }
    }


    while (willFlash.length > 0) {
        const curr = willFlash.pop(0);
        if (flashed.includes(curr.toString()))
            continue;
        getAdj(curr).forEach(adj => {
            map[adj[0]][adj[1]]++;
            if (map[adj[0]][adj[1]] >= 10)
                willFlash.push(adj);
        });
        flashed.push(curr.toString());
    }
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            if (map[i][j] >= 10) {
                map[i][j] = 0;
            }
        }
    }

    totalFlashes += flashed.length;

}

console.log(totalFlashes);