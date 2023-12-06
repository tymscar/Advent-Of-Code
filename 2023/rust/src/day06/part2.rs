struct Race {
    time: usize,
    distance: usize,
}

fn get_race(input: &str) -> Race {
    let lines: Vec<_> = input.lines().collect();
    let time = lines
        .first()
        .unwrap()
        .split(':')
        .skip(1)
        .collect::<Vec<_>>()
        .iter()
        .map(|x| x.split_whitespace().collect::<Vec<_>>().join(""))
        .collect::<String>()
        .parse::<usize>()
        .unwrap();
    let distance = lines
        .last()
        .unwrap()
        .split(':')
        .skip(1)
        .collect::<Vec<_>>()
        .iter()
        .map(|x| x.split_whitespace().collect::<Vec<_>>().join(""))
        .collect::<String>()
        .parse::<usize>()
        .unwrap();

    Race { time, distance }
}

fn get_ways_to_win(race: &Race) -> usize {
    let mut wins = 0;
    for hold_time in 0..=race.time {
        let distance = hold_time * (race.time - hold_time);
        if distance > race.distance {
            wins += 1;
        }
    }

    wins
}

pub fn solve(input: &str) -> String {
    let race: Race = get_race(input);

    get_ways_to_win(&race).to_string()
}
