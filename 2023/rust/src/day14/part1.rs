pub fn solve(input: &str) -> String {
    let lines: Vec<Vec<_>> = input.lines().map(|line| line.chars().collect()).collect();
    let mut empty_above: Vec<usize> = vec![0; lines[0].len()];

    let mut total_load = 0;
    for (vertical_pos, line) in lines.iter().enumerate() {
        for (horizontal_pos, c) in line.iter().enumerate() {
            match *c {
                '.' => {
                    empty_above[horizontal_pos] += 1;
                }
                '#' => {
                    empty_above[horizontal_pos] = 0;
                }
                'O' => {
                    let new_rock_pos = vertical_pos - empty_above[horizontal_pos];
                    total_load += lines.len() - new_rock_pos;
                }
                _ => panic!("Invalid rock type {}", *c),
            }
        }
    }

    total_load.to_string()
}
