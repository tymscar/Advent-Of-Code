fn parse_line_as_number(line: &str) -> u32 {
	let digits = line.chars().filter(|c| c.is_digit(10)).collect::<Vec<_>>();
	let first_digit = digits.iter().nth(0).unwrap_or(&'0').to_digit(10).unwrap();
	let last_digit = digits.iter().nth_back(0).unwrap_or(&'0').to_digit(10).unwrap();

	first_digit*10 + last_digit
}

pub fn part1(input: &str) -> String{
	let lines: Vec<_> = input.split("\n").collect();
	let numbers: Vec<u32> = lines.iter().map(|x| parse_line_as_number(x)).collect();

	let answer:u32 = numbers.iter().sum();

    answer.to_string()
}