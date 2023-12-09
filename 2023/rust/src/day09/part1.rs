fn get_next_value(numbers: &[isize]) -> isize {
    if numbers.iter().all(|&n| n == 0) {
        return 0;
    }

    let mut child_sequence: Vec<isize> = Vec::new();
    for (i, _) in numbers.iter().enumerate().skip(1) {
        child_sequence.push(numbers[i] - numbers[i - 1]);
    }

    let child_next_value = get_next_value(&child_sequence);

    numbers.last().unwrap() + child_next_value
}

pub fn solve(input: &str) -> String {
    let lines: Vec<Vec<isize>> = input
        .split('\n')
        .map(|line| {
            line.split_whitespace()
                .map(|a| a.parse().unwrap())
                .collect()
        })
        .collect();

    let extrapolated_numbers: Vec<isize> = lines.iter().map(|l| get_next_value(l)).collect();

    extrapolated_numbers.iter().sum::<isize>().to_string()
}
