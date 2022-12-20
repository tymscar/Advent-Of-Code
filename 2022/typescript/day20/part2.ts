import * as fs from 'fs';

class Node {
	value: number;
	next: Node;
	prev: Node;
	origNext: Node;

	constructor(value: number) {
		this.value = value * 811589153;
		this.next = this;
		this.prev = this;
		this.origNext = this;
	}
}

const sum = (a: number, b: number): number => a + b;

const getZeroNode = (start: Node): Node => {
	let curr = start;

	while(curr.value != 0)
		curr = curr.next;
	
	return curr;
};

const getNthValue = (start: Node, offset: number): number => {
	let curr = start;
	for(let i=0; i<offset; i++){
		curr = curr.next;
	}
	return curr.value;
};

const mixList = (start: Node): void => {
	let curr = start;
	do {
		if(curr.value === 0){
			curr = curr.origNext;
			continue;
		}
        
		curr.prev.next = curr.next;
		curr.next.prev = curr.prev;
        
		let newPrev = curr;
		for(let i=0; i<((Math.abs(curr.value) % (input.length -1))); i++){
			if(curr.value < 0)
				newPrev = newPrev.prev;
			else
				newPrev = newPrev.next;
		}
		if(curr.value < 0)
			newPrev = newPrev.prev;
            
		curr.next = newPrev.next;
		curr.prev = newPrev;
		curr.next.prev = curr;
		curr.prev.next = curr;
        
		curr = curr.origNext;
	} while(curr != start);
};

const input = fs.readFileSync('inputs/day20.txt', 'utf8')
	.split('\n')
	.filter(l => l.length > 0)
	.map(Number);

const nodes = input.map(val => new Node(val));

for(let i = 1; i < input.length; i++){
	nodes[i-1].next = nodes[i];
	nodes[i-1].origNext = nodes[i];
	nodes[i].prev = nodes[i-1];
}

nodes[0].prev = nodes[input.length - 1];
nodes[input.length - 1].next = nodes[0];
nodes[input.length - 1].origNext = nodes[0];
	
const listStart = nodes[0];

for(let i=0; i<10; i++)
	mixList(listStart);

const zero =  getZeroNode(listStart);

const answer = [
	getNthValue(zero, 1000),
	getNthValue(zero, 2000),
	getNthValue(zero, 3000),
].reduce(sum);
    
console.log(answer);
