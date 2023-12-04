const ENGLISH_DIGITS: [&str; 10] = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
];

fn parse_line_as_number(line: &str) -> u32 {
    let mut digits: Vec<u32> = vec![];

    for index in 0..line.len() {
        if line.chars().nth(index).is_some_and(|c| c.is_ascii_digit()) {
            digits.push(line.chars().nth(index).unwrap_or('0').to_digit(10).unwrap());
        }
        for (key, value) in ENGLISH_DIGITS.iter().enumerate() {
            if line[index..].starts_with(value) {
                digits.push(key as u32);
            }
        }
    }

    let first_digit = digits.first().unwrap_or(&0);
    let last_digit = digits.iter().nth_back(0).unwrap_or(&0);

    first_digit * 10 + last_digit
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.split('\n').collect();
    let numbers: Vec<u32> = lines.iter().map(|x| parse_line_as_number(x)).collect();

    let answer: u32 = numbers.iter().sum();

    answer.to_string()
}
