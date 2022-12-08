import * as fs from 'fs';

const emptyLine = (l: string) => l.length !== 0;
const sumElements = (sum: number, curr:number) => sum + curr;

const isVisible = (xPos: number, yPos: number, forest: number[][]):number => {
	const current = forest[yPos][xPos];

	const left = forest[yPos].slice(0, xPos);
	const right = forest[yPos].slice(xPos + 1);
	const up = forest.slice(0, yPos).map(l => l[xPos]);
	const down = forest.slice(yPos + 1).map(l => l[xPos]);
	
	const biggestTrees = [left, up, right, down].map(t=>Math.max(...t));
	const smallestBigTree = Math.min(...biggestTrees);

	return current > smallestBigTree ? 1 : 0;
};

const input = fs.readFileSync('inputs/day08.txt', 'utf8')
	.split('\n')
	.filter(emptyLine)
	.map(l=>l.split('').map(Number));

const visibilityMap = input.map((line, i) => {
	return line.map((_, j) => isVisible(j, i, input));
});

const answer = visibilityMap.map(arr => arr.reduce(sumElements)).reduce(sumElements);

console.log(answer);
