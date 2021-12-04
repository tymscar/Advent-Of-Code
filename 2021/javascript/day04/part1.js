const fs = require('fs');
const { consumers } = require('stream');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const numbers = input[0].split(',').map(Number);
const cards = [];
let foundWinner = false;

for (let i = 2; i < input.length - 4; i += 6) {
    const card = {
        values: [],
        checked: Array(5).fill().map(() => Array(5).fill(0))
    };
    for (let j = 0; j < 5; j++) {
        card.values.push(input[i + j].split(' ').filter(num => num != '').map(Number));
    }
    cards.push(card);
}

const hasBingo = card => {
    let bingo = false;
    // check if rows have bingo
    card.checked.forEach(row => {
        if (row.reduce((old, curr) => old + curr, 0) == 5) {
            bingo = true;
        }
    })
    // check if columns have bingo
    for (let i = 0; i < 5; i++) {
        let sumOnColumn = 0;
        for (let j = 0; j < 5; j++) {
            sumOnColumn += card.checked[j][i];
        }
        if (sumOnColumn >= 5) {
            bingo = true;
        }
    }
    return bingo;
};

const tickNumOnCard = (card, num) => {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (card.values[i][j] == num) {
                card.checked[i][j] = 1;
            }
        }
    }
};

const getScore = (card, lastCalledNumber) => {
    let sumValuesOnCard = 0;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (card.checked[i][j] == 0) {
                sumValuesOnCard += card.values[i][j];
            }
        }
    }
    return sumValuesOnCard * lastCalledNumber;
};

numbers.some(num => {
    cards.some(card => {
        tickNumOnCard(card, num);

        if (hasBingo(card)) {
            const answer = getScore(card, num);
            console.log(answer);
            foundWinner = true;
        }
        return foundWinner;
    })
    return foundWinner;
});
