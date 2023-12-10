use std::collections::HashSet;

type Position = (usize, usize);

fn get_valid_neighbours(map: &Vec<Vec<char>>, position: Position) -> Vec<Position> {
    let (y, x) = position;
    let mut neighbours: Vec<Position> = vec![];
    let curr_tile = map[y][x];
    let max_height = map.len() - 1;
    let max_width = map[0].len() - 1;

    match curr_tile {
        'S' => {
            if y > 0 {
                match map[y - 1][x] {
                    '|' | '7' | 'F' => neighbours.push((y - 1, x)),
                    _ => (),
                }
            }
            if y < max_height {
                match map[y + 1][x] {
                    '|' | 'J' | 'L' => neighbours.push((y + 1, x)),
                    _ => (),
                }
            }
            if x > 0 {
                match map[y][x - 1] {
                    '-' | 'F' | 'L' => neighbours.push((y, x - 1)),
                    _ => (),
                }
            }
            if x < max_width {
                match map[y][x + 1] {
                    '-' | 'J' | '7' => neighbours.push((y, x + 1)),
                    _ => (),
                }
            }
        }
        '|' => {
            if y > 0 {
                match map[y - 1][x] {
                    '|' | '7' | 'F' | 'S' => neighbours.push((y - 1, x)),
                    _ => (),
                }
            }
            if y < max_height && map[y + 1][x] != '.' {
                match map[y + 1][x] {
                    '|' | 'J' | 'L' | 'S' => neighbours.push((y + 1, x)),
                    _ => (),
                }
            }
        }
        '-' => {
            if x > 0 {
                match map[y][x - 1] {
                    '-' | 'F' | 'L' | 'S' => neighbours.push((y, x - 1)),
                    _ => (),
                }
            }
            if x < max_width {
                match map[y][x + 1] {
                    '-' | 'J' | '7' | 'S' => neighbours.push((y, x + 1)),
                    _ => (),
                }
            }
        }
        'L' => {
            if y > 0 {
                match map[y - 1][x] {
                    '|' | '7' | 'F' | 'S' => neighbours.push((y - 1, x)),
                    _ => (),
                }
            }
            if x < max_width {
                match map[y][x + 1] {
                    '-' | 'J' | '7' | 'S' => neighbours.push((y, x + 1)),
                    _ => (),
                }
            }
        }
        'J' => {
            if y > 0 {
                match map[y - 1][x] {
                    '|' | '7' | 'F' | 'S' => neighbours.push((y - 1, x)),
                    _ => (),
                }
            }
            if x > 0 {
                match map[y][x - 1] {
                    '-' | 'F' | 'L' | 'S' => neighbours.push((y, x - 1)),
                    _ => (),
                }
            }
        }
        '7' => {
            if y < max_height {
                match map[y + 1][x] {
                    '|' | 'J' | 'L' | 'S' => neighbours.push((y + 1, x)),
                    _ => (),
                }
            }
            if x > 0 {
                match map[y][x - 1] {
                    '-' | 'F' | 'L' | 'S' => neighbours.push((y, x - 1)),
                    _ => (),
                }
            }
        }
        'F' => {
            if y < max_height {
                match map[y + 1][x] {
                    '|' | 'J' | 'L' | 'S' => neighbours.push((y + 1, x)),
                    _ => (),
                }
            }
            if x < max_width {
                match map[y][x + 1] {
                    '-' | 'J' | '7' | 'S' => neighbours.push((y, x + 1)),
                    _ => (),
                }
            }
        }
        _ => (),
    }

    neighbours
}

fn get_valid_s_shape(map: &Vec<Vec<char>>, s_position: Position) -> char {
    let neighbours = get_valid_neighbours(map, s_position);
    let neighbour_above = neighbours.iter().find(|(y, _)| *y < s_position.0);
    let neighbour_below = neighbours.iter().find(|(y, _)| *y > s_position.0);
    let neighbour_left = neighbours.iter().find(|(_, x)| *x < s_position.1);
    let neighbour_right = neighbours.iter().find(|(_, x)| *x > s_position.1);

    if neighbour_above.is_some() {
        if neighbour_left.is_some() {
            return 'J';
        }
        if neighbour_right.is_some() {
            return 'L';
        }
        if neighbour_below.is_some() {
            return '|';
        }
    }
    if neighbour_below.is_some() && neighbour_left.is_some() {
        return '7';
    }
    if neighbour_right.is_some() {
        if neighbour_below.is_some() {
            return 'F';
        }
        if neighbour_left.is_some() {
            return '-';
        }
    }

    'S'
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.split('\n').collect();
    let map: Vec<Vec<_>> = lines.iter().map(|line| line.chars().collect()).collect();

    let start: Position = map
        .iter()
        .enumerate()
        .find_map(|(y, line)| {
            line.iter()
                .enumerate()
                .find_map(|(x, c)| if *c == 'S' { Some((y, x)) } else { None })
        })
        .unwrap();

    let mut loop_pos: HashSet<Position> = HashSet::new();
    loop_pos.insert(start);
    let mut to_visit: Vec<Position> = get_valid_neighbours(&map, start);

    while let Some(curr_pos) = to_visit.pop() {
        for neighbour in get_valid_neighbours(&map, curr_pos) {
            if !loop_pos.contains(&neighbour) {
                to_visit.push(neighbour);
                loop_pos.insert(neighbour);
            }
        }
    }

    let mut need_to_prune = true;
    while need_to_prune {
        need_to_prune = false;
        for pos in loop_pos.clone() {
            let neighbours = get_valid_neighbours(&map, pos);
            let mut valid_neighbours = 0;
            for neighbour in neighbours {
                if loop_pos.contains(&neighbour) {
                    valid_neighbours += 1;
                }
            }
            if valid_neighbours < 2 {
                need_to_prune = true;
                loop_pos.remove(&pos);
            }
        }
    }

    let map_with_loop_only: Vec<Vec<char>> = map
        .iter()
        .enumerate()
        .map(|(y, line)| {
            line.iter()
                .enumerate()
                .map(|(x, c)| {
                    if loop_pos.contains(&(y, x)) {
                        if *c == 'S' {
                            return get_valid_s_shape(&map, start);
                        }
                        return *c;
                    }
                    '.'
                })
                .collect()
        })
        .collect();

    let mut values_inside_loop = 0;

    for line in map_with_loop_only.iter() {
        let mut inside = false;
        for c in line.iter() {
            match c {
                '.' => {
                    if inside {
                        values_inside_loop += 1;
                    }
                }
                '|' | 'J' | 'L' => {
                    inside = !inside;
                }
                _ => (),
            }
        }
    }

    values_inside_loop.to_string()
}
