use std::time::Instant;
use std::vec;

mod common;
mod day01;
mod day02;
mod day03;
mod day04;
mod day05;
mod day06;

fn print_table(days: Vec<fn() -> common::DayData>) {
    let max_name_len = days.iter().map(|f| f().name.len()).max().unwrap();
    let max_part1_len = days.iter().map(|f| f().part1_answer.len()).max().unwrap();
    let max_part2_len = days.iter().map(|f| f().part2_answer.len()).max().unwrap();
    let max_time_len = days
        .iter()
        .map(|f| {
            let start = Instant::now();
            f();
            let duration = start.elapsed();
            duration.as_micros().to_string().len()
        })
        .max()
        .unwrap();

    let part1_header_len = max_part1_len + 5;
    let part2_header_len = max_part2_len + 5;
    let time_header_len = max_time_len + 3;

    let max_total_len = max_name_len + part1_header_len + part2_header_len + time_header_len + 7;

    println!("╔{}╗", "═".repeat(max_total_len + 4));
    println!("║ {:^max_total_len$} ║", "🦀 Advent of Code 2023 🦀");
    println!(
        "╠{}╦{}╦{}╦{}╣",
        "═".repeat(max_name_len + 2),
        "═".repeat(part1_header_len + 2),
        "═".repeat(part2_header_len + 2),
        "═".repeat(time_header_len + 2)
    );
    println!(
        "║ {:max_name_len$} ║ {:part1_header_len$} ║ {:part2_header_len$} ║ {:time_header_len$} ║",
        "Day", "Part 1", "Part 2", "Time"
    );
    println!(
        "╠{}╬{}╦{}╬{}╦{}╬{}╣",
        "═".repeat(max_name_len + 2),
        "═".repeat(max_part1_len + 2),
        "═".repeat(4),
        "═".repeat(max_part2_len + 2),
        "═".repeat(4),
        "═".repeat(max_time_len + 5)
    );

    for day in days {
        let start = Instant::now();
        let result = day();
        let duration = start.elapsed();
        let part1_symbol = if result.part1_correct { "✅" } else { "❌" };
        let part2_symbol = if result.part2_correct { "✅" } else { "❌" };

        println!(
            "║ {:max_name_len$} ║ {:max_part1_len$} ║ {} ║ {:max_part2_len$} ║ {} ║ {:max_time_len$} μs ║",
            result.name,
            result.part1_answer,
            part1_symbol,
            result.part2_answer,
            part2_symbol,
            duration.as_micros()
        );
    }

    println!(
        "╚{}╩{}╩{}╩{}╩{}╩{}╝",
        "═".repeat(max_name_len + 2),
        "═".repeat(max_part1_len + 2),
        "═".repeat(4),
        "═".repeat(max_part2_len + 2),
        "═".repeat(4),
        "═".repeat(max_time_len + 5)
    );
}

pub fn main() {
    let days: Vec<_> = vec![
        day01::solve,
        day02::solve,
        day03::solve,
        day04::solve,
        day05::solve,
        day06::solve,
    ];

    print_table(days);
}
