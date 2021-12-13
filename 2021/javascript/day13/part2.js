const fs = require('fs');
const { totalmem } = require('os');

const inputData = fs.readFileSync('input.txt', 'utf8').split('\n\n').map(a => a.split('-'));

const initialPoints = inputData[0].map(a => a.split('\n').map(b => b.split(',').map(Number))).flat()
const folds = inputData[1].map(a => a.split('\n').map(a => {
    const splitLine = a.split('=');
    return [splitLine[0].at(-1), Number(splitLine[1])]
})).flat()

let width = Math.max(...initialPoints.map(a => a[0])) + 1;
let height = Math.max(...initialPoints.map(a => a[1])) + 1;

let map = Array(width).fill().map(() => Array(height).fill(false));

initialPoints.forEach(point => map[point[0]][point[1]] = true);

const printMap = () => {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            process.stdout.write(map[x][y] ? '⬛' : '⬜');
        }
        console.log();
    }
}

folds.forEach(fold => {
    if (fold[0] == 'y') {
        height = fold[1];
        const newMap = Array(width).fill().map(() => Array(height).fill(false));
        for (let x = 0; x < width; x++) {
            for (let diff = 1; diff <= height; diff++) {
                const oldTopVal = map[x][height - diff] || false;
                const oldBotVal = map[x][height + diff] || false;
                newMap[x][height - diff] = oldBotVal || oldTopVal;
            }
        }
        map = newMap;
    } else {
        width = fold[1];
        const newMap = Array(width).fill().map(() => Array(height).fill(false));
        for (let y = 0; y < height; y++) {
            for (let diff = 1; diff <= width; diff++) {
                const oldLeftVal = map[width - diff][y] || false;
                const oldRightVal = map[width + diff][y] || false;
                newMap[width - diff][y] = oldLeftVal || oldRightVal;
            }
        }
        map = newMap;
    }
})

printMap();
