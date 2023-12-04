use std::collections::{HashMap, HashSet};

fn calculate_card_matches(card: &str) -> usize {
    let card: Vec<_> = card.split(": ").collect();
    let card: Vec<_> = card[1].split(" | ").collect();
    let winning_numbers: HashSet<_> = card[0].split(' ').filter(|x| !x.is_empty()).collect();
    let played_numbers: Vec<_> = card[1].split(' ').filter(|x| !x.is_empty()).collect();

    played_numbers
        .iter()
        .fold(0, |acc, &number| match winning_numbers.contains(&number) {
            true => acc + 1,
            false => acc,
        })
}

pub fn part2(input: &str) -> String {
    let lines: Vec<_> = input.split('\n').collect();
    let matches: Vec<_> = lines
        .iter()
        .map(|line| calculate_card_matches(line))
        .collect();

    let mut card_amounts: HashMap<usize, usize> = (0..lines.len()).map(|i| (i, 1)).collect();

    for (i, matches) in matches.iter().enumerate() {
        let curr_amount = *card_amounts.get(&i).unwrap();
        for index in i + 1..i + matches + 1 {
            if let Some(amount) = card_amounts.get_mut(&(index)) {
                *amount += curr_amount;
            }
        }
    }

    card_amounts.values().sum::<usize>().to_string()
}
