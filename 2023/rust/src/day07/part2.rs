use std::cmp::Ordering;

const NON_JOKER_CARDS: &str = "23456789TQKA";

#[derive(Debug)]
struct Hand {
    cards: String,
    bid: usize,
}

#[derive(Debug, PartialEq, PartialOrd, Eq, Ord)]
enum HandType {
    HighCard = 0,
    OnePair = 1,
    TwoPairs = 2,
    ThreeOfAKind = 3,
    FullHouse = 4,
    FourOfAKind = 5,
    FiveOfAKind = 6,
}

impl Hand {
    fn new(cards: String, bid: usize) -> Hand {
        Hand { cards, bid }
    }

    fn generate_all_combinations(cards: String) -> Vec<String> {
        if !cards.contains('J') {
            return vec![cards];
        }
        let cards = cards.chars().collect::<String>();

        let first_j_pos = cards.find('J').unwrap();
        NON_JOKER_CARDS
            .chars()
            .flat_map(|c| {
                let mut new_starting_cards = String::new();
                new_starting_cards.push_str(&cards[0..first_j_pos]);
                new_starting_cards.push(c);
                new_starting_cards.push_str(&cards[first_j_pos + 1..]);
                Self::generate_all_combinations(new_starting_cards.clone())
            })
            .collect()
    }

    fn get_best_hand_type(&self) -> HandType {
        let cards = self.cards.clone();
        Self::generate_all_combinations(cards)
            .iter()
            .map(|cards| {
                let mut card_pairs = split_in_groups(cards);
                card_pairs.sort_by_key(|b| std::cmp::Reverse(b.len()));
                match card_pairs.len() {
                    1 => HandType::FiveOfAKind,
                    2 => {
                        if card_pairs[0].len() == 3 {
                            HandType::FullHouse
                        } else {
                            HandType::FourOfAKind
                        }
                    }
                    3 => {
                        if card_pairs[0].len() == 2 {
                            HandType::TwoPairs
                        } else {
                            HandType::ThreeOfAKind
                        }
                    }
                    4 => HandType::OnePair,
                    5 => HandType::HighCard,
                    _ => panic!("Unknown hand type"),
                }
            })
            .max()
            .unwrap()
    }

    fn cmp(&self, other: &Hand) -> Ordering {
        let this_hand_type = self.get_best_hand_type();
        let other_hand_type = other.get_best_hand_type();

        match this_hand_type.cmp(&other_hand_type) {
            Ordering::Greater => Ordering::Greater,
            Ordering::Less => Ordering::Less,
            Ordering::Equal => compare_card_list(&self.cards, &other.cards),
        }
    }
}

fn compare_card_list(a: &str, b: &str) -> Ordering {
    fn convert_card(c: char) -> char {
        match c {
            'J' => 'A',
            '2' => 'B',
            '3' => 'C',
            '4' => 'D',
            '5' => 'E',
            '6' => 'F',
            '7' => 'G',
            '8' => 'H',
            '9' => 'I',
            'T' => 'J',
            'Q' => 'K',
            'K' => 'L',
            'A' => 'M',
            _ => panic!("Unknown card"),
        }
    }

    let a = a.chars().map(convert_card).collect::<String>();
    let b = b.chars().map(convert_card).collect::<String>();

    for (char_a, char_b) in a.chars().zip(b.chars()) {
        match char_a.cmp(&char_b) {
            Ordering::Greater => return Ordering::Greater,
            Ordering::Less => return Ordering::Less,
            Ordering::Equal => continue,
        }
    }

    Ordering::Equal
}

fn split_in_groups(s: &str) -> Vec<String> {
    let mut s = s.chars().collect::<Vec<_>>();
    s.sort();
    let s = s.iter().collect::<String>();

    let mut result = Vec::new();
    let mut chars = s.chars().peekable();

    while let Some(c) = chars.next() {
        let mut group = c.to_string();
        while chars.peek() == Some(&c) {
            group.push(chars.next().unwrap());
        }
        result.push(group);
    }

    result
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.split('\n').collect();
    let mut hands: Vec<Hand> = lines
        .iter()
        .map(|line| {
            let mapping = line.split(' ').collect::<Vec<_>>();
            Hand::new(mapping[0].to_string(), mapping[1].parse::<usize>().unwrap())
        })
        .collect();

    hands.sort_by(|a, b| a.cmp(b));

    let winnings: usize = hands
        .iter()
        .enumerate()
        .map(|(rank, hand)| (rank + 1) * hand.bid)
        .sum();

    winnings.to_string()
}
