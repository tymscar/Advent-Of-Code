use regex::Regex;

fn extract_count_with_regex(regex: &str, input: &str) -> u32 {
    let re = Regex::new(regex).unwrap();
    if let Some(captures) = re.captures(input) {
        if let Ok(count) = captures.get(1).unwrap().as_str().parse::<u32>() {
            return count;
        }
    }
    0
}

struct Hand {
    red: u32,
    green: u32,
    blue: u32,
}

impl Hand {
    fn new(round: &str) -> Hand {
        Hand {
            red: extract_count_with_regex(r"(\d+)\s*red", round),
            green: extract_count_with_regex(r"(\d+)\s*green", round),
            blue: extract_count_with_regex(r"(\d+)\s*blue", round),
        }
    }
    fn new_u32(red: u32, green: u32, blue: u32) -> Hand {
        Hand { red, green, blue }
    }
}

struct Game {
    id: u32,
    hands: Vec<Hand>,
}

impl Game {
    fn new(description: &str) -> Game {
        let description = description.split(": ").collect::<Vec<_>>();
        let id = extract_count_with_regex(r"Game\s+(\d+)", description[0]);
        let rounds = description[1].split("; ").collect::<Vec<_>>();
        let hands = rounds
            .iter()
            .map(|round| Hand::new(round))
            .collect::<Vec<_>>();

        Game { id, hands }
    }

    fn is_possible_with_hand(&self, hand: Hand) -> bool {
        for other_hand in &self.hands {
            if hand.red < other_hand.red
                || hand.green < other_hand.green
                || hand.blue < other_hand.blue
            {
                return false;
            }
        }
        true
    }
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.split('\n').collect();
    let games = lines.iter().map(|line| Game::new(line)).collect::<Vec<_>>();
    let possible_games = games
        .iter()
        .filter(|game| game.is_possible_with_hand(Hand::new_u32(12, 13, 14)))
        .collect::<Vec<_>>();

    return possible_games
        .iter()
        .fold(0, |acc, game| acc + game.id)
        .to_string();
}
