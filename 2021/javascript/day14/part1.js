const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n\n');
const rulesTable = input[1].split('\n').map(a=>a.split(' -> '));
let polymer = input[0].split('');

const rules = [];
rulesTable.forEach(rule => rules[rule[0]] = rule[1]);

for (let step = 0; step < 10; step++){
	const newPolymer = [polymer[0]];
	for(let i=1; i<polymer.length; i++){
		const currCombo = polymer[i-1] + polymer[i];
		newPolymer.push(rules[currCombo]);
		newPolymer.push(polymer[i]);
	}
	polymer = newPolymer;
}

const elements = Array.from(new Set(polymer));
const count = [];
elements.forEach(element => count[element] = polymer.filter(a => element === a).length);
const occurrences = Object.keys(count).map(key => count[key]);

console.log(Math.max(...occurrences) - Math.min(...occurrences));