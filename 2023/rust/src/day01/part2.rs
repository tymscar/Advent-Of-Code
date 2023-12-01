use std::collections::HashMap;

fn parse_line_as_number(line: &str) -> u32 {
	let mappings: HashMap<&str, u32> = [
		("zero", 0),
		("one", 1),
		("two", 2),
		("three", 3),
		("four", 4),
		("five", 5),
		("six", 6),
		("seven", 7),
		("eight", 8),
		("nine", 9),
	].iter().cloned().collect();

	let mut digits: Vec<u32> = vec![];

	for index in 0..line.len() {
		if line.chars().nth(index).is_some_and(|c| c.is_digit(10)) {
			digits.push(line.chars().nth(index).unwrap_or('0').to_digit(10).unwrap());
		}
		for key in mappings.keys() {
			if line[index..].starts_with(key) {
				digits.push(*mappings.get(key).unwrap());
			}
		}
	}

	let first_digit = digits.iter().nth(0).unwrap_or(&0);
	let last_digit = digits.iter().nth_back(0).unwrap_or(&0);

	first_digit*10 + last_digit
}

pub fn part2(input: &str) -> String{
	let lines: Vec<_> = input.split("\n").collect();
	let numbers: Vec<u32> = lines.iter().map(|x| parse_line_as_number(x)).collect();

	let answer:u32 = numbers.iter().sum();

    answer.to_string()
}