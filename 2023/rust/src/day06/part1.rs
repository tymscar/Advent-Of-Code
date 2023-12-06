struct Race {
    time: i32,
    distance: i32,
}

fn get_races(input: &str) -> Vec<Race> {
    let lines: Vec<_> = input.lines().collect();
    let times = lines
        .first()
        .unwrap()
        .split(':')
        .skip(1)
        .collect::<Vec<_>>()
        .iter()
        .flat_map(|x| x.split_whitespace().map(|y| y.parse::<i32>().unwrap()))
        .collect::<Vec<_>>();
    let distances = lines
        .last()
        .unwrap()
        .split(':')
        .skip(1)
        .collect::<Vec<_>>()
        .iter()
        .flat_map(|x| x.split_whitespace().map(|y| y.parse::<i32>().unwrap()))
        .collect::<Vec<_>>();

    times
        .iter()
        .zip(distances.iter())
        .map(|(a, b)| Race {
            time: *a,
            distance: *b,
        })
        .collect::<Vec<_>>()
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
    let races: Vec<Race> = get_races(input);
    let ways_to_win = races.iter().map(get_ways_to_win).collect::<Vec<_>>();

    ways_to_win.iter().product::<usize>().to_string()
}
