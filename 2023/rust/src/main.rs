use std::time::Instant;
use std::vec;

mod common;
mod day01;
mod day02;
mod day03;
mod day04;
mod day05;
mod day06;
mod day07;
mod day08;
mod day09;
mod day10;
mod day11;
mod day12;
mod day13;
mod day14;
mod day15;
mod day16;
mod day17;
mod day18;
mod day19;
mod day20;
mod day21;
mod day22;

fn format_duration(duration: std::time::Duration) -> String {
    if duration.as_micros() < 1_000 {
        (duration.as_micros().to_string() + " μs").to_string()
    } else if duration.as_micros() < 1_000_000 {
        (duration.as_millis().to_string() + " ms").to_string()
    } else {
        (duration.as_secs().to_string() + " s ").to_string()
    }
}

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
            format_duration(duration).len()
        })
        .max()
        .unwrap();

    let part1_header_len = max_part1_len + 5;
    let part2_header_len = max_part2_len + 5;

    let max_total_len = max_name_len + part1_header_len + part2_header_len + max_time_len + 7;

    println!("╔{}╗", "═".repeat(max_total_len + 4));
    println!("║ {:^max_total_len$} ║", "🦀 Advent of Code 2023 🦀");
    println!(
        "╠{}╦{}╦{}╦{}╣",
        "═".repeat(max_name_len + 2),
        "═".repeat(part1_header_len + 2),
        "═".repeat(part2_header_len + 2),
        "═".repeat(max_time_len + 2)
    );
    println!(
        "║ {:max_name_len$} ║ {:part1_header_len$} ║ {:part2_header_len$} ║ {:max_time_len$} ║",
        "Day", "Part 1", "Part 2", "Time"
    );
    println!(
        "╠{}╬{}╦{}╬{}╦{}╬{}╣",
        "═".repeat(max_name_len + 2),
        "═".repeat(max_part1_len + 2),
        "═".repeat(4),
        "═".repeat(max_part2_len + 2),
        "═".repeat(4),
        "═".repeat(max_time_len + 2)
    );

    for day in days {
        let start = Instant::now();
        let result = day();
        let duration = start.elapsed();
        let part1_symbol = if result.part1_correct { "✅" } else { "❌" };
        let part2_symbol = if result.part2_correct { "✅" } else { "❌" };

        println!(
            "║ {:max_name_len$} ║ {:max_part1_len$} ║ {} ║ {:max_part2_len$} ║ {} ║ {:>max_time_len$} ║",
            result.name,
            result.part1_answer,
            part1_symbol,
            result.part2_answer,
            part2_symbol,
            format_duration(duration),
        );
    }

    println!(
        "╚{}╩{}╩{}╩{}╩{}╩{}╝",
        "═".repeat(max_name_len + 2),
        "═".repeat(max_part1_len + 2),
        "═".repeat(4),
        "═".repeat(max_part2_len + 2),
        "═".repeat(4),
        "═".repeat(max_time_len + 2)
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
        day07::solve,
        day08::solve,
        day09::solve,
        day10::solve,
        day11::solve,
        day12::solve,
        day13::solve,
        day14::solve,
        day15::solve,
        day16::solve,
        day17::solve,
        day18::solve,
        day19::solve,
        day20::solve,
        day21::solve,
        day22::solve,
    ];

    print_table(days);
}
