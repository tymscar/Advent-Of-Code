const fs = require('fs');
const {Player} = require('./Player');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const players = [{}];

let die = 1;
const nextThreeRolls = () => {
	const ans = die * 3 + 3;
	die += 3;
	return ans;
};

input.forEach(userInfo => {
	const startingPos = Number(userInfo.split('position: ')[1]);
	const currPlayer = new Player(startingPos);
	players.push(currPlayer);
});

while (true){
	players[1].move(nextThreeRolls());
	if(players[1].won)
		break;
	players[2].move(nextThreeRolls());
	if(players[2].won)
		break;
}

const lowestScore = Math.min(players[1].score, players[2].score);

const answer = lowestScore * (die-1);

console.log(answer);
