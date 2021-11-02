var fs = require('fs');

var input = fs.readFileSync('input.txt', 'utf8');

var lines = input.replace(/\r/g, '').split('\n');

var total = 0;

lines.forEach((line) => {
    const [l, w, h] = line.split('x').map(x => parseInt(x)).sort((a, b) => a - b);
    const area = 2 * l * w + 2 * w * h + 2 * h * l;
    const extra = l * w;
    total += area + extra;
});


console.log(total);