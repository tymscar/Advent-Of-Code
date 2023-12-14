type Map = Vec<Vec<char>>;

fn tilt_north(map: Map) -> Map {
    let mut empty_above: Vec<usize> = vec![0; map[0].len()];
    let mut new_map = map.clone();

    for (vertical_pos, line) in map.iter().enumerate() {
        for (horizontal_pos, rock) in line.iter().enumerate() {
            match rock {
                '.' => {
                    empty_above[horizontal_pos] += 1;
                }
                '#' => {
                    empty_above[horizontal_pos] = 0;
                }
                'O' => {
                    let new_rock_pos = vertical_pos - empty_above[horizontal_pos];
                    new_map[vertical_pos][horizontal_pos] = '.';
                    new_map[new_rock_pos][horizontal_pos] = 'O';
                }
                _ => panic!("Invalid rock type {}", rock),
            }
        }
    }

    new_map
}

fn tilt_east(map: Map) -> Map {
    let mut empty_right: Vec<usize> = vec![0; map.len()];
    let mut new_map = map.clone();

    for horizontal_pos in (0..map[0].len()).rev() {
        for vertical_pos in 0..map.len() {
            let rock = map[vertical_pos][horizontal_pos];
            match rock {
                '.' => {
                    empty_right[vertical_pos] += 1;
                }
                '#' => {
                    empty_right[vertical_pos] = 0;
                }
                'O' => {
                    let new_rock_pos = horizontal_pos + empty_right[vertical_pos];
                    new_map[vertical_pos][horizontal_pos] = '.';
                    new_map[vertical_pos][new_rock_pos] = 'O';
                }
                _ => panic!("Invalid rock type {}", rock),
            }
        }
    }

    new_map
}

fn tilt_south(map: Map) -> Map {
    let mut empty_below: Vec<usize> = vec![0; map[0].len()];
    let mut new_map = map.clone();
    let map_height = map.len();

    for (vertical_pos, line) in map.iter().rev().enumerate() {
        for (horizontal_pos, rock) in line.iter().enumerate() {
            match rock {
                '.' => {
                    empty_below[horizontal_pos] += 1;
                }
                '#' => {
                    empty_below[horizontal_pos] = 0;
                }
                'O' => {
                    let new_rock_pos = vertical_pos - empty_below[horizontal_pos];
                    new_map[map_height - 1 - vertical_pos][horizontal_pos] = '.';
                    new_map[map_height - 1 - new_rock_pos][horizontal_pos] = 'O';
                }
                _ => panic!("Invalid rock type {}", rock),
            }
        }
    }

    new_map
}

fn tilt_west(map: Map) -> Map {
    let mut empty_left: Vec<usize> = vec![0; map.len()];
    let mut new_map = map.clone();

    for horizontal_pos in 0..map[0].len() {
        for vertical_pos in 0..map.len() {
            let rock = map[vertical_pos][horizontal_pos];
            match rock {
                '.' => {
                    empty_left[vertical_pos] += 1;
                }
                '#' => {
                    empty_left[vertical_pos] = 0;
                }
                'O' => {
                    let new_rock_pos = horizontal_pos - empty_left[vertical_pos];
                    new_map[vertical_pos][horizontal_pos] = '.';
                    new_map[vertical_pos][new_rock_pos] = 'O';
                }
                _ => panic!("Invalid rock type {}", rock),
            }
        }
    }

    new_map
}

fn cycle(map: Map) -> Map {
    let map = tilt_north(map);
    let map = tilt_west(map);
    let map = tilt_south(map);
    tilt_east(map)
}

fn get_load_on_support(map: &Map) -> usize {
    let mut total_load = 0;
    for (vertical_pos, line) in map.iter().enumerate() {
        for (_, c) in line.iter().enumerate() {
            if *c == 'O' {
                total_load += map.len() - vertical_pos;
            }
        }
    }

    total_load
}

pub fn solve(input: &str) -> String {
    let mut map: Map = input.lines().map(|line| line.chars().collect()).collect();

    let mut seen_states: Vec<Map> = vec![map.clone()];

    loop {
        map = cycle(map.clone());
        if let Some(index) = seen_states.iter().position(|x| x == &map) {
            let cycle_length = seen_states.len() - index;
            let cycle_start = index;
            let final_map =
                seen_states[cycle_start + (1000000000 - cycle_start) % cycle_length].clone();

            return get_load_on_support(&final_map).to_string();
        }
        seen_states.push(map.clone());
    }
}
