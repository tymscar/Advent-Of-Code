class SnailTreeNode {
	constructor() {
		this.depth = 0;
		this.value = null;
		this.left = null;
		this.right = null;
		this.parent = null;
	}

	magnitude() {
		if(this.value !== null)
			return this.value;
		return this.left.magnitude() * 3 + this.right.magnitude() * 2;
	}

	reduce() {
		let reduced = false;
		while (!reduced){
			reduced = true;
			const toExplode = this.nextToExplode();
			const toSplit = this.nextToSplit();
			if(toExplode !== null) {
				reduced = false;
				toExplode.explode();
			} else if(toSplit !== null) {
				reduced = false;
				toSplit.split();
			}
		}
		return this;
	}

	print() {
		if(this.value !== null)
			return this.value;
		else return [this.left.print(), this.right.print()];
	}

	nextToSplit() {
		if (this.value !== null) {
			if(this.value >= 10)
				return this;
		} else {
			const leftSplit = this.left.nextToSplit();
			if (leftSplit !== null)
				return leftSplit;
			const rightSplit = this.right.nextToSplit();
			if (rightSplit !== null)
				return rightSplit;
		}
		return null;
	}

	rightmostValue() {
		if (this.value !== null)
			return this;
		return this.right.rightmostValue();
	}

	leftmostValue() {
		if (this.value !== null)
			return this;
		return this.left.leftmostValue();
	}

	firstLeftAdj() {
		if(this.parent){
			if(this.parent.left !== this)
				return this.parent.left.rightmostValue();
			else
				return this.parent.firstLeftAdj();
		} else {
			return null;
		}
	}

	firstRightAdj() {
		if(this.parent){
			if(this.parent.right !== this)
				return this.parent.right.leftmostValue();
			else
				return this.parent.firstRightAdj();
		} else {
			return null;
		}
	}

	nextToExplode() {
		if(this.value !== null)
			return null;
		if(this.depth === 4)
			return this;
		const leftExplode = this.left.nextToExplode();
		if(leftExplode !== null && leftExplode.value === null)
			return leftExplode;
		const rightExplode = this.right.nextToExplode();
		if(rightExplode !== null && rightExplode.value === null)
			return rightExplode;
		return null;
	}

	explode() {
		const leftAdj = this.firstLeftAdj();
		const rightAdj = this.firstRightAdj();
		if(leftAdj !== null)
			leftAdj.value += this.left.value;
		if(rightAdj !== null)
			rightAdj.value += this.right.value;
		this.left = null;
		this.right = null;
		this.value = 0;
	}

	split() {
		const newLeft = new SnailTreeNode();
		newLeft.parent = this;
		newLeft.depth = this.depth +1;
		newLeft.value = Math.floor(this.value/2);
		this.left = newLeft;

		const newRight = new SnailTreeNode();
		newRight.parent = this;
		newRight.depth = this.depth +1;
		newRight.value = Math.ceil(this.value/2);
		this.right = newRight;

		this.value = null;
	}
}

exports.SnailTreeNode = SnailTreeNode;
