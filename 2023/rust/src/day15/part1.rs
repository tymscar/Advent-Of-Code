use std::usize;

fn get_hash_of(string: &str) -> usize {
    string
        .chars()
        .fold(0, |acc, c| ((acc + c as usize) * 17) % 256)
}

pub fn solve(input: &str) -> String {
    input.split(',').map(get_hash_of).sum::<usize>().to_string()
}
