const fs = require('fs');

const map = fs.readFileSync('input.txt', 'utf8').split('\n').map(a => a.split('').map(Number));

const lowPoints = [];
const basinSizes = []

const getNeighbours = (point) => {
    const neighbours = [];
    const i = point[0];
    const j = point[1];
    if (i >= 1)
        neighbours.push([i - 1, j]);
    if (j >= 1)
        neighbours.push([i, j - 1]);
    if (i < map.length - 1)
        neighbours.push([i + 1, j]);
    if (j < map[0].length - 1)
        neighbours.push([i, j + 1]);
    return neighbours;
}

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        const neighbourValues = getNeighbours([i, j]).map(nv => map[nv[0]][nv[1]]);
        if (Math.min(...neighbourValues) > map[i][j])
            lowPoints.push([i, j]);
    }
}

lowPoints.forEach(point => {
    let basinSize = 0;
    const visited = [];
    const toVisit = [point];
    while (toVisit.length > 0) {
        const curr = toVisit.pop();
        if (visited[curr] == true)
            continue;
        visited[curr] = true;
        basinSize++;
        getNeighbours(curr).forEach(adj => {

            if (map[adj[0]][adj[1]] < 9 && visited[adj] == undefined)
                toVisit.push(adj);

        });
    }
    basinSizes.push(basinSize);
})

const topThreeBasinSizes = basinSizes.sort((a, b) => b - a).slice(0, 3);

console.log(topThreeBasinSizes.reduce((total, curr) => total * curr));