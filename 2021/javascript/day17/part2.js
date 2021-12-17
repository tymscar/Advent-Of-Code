const fs = require('fs');

const [xRange, yRange] = fs.readFileSync('input.txt', 'utf8').split(': ')[1].split(', ').map(a=>a.split('=')[1].split('..').map(Number));

const maxXAbs = Math.max(...xRange.map(Math.abs)) + 1;
const maxyAbs = Math.max(...yRange.map(Math.abs)) + 1;

const canThisYHitTheTarget = (yvel) => {
	let pos = 0;
	while (true){
		pos += yvel;
		yvel--;

		if(pos < yRange[0])
			return false;
		if(pos >= yRange[0] && pos <= yRange[1]){
			return true;
		}
	}
};

const hitTarget = (xvel, yvel) => {
	const pos = [0, 0];
	while (true){
		pos[0] += xvel;
		pos[1] += yvel;

		if(xvel > 0)
			xvel--;
		else if(xvel < 0)
			xvel++;
		yvel--;

		if(pos[1] < yRange[0] || pos[0] > xvel[1])
			return false;
		if(pos[1] >= yRange[0] && pos[1] <= yRange[1] && pos[0] >= xRange[0] && pos[0] <= xRange[1]){
			return true;
		}
	}
};

const validYvelocities = [];
for(let i = -maxyAbs; i< maxyAbs; i++){
	if(canThisYHitTheTarget(i))
		validYvelocities.push(i);
}

const validVelocities = [];
for(let i = -maxXAbs; i< maxXAbs; i++){
	validYvelocities.forEach(yvel => {
		if(hitTarget(i,yvel))
			validVelocities.push([i,yvel]);
	});
}

console.log(validVelocities.length);
