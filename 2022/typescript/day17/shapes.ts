export type Shape = {
    id: number,
	form: string[][],
	height: number,
	width: number
}

export const shapes: Shape[] = [
	{
		id: 0,
		form: [
			['#','#','#','#'],
		],
		height: 1,
		width: 4
	}, {
		id: 1,
		form: [
			['.','#','.'],
			['#','#','#'],
			['.','#','.'],
		],
		height: 3,
		width: 3
	}, {
		id: 2,
		form: [
			['#','#','#'],
			['.','.','#'],
			['.','.','#'],
		],
		height: 3,
		width: 3
	}, {
		id: 3,
		form: [
			['#'],
			['#'],
			['#'],
			['#'],
		],
		height: 4,
		width: 1
	}, {
		id: 4,
		form: [
			['#','#'],
			['#','#'],
		],
		height: 2,
		width: 2
	},
];
