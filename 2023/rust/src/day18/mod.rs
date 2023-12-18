mod part1;
mod part2;

use crate::common::DayData;

const INPUT: &str = include_str!("./input.txt");
const EXPECTED_PART1: &str = include_str!("./expected_part1.txt");
const EXPECTED_PART2: &str = include_str!("./expected_part2.txt");

pub fn solve() -> DayData {
    let part1_answer = part1::solve(INPUT);
    let part2_answer = part2::solve(INPUT);

    DayData {
        name: "Day 18: Lavaduct Lagoon".to_string(),
        part1_answer: part1_answer.to_string(),
        part1_correct: part1_answer == EXPECTED_PART1,
        part2_answer: part2_answer.to_string(),
        part2_correct: part2_answer == EXPECTED_PART2,
    }
}
