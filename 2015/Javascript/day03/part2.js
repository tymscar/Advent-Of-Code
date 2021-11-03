let fs = require('fs');

let input = fs.readFileSync('input.txt', 'utf8');

const santa = {
    x: 0,
    y: 0
};
const roboSanta = {
    x: 0,
    y: 0
};

const visited = [];
let santaMoves = true;

input.split('').forEach(function (direction) {
    let x = 0;
    let y = 0;
    if (direction === '^') {
        y = 1;
    } else if (direction === 'v') {
        y = -1;
    } else if (direction === '>') {
        x = 1;
    } else if (direction === '<') {
        x = -1;
    }
    if (santaMoves) {
        santa.x += x;
        santa.y += y;
        visited[santa.x + ',' + santa.y] = true;
    } else {
        roboSanta.x += x;
        roboSanta.y += y;
        visited[roboSanta.x + ',' + roboSanta.y] = true;
    }
    santaMoves = !santaMoves;
});


console.log(Object.keys(visited).length);