const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n\n');
const rulesTable = input[1].split('\n').map(a=>a.split(' -> '));
const initialPolymer = input[0].split('');

const rules = [];
const newElement = [];
rulesTable.forEach(rule => {
	const pair = rule[0];
	const addition = rule[1];
	newElement[pair] = addition;
	rules[pair] = [pair[0] + addition, addition + pair[1]];
});

let occurrence = [];
for(let i = 1; i < initialPolymer.length; i++){
	const curr = initialPolymer[i-1] + initialPolymer[i];
	occurrence[curr] === undefined ? occurrence[curr] = 1 : occurrence[curr]++;
}

const quantity = initialPolymer.reduce((final, curr) => {
	final[curr] === undefined ? final[curr] = 1 : final[curr]++;
	return final;
}, {});

for(let step = 0; step < 40; step++){
	const newOccurrence = [];
	Object.keys(occurrence).forEach(poly => {
		const newElementInPoly = newElement[poly];
		const [first, second] = rules[poly];
		quantity[newElementInPoly] === undefined ? quantity[newElementInPoly] = 1 : quantity[newElementInPoly] += occurrence[poly];
		newOccurrence[first] === undefined ? newOccurrence[first] =  occurrence[poly] : newOccurrence[first]+=occurrence[poly];
		newOccurrence[second] === undefined ? newOccurrence[second] =  occurrence[poly] : newOccurrence[second]+=occurrence[poly];
	});
	occurrence = newOccurrence;
}

const elementCounts = Object.keys(quantity).map(key => quantity[key]);

console.log(Math.max(...elementCounts) - Math.min(...elementCounts));