const fs = require('fs');

const yRange = fs.readFileSync('input.txt', 'utf8').split(': ')[1].split(', ').map(a=>a.split('=')[1].split('..').map(Number))[1];

const maxyAbs = Math.max(...yRange.map(Math.abs)) + 1;

const hitTarget = yvel => {
	let pos = 0;
	let maxPos = -99999;

	let yOvershoot = false;

	while (!yOvershoot){
		pos += yvel;
		maxPos = Math.max(maxPos, pos);

		yvel--;
		if(pos < yRange[0])
			yOvershoot = true;
		if(pos >= yRange[0] && pos <= yRange[1]){
			return [true, maxPos];
		}
	}
	return [false, maxPos];
};

let maxHeight = 0;

for(let i = 0; i< maxyAbs; i++){
	const [hit, height]  = hitTarget(i);
	if(hit)
		maxHeight = Math.max(maxHeight, height);
}

console.log(maxHeight);
