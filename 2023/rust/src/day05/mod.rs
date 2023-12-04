mod part1;
// mod part2;

use crate::part1::part1;
// use crate::part2::part2;

const INPUT: &str = include_str!("../../inputs/day05.txt");

pub fn main() {
    let part1_answer = part1(INPUT);
    // let part2_answer = part2(INPUT);

    println!("Part1: {:?}", part1_answer);
    // println!("Part2: {:?}", part2_answer);
}
