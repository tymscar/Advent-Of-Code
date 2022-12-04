import * as fs from 'fs';

interface IElf {
    min: number,
    max: number
}

const overlap = (elfs: IElf[]): boolean => {
	if(elfs[0].min >= elfs[1].min && elfs[0].max <= elfs[1].max)
		return true;
	if(elfs[1].min >= elfs[0].min && elfs[1].max <= elfs[0].max)
		return true;
	return false;
};

const input = fs.readFileSync('inputs/day04.txt', 'utf8').split('\n').filter(line => line.length !== 0);
const pairs = input.map(a => a.split(','));
const teams: IElf[][] = pairs.map(pair => {
	return pair.map(individual => {
		const range = individual.split('-');
		return {
			min: Number(range[0]),
			max: Number(range[1])
		} as IElf;
	});
});


const answer = teams.map(overlap).filter(Boolean).length;

console.log(answer);
