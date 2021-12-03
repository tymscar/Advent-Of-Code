const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const codeLenght = input[0].length;

const ones = new Array(codeLenght).fill(0);
const zeroes = new Array(codeLenght).fill(0);

input.forEach(code => {
    for (let i = 0; i < codeLenght; i++) {
        if (code[i] == '0') {
            zeroes[i]++;
        } else {
            ones[i]++;
        }
    }
});

const zeroIfValSmaller = (val, other) => {
    if (val < other) {
        return 0;
    }
    return 1;
}

const gamma = parseInt(ones.map((v, i) => zeroIfValSmaller(v, zeroes[i])).join(''), 2);
const epsilon = parseInt(ones.map((v, i) => zeroIfValSmaller(zeroes[i], v)).join(''), 2);

console.log(gamma * epsilon);