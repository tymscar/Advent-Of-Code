class Player {
	board = [1,2,3,4,5,6,7,8,9,10];

	constructor(startingPos) {
		this.pos = startingPos;
		this.score = 0;
		this.won = false;
	}

	move(howMuch) {
		this.pos = this.board[(this.pos + howMuch - 1) % 10];
		this.score += this.pos;
		this.won = this.score >= 1000;
	}
}

exports.Player = Player;
