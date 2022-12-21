import * as fs from 'fs';

type Monkey = {
	name: string,
	value: number,
	left: string,
	right: string,
	operation: '+' | '-' | '*' | '/'
}

type MonkeyMap = {
	[name: string]: Monkey
}

const getValue = (of: Monkey, monkeys: MonkeyMap): number => {
	if(of.operation === undefined)
		return of.value;
	const left = getValue(monkeys[of.left], monkeys);
	const right = getValue(monkeys[of.right], monkeys);
	switch(of.operation){
	case '+':
		return left + right;
	case '-':
		return left - right;
	case '*':
		return left * right;
	case '/':
		return left / right;
	}
};

const input = fs.readFileSync('inputs/day21.txt', 'utf8')
	.split('\n')
	.filter(l => l.length > 0);

const monkeys = input.map(line => {
	const [name, maths] = line.split(':').map(a => a.trim());
	const [left, operator, right] = maths.split(' ');

	return {
		name: name,
		value: Number(left),
		left: left,
		right: right,
		operation: operator
	} as Monkey;
}).reduce((monkeyMap: MonkeyMap, currMonkey: Monkey) => {
	return {
		...monkeyMap,
		[currMonkey.name]: currMonkey
	};
}, {} as MonkeyMap);

const rootMonkey = monkeys['root'];
const answer = getValue(rootMonkey, monkeys);

console.log(answer);
