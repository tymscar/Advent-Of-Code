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

const getSideWithHuman = (monkey: Monkey, monkeys: MonkeyMap): 'left' | 'right' | 'nowhere' => {
	if(monkey.left === 'humn')
		return 'left';
	if(monkey.right === 'humn')
		return 'right';
	if(monkey.operation === undefined)
		return 'nowhere';
	const leftAnswer = getSideWithHuman(monkeys[monkey.left], monkeys);
	const rightAnswer = getSideWithHuman(monkeys[monkey.right], monkeys);
	if(leftAnswer === 'nowhere' && rightAnswer !== 'nowhere')
		return 'right';
	if(rightAnswer === 'nowhere' && leftAnswer !== 'nowhere')
		return 'left';
	return 'nowhere';
};

const getHumanValue = (target: number, monkey: Monkey, monkeys: MonkeyMap): number => {
	switch(monkey.operation){
	case '+':
		if(monkey.left === 'humn')
			return target - getValue(monkeys[monkey.right], monkeys);
		if(monkey.right === 'humn')
			return target - getValue(monkeys[monkey.left], monkeys);
		if(getSideWithHuman(monkey, monkeys) === 'left'){
			const newTarget = target - getValue(monkeys[monkey.right], monkeys);
			return getHumanValue(newTarget, monkeys[monkey.left], monkeys);
		} else {
			const newTarget = target - getValue(monkeys[monkey.left], monkeys);
			return getHumanValue(newTarget, monkeys[monkey.right], monkeys);  
		}
	case '-':
		if(monkey.left === 'humn')
			return target + getValue(monkeys[monkey.right], monkeys);
		if(monkey.right === 'humn')
			return getValue(monkeys[monkey.left], monkeys) - target;
		if(getSideWithHuman(monkey, monkeys) === 'left'){
			const newTarget = target + getValue(monkeys[monkey.right], monkeys);
			return getHumanValue(newTarget, monkeys[monkey.left], monkeys);
		} else {
			const newTarget = getValue(monkeys[monkey.left], monkeys) - target;
			return getHumanValue(newTarget, monkeys[monkey.right], monkeys);  
		}
	case '*':
		if(monkey.left === 'humn')
			return target / getValue(monkeys[monkey.right], monkeys);
		if(monkey.right === 'humn')
			return target / getValue(monkeys[monkey.left], monkeys);
		if(getSideWithHuman(monkey, monkeys) === 'left'){
			const newTarget = target / getValue(monkeys[monkey.right], monkeys);
			return getHumanValue(newTarget, monkeys[monkey.left], monkeys);
		} else {
			const newTarget = target / getValue(monkeys[monkey.left], monkeys);
			return getHumanValue(newTarget, monkeys[monkey.right], monkeys); 
		}
	case '/':
		if(monkey.left === 'humn')
			return target * getValue(monkeys[monkey.right], monkeys);
		if(monkey.right === 'humn'){
			
			return target * getValue(monkeys[monkey.left], monkeys);
		}
			
		if(getSideWithHuman(monkey, monkeys) === 'left'){
			const newTarget = target * getValue(monkeys[monkey.right], monkeys);
			return getHumanValue(newTarget, monkeys[monkey.left], monkeys);
		} else {
			const newTarget = target * getValue(monkeys[monkey.left], monkeys);
			return getHumanValue(newTarget, monkeys[monkey.right], monkeys); 
		}
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
		operation: name === 'root' ? '-' : operator
	} as Monkey;
}).reduce((monkeyMap: MonkeyMap, currMonkey: Monkey) => {
	return {
		...monkeyMap,
		[currMonkey.name]: currMonkey
	};
}, {} as MonkeyMap);

const rootMonkey = monkeys['root'];

const answer = getHumanValue(0, rootMonkey, monkeys);

console.log(answer);
