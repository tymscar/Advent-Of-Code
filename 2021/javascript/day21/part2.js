const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const playerInitialPos = [];
const finalScore = 21;
const board = [1,2,3,4,5,6,7,8,9,10];

input.forEach(userInfo => {
	const startingPos = Number(userInfo.split('position: ')[1]);
	playerInitialPos.push(startingPos);
});

const memo = [];

const wins = (player1Score, player1Pos, player2Score, player2Pos, playerOneGoes) => {
	if(memo[[player1Score, player1Pos, player2Score, player2Pos, playerOneGoes]] !== undefined)
		return memo[[player1Score, player1Pos, player2Score, player2Pos, playerOneGoes]];
	if(player1Score >= finalScore){
		memo[[player1Score, player1Pos, player2Score, player2Pos, playerOneGoes]] = [1,0];
		return [1,0];
	}
	if(player2Score >= finalScore){
		memo[[player1Score, player1Pos, player2Score, player2Pos, playerOneGoes]] = [0,1];
		return [0,1];
	}
	let totalWins = [0,0];

	for(let i=1; i<=3; i++){
		for(let j=1; j<=3; j++){
			for(let k=1; k<=3; k++){
				if(!playerOneGoes) {
					const newPos = board[(player2Pos + i + j + k - 1) % 10];
					const currWin = wins(player1Score, player1Pos, player2Score + newPos, newPos, !playerOneGoes);
					totalWins = [totalWins[0] + currWin[0], totalWins[1] + currWin[1]];
				} else {
					const newPos = board[(player1Pos + i + j + k - 1) % 10];
					const currWin = wins(player1Score + newPos, newPos, player2Score, player2Pos, !playerOneGoes);
					totalWins = [totalWins[0] + currWin[0], totalWins[1] + currWin[1]];
				}
			}
		}
	}

	memo[[player1Score, player1Pos, player2Score, player2Pos, playerOneGoes]] = totalWins;
	return totalWins;
};

const winnings = wins(0,playerInitialPos[0],0,playerInitialPos[1],true);

console.log(Math.max(...winnings));
