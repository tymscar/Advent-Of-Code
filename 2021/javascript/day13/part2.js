const fs = require('fs');

const letterLookup = {
    '011001001010010111101001010010': 'A',
    '111001001011100100101001011100': 'B',
    '011001001010000100001001001100': 'C',
    '111101000011100100001000011110': 'E',
    '111101000011100100001000010000': 'F',
    '011001001010000101101001001110': 'G',
    '100101001011110100101001010010': 'H',
    '001100001000010000101001001100': 'J',
    '100101010011000101001010010010': 'K',
    '100001000010000100001000011110': 'L',
    '111001001010010111001000010000': 'P',
    '111001001010010111001010010010': 'R',
    '100101001010010100101001001100': 'U',
    '100011000101010001000010000100': 'Y',
    '111100001000100010001000011110': 'Z',
    '000000000000000000000000000000': ' ',
};

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

// use this to have a visual representation
//printMap();

const letters = Array(8).fill().map(() => [])
for (let y = 0; y < height; y++) {
    let currLetter = 0;
    for (let x = 0; x < width; x++) {
        letters[Math.floor(currLetter / 5)].push(map[x][y] ? 1 : 0);
        currLetter++;
    }
}

const answer = letters.map(letterArray => letterArray.join('')).map(letterCode => letterLookup[letterCode]).join('');

console.log(answer)