var fs = require('fs');

var input = fs.readFileSync('input.txt', 'utf8');

var lines = input.replace(/\r/g, '').split('\n');

var total = 0;

lines.forEach((line) => {
    const [l, w, h] = line.split('x').map(x => parseInt(x)).sort((a, b) => a - b);
    const wrap = 2 * l + 2 * w;
    const bow = l * w * h;
    total += wrap + bow;
});


console.log(total);