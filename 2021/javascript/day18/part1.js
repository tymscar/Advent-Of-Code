const fs = require('fs');
const { SnailTreeNode } = require('./SnailTreeNode');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const createTree = (depth, from) => {
	const currTree = new SnailTreeNode();
	currTree.depth = depth;

	if(typeof from === 'number'){
		currTree.value = from;
	} else {
		const leftChild = createTree(depth +1 , from[0]);
		leftChild.parent = currTree;
		currTree.left = leftChild;
		const rightChild = createTree(depth +1, from[1]);
		rightChild.parent = currTree;
		currTree.right = rightChild;
	}
	return currTree;
};

let curr = null;

input.forEach(line => {
	const arrayRepresentation = JSON.parse(line);

	if(curr === null){
		curr = createTree(0, arrayRepresentation);
	} else {
		const newRightTree = createTree(0, arrayRepresentation);
		const mainTree = new SnailTreeNode();
		mainTree.left = curr;
		curr.parent = mainTree;
		mainTree.right = newRightTree;
		newRightTree.parent = mainTree;
		curr = createTree(0, mainTree.print());
	}

	curr.reduce();
});

console.log(curr.magnitude());
