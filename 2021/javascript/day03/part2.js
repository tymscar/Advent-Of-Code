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

const getOnesAndZeroesForPos = (pos, numbers) => {
    let zero = 0;
    let one = 0;

    numbers.forEach(num => {
        if (num[pos] == '0') {
            zero++;
        } else {
            one++;
        }
    })

    return [zero, one];
};


let oxygen = [...input];

for (let i = 0; i < codeLenght; i++) {
    const [zero, one] = getOnesAndZeroesForPos(i, oxygen);
    const whatToKeep = one >= zero ? '1' : '0';
    oxygen = oxygen.filter(value => {
        return value[i] == whatToKeep;
    });
    if (oxygen.length == 1) {
        break;
    }
}

let co2 = [...input];

for (let i = 0; i < codeLenght; i++) {
    const [zero, one] = getOnesAndZeroesForPos(i, co2);
    const whatToKeep = zero <= one ? '0' : '1';
    co2 = co2.filter(value => {
        return value[i] == whatToKeep;
    });
    if (co2.length == 1) {
        break;
    }
}

const oxygenValue = parseInt(oxygen[0], 2);
const co2Value = parseInt(co2[0], 2);

console.log(oxygenValue * co2Value);
