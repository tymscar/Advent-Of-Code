const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(a => a.split('-'));

const connections = [];

const addConnection = (from, to) => {
    if (connections[from] == undefined)
        connections[from] = [to];
    else
        connections[from].push(to);
};

const isUpperCased = string => string.toUpperCase() == string;

input.forEach(line => {
    addConnection(line[0], line[1]);
    addConnection(line[1], line[0]);
});

const toExplore = [['start']];
const paths = [];


while (toExplore.length > 0) {
    const currPath = toExplore.pop();
    const currLastPlace = currPath.at(-1);

    if (currLastPlace == 'end') {
        paths.push(currPath);
        continue;
    }
    connections[currLastPlace].forEach(neighbour => {
        if (neighbour == 'start')
            return;
        if (!isUpperCased(neighbour) && currPath.includes(neighbour))
            return;
        toExplore.push([...currPath, neighbour]);
    });
}

console.log(paths.length);