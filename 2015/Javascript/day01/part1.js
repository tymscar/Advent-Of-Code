var fs = require('fs');
var file = fs.readFileSync('input.txt', 'utf8');

var total = file.split('').reduce((total, current) => {
    return total + (current === ')' ? -1 : 1);
}, 0);

console.log(total);