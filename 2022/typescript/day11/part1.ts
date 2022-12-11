import * as fs from 'fs';

const NUM_OF_ROUNDS = 20;

type Monkey = {
    items: bigint[],
    operation: (old: bigint) => bigint,
    divNum: bigint,
    trueMonkeyIndex: number,
    falseMonkeyIndex: number,
    itemsInspected: number
}

const playMonkeyAction = (monkeys: Monkey[], _: Monkey, currIdx: number): Monkey[] => {
	const curr = monkeys[currIdx];
	
	const toThrow: [number, bigint][] = curr.items.map(item => {
		const newWorry: bigint = curr.operation(item)/BigInt(3);
		if(newWorry % curr.divNum === 0n)
			return [curr.trueMonkeyIndex, newWorry];
		else
			return [curr.falseMonkeyIndex, newWorry];
	});

	return monkeys.map((monkey, i) => {
		if(currIdx === i){
			return {
				...curr,
				items: [],
				itemsInspected: curr.itemsInspected + toThrow.length
			} as Monkey;
		}

		const newItems: bigint[] = toThrow.filter(itm => itm[0] === i).map(itm => itm[1]);

		if(newItems.length > 0){
			return {
				...monkey,
				items: [...monkey.items, ...newItems]
			}as Monkey;
		}

		return monkey;
	});
};

const playRound = (monkeys: Monkey[]): Monkey[] => {
	return monkeys.reduce(playMonkeyAction, monkeys);
};

const input = fs.readFileSync('inputs/day11.txt', 'utf8').split('\n\n').filter(l => l.length > 0);
const monkeys: Monkey[] = input.map(inp => {
	const lines = inp.split('\n');
	const items = lines[1].split(' ').slice(4).map(a => BigInt(a.replace(',', '')));
	const operation = lines[2].split('= ')[1].split(' ');
	const operationFunc = (old: bigint): bigint => {
		const leftHand = operation[0] === 'old' ? old : BigInt(operation[0]);
		const rightHand = operation[2] === 'old' ? old : BigInt(operation[2]);
		if(operation[1] === '+')
			return leftHand + rightHand;
		else
			return leftHand * rightHand;
	};
	const test = lines[3].split(' ');
	const divNum = BigInt(test[test.length - 1]);
	const ifTrue = lines[4].split(' ');
	const trueMonkeyIndex = Number(ifTrue[ifTrue.length - 1]);
	const ifFalse = lines[5].split(' ');
	const falseMonkeyIndex = Number(ifFalse[ifFalse.length - 1]);

	return {
		items: items,
		operation: operationFunc,
		divNum: divNum,
		trueMonkeyIndex: trueMonkeyIndex,
		falseMonkeyIndex: falseMonkeyIndex,
		itemsInspected: 0
	} as Monkey;
});

const afterRounds = Array(NUM_OF_ROUNDS).fill('').reduce(playRound, monkeys);

const itemsInspected = afterRounds.map((m: Monkey) => m.itemsInspected);
const topTwoInspected = itemsInspected.sort((a, b) => b - a).slice(0, 2);

const answer = topTwoInspected[0] * topTwoInspected[1];

console.log(answer);
