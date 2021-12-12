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

const isValidPath = path => {
    let howMantDuplicates = 0;
    const sortedPath = path.filter(a => !isUpperCased(a) && a != 'start' && a != 'end').sort();
    if (sortedPath.length <= 2)
        return true;
    for (let i = 1; i < sortedPath.length; i++) {
        if (sortedPath[i - 1] == sortedPath[i])
            howMantDuplicates++;
    }
    return howMantDuplicates <= 1
};

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
        const possiblePath = [...currPath, neighbour]
        if (isValidPath(possiblePath))
            toExplore.push(possiblePath);
    });
}

console.log(paths.length);