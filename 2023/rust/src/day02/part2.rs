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
    hands: Vec<Hand>,
}

impl Game {
    fn new(description: &str) -> Game {
        let description = description.split(": ").collect::<Vec<_>>();
        let rounds = description[1].split("; ").collect::<Vec<_>>();
        let hands = rounds
            .iter()
            .map(|round| Hand::new(round))
            .collect::<Vec<_>>();

        Game { hands }
    }

    fn get_minimum_hand(&self) -> Hand {
        let mut minimum_hand = Hand::new_u32(0, 0, 0);
        for hand in &self.hands {
            if hand.red > minimum_hand.red {
                minimum_hand.red = hand.red;
            }
            if hand.green > minimum_hand.green {
                minimum_hand.green = hand.green;
            }
            if hand.blue > minimum_hand.blue {
                minimum_hand.blue = hand.blue;
            }
        }
        minimum_hand
    }

    fn get_power(&self) -> u32 {
        let min_hand = self.get_minimum_hand();
        min_hand.red * min_hand.green * min_hand.blue
    }
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.split('\n').collect();
    let games = lines.iter().map(|line| Game::new(line)).collect::<Vec<_>>();
    let powers = games
        .iter()
        .map(|game| game.get_power())
        .collect::<Vec<_>>();

    return powers.iter().sum::<u32>().to_string();
}
