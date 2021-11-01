var fs = require('fs');
var input = fs.readFileSync('input.txt', 'utf8').split('');

var total = 0;
for (var i = 0; i < input.length; i++) {
    if (input[i] == '(') {
        total++;
    } else {
        total--;
    }
    if (total < 0) {
        console.log(i + 1);
        break;
    }
}