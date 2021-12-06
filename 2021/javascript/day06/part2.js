const fs = require('fs');

let fishes = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);

const fishCount = Array(10).fill(0);

fishes.forEach(fish => {
    fishCount[fish]++;
});

for (let day = 0; day < 256; day++) {
    const fishesThatWereAt0 = fishCount[0];
    for (let i = 0; i <= 8; i++) {
        fishCount[i] = fishCount[i + 1];

    }
    fishCount[8] = fishesThatWereAt0;
    fishCount[6] += fishesThatWereAt0;
}

console.log(fishCount.reduce((tot, curr) => tot + curr));