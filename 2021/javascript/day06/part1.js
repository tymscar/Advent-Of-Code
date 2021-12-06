const fs = require('fs');

const fishes = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);

for (let i = 0; i < 80; i++) {

    for (let j = 0; j < fishes.length; j++) {
        if (fishes[j] == 0) {
            fishes.push(9);
            fishes[j] = 7;
        }
        fishes[j]--;
    }
}

console.log(fishes.length)