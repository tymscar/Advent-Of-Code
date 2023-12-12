use std::collections::HashMap;
use std::str::FromStr;

fn get_combinations(
    springs: &Vec<char>,
    instructions: &Vec<u128>,
    memoization: &mut HashMap<(Vec<u128>, Vec<char>), u128>,
) -> u128 {
    if springs.is_empty() {
        if instructions.is_empty() {
            return 1;
        } else {
            return 0;
        }
    }

    let first_spring = springs[0];

    let next_combinations_same_instr =
        get_combinations(&springs[1..].to_vec(), instructions, memoization);

    match first_spring {
        '.' => next_combinations_same_instr,
        '#' => {
            if let Some(&curr_combinations) =
                memoization.get(&(instructions.clone(), springs.clone()))
            {
                return curr_combinations;
            }

            if instructions.is_empty() {
                return 0;
            }

            let wanted_spring_len = instructions[0] as usize;
            if springs.len() < wanted_spring_len {
                return 0;
            }

            for spring in &springs[0..wanted_spring_len] {
                if spring == &'.' {
                    return 0;
                }
            }

            if springs.len() == wanted_spring_len {
                if instructions.len() == 1 {
                    return 1;
                }
                return 0;
            }

            if springs[wanted_spring_len] == '#' {
                return 0;
            }

            let next_combinations_next_instr: u128 = get_combinations(
                &springs[(wanted_spring_len + 1)..].to_vec(),
                &instructions[1..].to_vec(),
                memoization,
            );

            memoization.insert(
                (instructions.clone(), springs.clone()),
                next_combinations_next_instr,
            );

            next_combinations_next_instr
        }
        '?' => {
            if let Some(&curr_combinations) =
                memoization.get(&(instructions.clone(), springs.clone()))
            {
                return curr_combinations + next_combinations_same_instr;
            }

            if instructions.is_empty() {
                return next_combinations_same_instr;
            }

            let wanted_spring_len = instructions[0] as usize;
            if springs.len() < wanted_spring_len {
                return next_combinations_same_instr;
            }

            for spring in &springs[0..wanted_spring_len] {
                if spring == &'.' {
                    return next_combinations_same_instr;
                }
            }
            if springs.len() == wanted_spring_len {
                if instructions.len() == 1 {
                    return 1 + next_combinations_same_instr;
                }

                return next_combinations_same_instr;
            }

            if springs[wanted_spring_len] == '#' {
                return next_combinations_same_instr;
            }

            let next_combinations_next_instr: u128 = get_combinations(
                &springs[(wanted_spring_len + 1)..].to_vec(),
                &instructions[1..].to_vec(),
                memoization,
            );

            memoization.insert(
                (instructions.clone(), springs.clone()),
                next_combinations_next_instr,
            );

            next_combinations_next_instr + next_combinations_same_instr
        }
        _ => panic!("Invalid spring"),
    }
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input
        .split('\n')
        .map(|line| line.split(' ').collect::<Vec<_>>())
        .map(|line| {
            let mut springs = String::new();
            for _ in 0..5 {
                springs.push_str(line[0]);
                springs.push('?')
            }
            springs.pop();

            let mut instructions = String::new();
            for _ in 0..5 {
                instructions.push_str(line[1]);
                instructions.push(',')
            }
            instructions.pop();

            (
                springs.to_string(),
                instructions
                    .split(',')
                    .map(u128::from_str)
                    .map(|a| a.unwrap())
                    .collect::<Vec<_>>(),
            )
        })
        .collect::<Vec<_>>();

    lines
        .iter()
        .map(|(a, b)| {
            let mut memoization = HashMap::new();
            get_combinations(&a.chars().collect::<Vec<_>>(), b, &mut memoization)
        })
        .sum::<u128>()
        .to_string()
}
