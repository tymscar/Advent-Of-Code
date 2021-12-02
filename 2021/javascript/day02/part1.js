const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split("\n").map(el => el.split(" "));

const pos = {
    x: 0,
    y: 0
};

input.forEach(command => {
    const distance = Number(command[1])
    switch (command[0]) {
        case "forward":
            pos.x += distance;
            break;
        case "down":
            pos.y += distance;
            break;
        case "up":
            pos.y -= distance;
    }
})

console.log(pos.x * pos.y);