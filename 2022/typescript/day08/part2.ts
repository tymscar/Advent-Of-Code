import * as fs from 'fs';

const emptyLine = (l: string) => l.length !== 0;
const multiply = (prod: number, curr:number) => prod * curr;

const countVisibleTrees = (line: number[], curr:number) => {
	if(Math.max(...line) < curr)
		return line.length; 
	return line.findIndex(t => t >= curr) + 1;
};

const scenicScore = (xPos: number, yPos: number, forest: number[][]):number => {
	const current = forest[yPos][xPos];
	const left = forest[yPos].slice(0, xPos).reverse();
	const right = forest[yPos].slice(xPos + 1);
	const up = forest.slice(0,yPos).map(l => l[xPos]).reverse();
	const down = forest.slice(yPos + 1).map(l => l[xPos]);

	const score = [left, up, right, down]
		.map(view => countVisibleTrees(view, current))
		.reduce(multiply, 1);

	return score;
};

const input = fs.readFileSync('inputs/day08.txt', 'utf8')
	.split('\n')
	.filter(emptyLine)
	.map(l=>l.split('').map(Number));

scenicScore(2, 1, input);

const scoreMap = input.map((line, i) => {
	return line.map((_, j) => scenicScore(j, i, input));
});

const answer = Math.max(...scoreMap.map(arr => Math.max(...arr)));

console.log(answer);
