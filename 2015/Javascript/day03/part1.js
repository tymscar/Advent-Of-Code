let fs = require('fs');

let input = fs.readFileSync('input.txt', 'utf8');

const santa = {
    x: 0,
    y: 0
};

const visited = [];

input.split('').forEach(function (direction) {
    if (direction === '^') {
        santa.y++;
    } else if (direction === 'v') {
        santa.y--;
    } else if (direction === '>') {
        santa.x++;
    } else if (direction === '<') {
        santa.x--;
    }
    visited[santa.x + ',' + santa.y] = true;
});


console.log(Object.keys(visited).length);