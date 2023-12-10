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

    (loop_pos.len() / 2).to_string()
}
