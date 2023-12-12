use std::collections::HashMap;
use std::str::FromStr;

fn get_combinations(
    springs: &str,
    instrs: &[usize],
    s_idx: usize,
    i_idx: usize,
    memo: &mut HashMap<(usize, usize), usize>,
) -> usize {
    if springs.len() <= s_idx {
        if instrs.len() <= i_idx {
            return 1;
        } else {
            return 0;
        }
    }

    if instrs.len() <= i_idx {
        if springs[s_idx..].contains('#') {
            return 0;
        } else {
            return 1;
        }
    }

    if let Some(cached_value) = memo.get(&(s_idx, i_idx)) {
        return *cached_value;
    }

    let curr_spring = springs.chars().nth(s_idx).unwrap();
    let expected_springs: usize = *instrs.get(i_idx).unwrap();

    let mut result = 0;

    if curr_spring == '.' || curr_spring == '?' {
        result += get_combinations(springs, instrs, s_idx + 1, i_idx, memo);
    }

    if (curr_spring == '#' || curr_spring == '?')
        && (springs.len() - s_idx) >= expected_springs
        && !springs[s_idx..(expected_springs + s_idx)].contains('.')
        && ((springs.len() - s_idx) == expected_springs
            || springs.chars().nth(expected_springs + s_idx).unwrap() != '#')
    {
        result += get_combinations(
            springs,
            instrs,
            expected_springs + 1 + s_idx,
            i_idx + 1,
            memo,
        );
    }

    memo.insert((s_idx, i_idx), result);

    result
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
                    .map(usize::from_str)
                    .map(|a| a.unwrap())
                    .collect::<Vec<_>>(),
            )
        })
        .collect::<Vec<_>>();

    lines
        .iter()
        .map(|(a, b)| {
            let mut memoization = HashMap::new();
            get_combinations(a, b, 0, 0, &mut memoization)
        })
        .sum::<usize>()
        .to_string()
}
