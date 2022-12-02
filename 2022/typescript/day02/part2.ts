import * as fs from 'fs';

type Move = 'Rock' | 'Paper' | 'Scissors';
type Outcome = 'Win' | 'Loss' | 'Draw';

const moveTranslator: {[index in string]: Move} = {
	'A': 'Rock',
	'B': 'Paper',
	'C': 'Scissors'
};

const messageTranslator: {[index in string]: Outcome} = {
	'X': 'Loss',
	'Y': 'Draw',
	'Z': 'Win'
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

const whatMove = (outcome: Outcome, enemy: Move): Move => {
	switch(outcome) {
	case 'Win':
		if(enemy === 'Rock')
			return 'Paper';
		else if(enemy === 'Paper')
			return 'Scissors';
		return 'Rock';
	case 'Draw':
		if(enemy === 'Rock')
			return 'Rock';
		else if(enemy === 'Paper')
			return 'Paper';
		return 'Scissors';
	case 'Loss':
		if(enemy === 'Rock')
			return 'Scissors';
		else if(enemy === 'Paper')
			return 'Rock';
		return 'Paper';
	}
};

const scoreForHand = (hand: string): number => {
	const letters = hand.split(' ');
	const elfMove: Move = moveTranslator[letters[0]];
	const playerInstruction: Outcome = messageTranslator[letters[1]];

	const playerMove: Move = whatMove(playerInstruction, elfMove);

	return moveScoreTranslator[playerMove] + outcomeScoreTranslator[playerInstruction];
};

const input = fs.readFileSync('inputs/day02.txt', 'utf8').split('\n').filter(line => line.length !== 0);
const totalScore = input.reduce((score: number, currHand) => score + scoreForHand(currHand), 0);

console.log(totalScore);
