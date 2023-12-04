use std::collections::HashSet;

fn calculate_card_worth(card: &str) -> usize {
    let card: Vec<_> = card.split(": ").collect();
    let card: Vec<_> = card[1].split(" | ").collect();
    let winning_numbers: HashSet<_> = card[0].split(' ').filter(|x| !x.is_empty()).collect();
    let played_numbers: Vec<_> = card[1].split(' ').filter(|x| !x.is_empty()).collect();

    let mut matches: u32 = 0;
    for number in played_numbers {
        if winning_numbers.contains(number) {
            matches += 1;
        }
    }

    match matches {
        0 => 0,
        _ => 2_usize.pow(matches - 1),
    }
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.split('\n').collect();
    let points: Vec<_> = lines
        .iter()
        .map(|line| calculate_card_worth(line))
        .collect();

    points.iter().sum::<usize>().to_string()
}
