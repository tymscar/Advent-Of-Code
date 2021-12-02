const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split("\n").map(el => el.split(" "));

let aim = 0;
const pos = {
    x: 0,
    y: 0
};

input.forEach(command => {
    const distance = Number(command[1])
    switch (command[0]) {
        case "forward":
            pos.x += distance;
            pos.y += distance * aim;
            break;
        case "down":
            aim += distance;
            break;
        case "up":
            aim -= distance;
    }
})

console.log(pos.x * pos.y);