const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(l => l.split(' | '));

const screenOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

const translate = (dictionary, what) => {
    const answer = [];
    what.forEach(led => {
        answer.push(dictionary[led])
    });
    return answer;
}

const whatDigit = segments => {
    switch (segments.join('')) {
        case 'abcefg':
            return 0;
        case 'cf':
            return 1;
        case 'acdeg':
            return 2;
        case 'acdfg':
            return 3;
        case 'bcdf':
            return 4;
        case 'abdfg':
            return 5;
        case 'abdefg':
            return 6;
        case 'acf':
            return 7;
        case 'abcdefg':
            return 8;
        case 'abcdfg':
            return 9;
    }
}

let totalAnswer = 0;

input.forEach(line => {
    const [signals, outputs] = line.map(a => a.split(' '));
    const allUnknowns = signals.map(a => a.split('')).map(a => a.sort());

    const digit = Array(7).fill([...screenOrder]);

    const unknownsThatFormOne = allUnknowns.filter(a => a.length == 2).flat();
    const unknownsThatFormSeven = allUnknowns.filter(a => a.length == 3).flat();
    const unknownsThatFormFour = allUnknowns.filter(a => a.length == 4).flat();
    digit[2] = unknownsThatFormOne;
    digit[5] = unknownsThatFormOne;
    digit[0] = unknownsThatFormSeven.filter(x => !unknownsThatFormOne.includes(x));
    digit[1] = unknownsThatFormFour.filter(x => !digit[2].includes(x)).filter(x => !digit[0].includes(x));
    digit[3] = digit[1];
    digit[4] = digit[4].filter(x => !digit[0].includes(x)).filter(x => !digit[1].includes(x)).filter(x => !digit[2].includes(x));
    digit[6] = digit[6].filter(x => !digit[0].includes(x)).filter(x => !digit[1].includes(x)).filter(x => !digit[2].includes(x));

    const nrNine = allUnknowns.filter(a => {
        if (digit[2].filter(x => !a.includes(x)).length == 0 &&
            digit[3].filter(x => !a.includes(x)).length == 0 &&
            a.length == 6
        ) return true;
        return false;
    }).flat()
    digit[4] = digit[4].filter(x => !nrNine.includes(x))
    digit[6] = digit[6].filter(x => !digit[4].includes(x))


    const nrZero = allUnknowns.filter(a => {
        if (digit[2].filter(x => !a.includes(x)).length == 0 &&
            digit[4].filter(x => !a.includes(x)).length == 0 &&
            a.length == 6
        ) return true;
        return false;
    }).flat()
    digit[3] = digit[3].filter(x => !nrZero.includes(x))
    digit[1] = digit[1].filter(x => !digit[3].includes(x))

    const nrSix = allUnknowns.filter(a => {
        if (digit[3].filter(x => !a.includes(x)).length == 0 &&
            digit[4].filter(x => !a.includes(x)).length == 0 &&
            a.length == 6
        ) return true;
        return false;
    }).flat()
    digit[2] = digit[2].filter(x => !nrSix.includes(x))
    digit[5] = digit[5].filter(x => !digit[2].includes(x))

    const translationFile = [];

    for (let i = 0; i < 7; i++) {
        translationFile[digit[i]] = screenOrder[i];
    }

    const answerForLine = []
    outputs.forEach(output => {

        const actualLeds = translate(translationFile, output.split(''));
        answerForLine.push(whatDigit(actualLeds.sort()))
    });
    totalAnswer += Number(answerForLine.join(''));

});

console.log(totalAnswer)