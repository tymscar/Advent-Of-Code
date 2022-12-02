import * as fs from 'fs';

type Move = 'Rock' | 'Paper' | 'Scissors';
type Outcome = 'Win' | 'Loss' | 'Draw';

const moveTranslator: {[index in string]: Move} = {
	'A': 'Rock',
	'B': 'Paper',
	'C': 'Scissors',
	'X': 'Rock',
	'Y': 'Paper',
	'Z': 'Scissors'
};

const moveScoreTranslator: {[index in Move]: number} = {
	'Rock': 1,
	'Paper': 2,
	'Scissors': 3
};

const outcomeScoreTranslator: {[index in Outcome]: number} = {
	'Win': 6,
	'Draw': 3,
	'Loss': 0
};

const isWin = (player: Move, enemy: Move): Outcome => {
	switch(player) {
	case 'Rock':
		if(enemy === 'Paper')
			return 'Loss';
		else if(enemy === 'Scissors')
			return 'Win';
		break;
	case 'Paper':
		if(enemy === 'Scissors')
			return 'Loss';
		else if(enemy === 'Rock')
			return 'Win';
		break;
	case 'Scissors':
		if(enemy === 'Rock')
			return 'Loss';
		else if(enemy === 'Paper')
			return 'Win';
		break;
	}

	return 'Draw';
};

const scoreForHand = (hand: string): number => {
	const moves = hand.split(' ');
	const elfMove: Move = moveTranslator[moves[0]];
	const playerMove: Move = moveTranslator[moves[1]];

	const outcome: Outcome = isWin(playerMove, elfMove);

	return moveScoreTranslator[playerMove] + outcomeScoreTranslator[outcome];
};

const input = fs.readFileSync('inputs/day02.txt', 'utf8').split('\n').filter(line => line.length !== 0);
const totalScore = input.reduce((score: number, currHand) => score + scoreForHand(currHand), 0);

console.log(totalScore);
