use std::collections::HashSet;

type Position = (usize, usize);

fn get_valid_neighbours(map: &Vec<Vec<char>>, position: Position) -> Vec<Position> {
    let (y, x) = position;
    let mut neighbours = Vec::new();
    let max_height = map.len() - 1;
    let max_width = map[0].len() - 1;
    let moves = match map[y][x] {
        'S' => vec![
            (y > 0, y - 1, x, vec!['|', '7', 'F']),
            (y < max_height, y + 1, x, vec!['|', 'J', 'L']),
            (x > 0, y, x - 1, vec!['-', 'F', 'L']),
            (x < max_width, y, x + 1, vec!['-', 'J', '7']),
        ],
        '|' => vec![
            (y > 0, y - 1, x, vec!['|', '7', 'F', 'S']),
            (y < max_height, y + 1, x, vec!['|', 'J', 'L', 'S']),
        ],
        '-' => vec![
            (x > 0, y, x - 1, vec!['-', 'F', 'L', 'S']),
            (x < max_width, y, x + 1, vec!['-', 'J', '7', 'S']),
        ],
        'L' => vec![
            (y > 0, y - 1, x, vec!['|', '7', 'F', 'S']),
            (x < max_width, y, x + 1, vec!['-', 'J', '7', 'S']),
        ],
        'J' => vec![
            (y > 0, y - 1, x, vec!['|', '7', 'F', 'S']),
            (x > 0, y, x - 1, vec!['-', 'F', 'L', 'S']),
        ],
        '7' => vec![
            (y < max_height, y + 1, x, vec!['|', 'J', 'L', 'S']),
            (x > 0, y, x - 1, vec!['-', 'F', 'L', 'S']),
        ],
        'F' => vec![
            (y < max_height, y + 1, x, vec!['|', 'J', 'L', 'S']),
            (x < max_width, y, x + 1, vec!['-', 'J', '7', 'S']),
        ],
        _ => Vec::new(),
    };
    for (condition, new_y, new_x, tiles) in moves {
        if condition && tiles.contains(&map[new_y][new_x]) {
            neighbours.push((new_y, new_x));
        }
    }
    neighbours
}

fn get_valid_s_shape(map: &Vec<Vec<char>>, s_position: Position) -> char {
    let neighbours = get_valid_neighbours(map, s_position);
    let (y, x) = s_position;
    let (above, below, left, right) = (
        neighbours.iter().any(|&(ny, _)| ny < y),
        neighbours.iter().any(|&(ny, _)| ny > y),
        neighbours.iter().any(|&(_, nx)| nx < x),
        neighbours.iter().any(|&(_, nx)| nx > x),
    );

    match (above, below, left, right) {
        (true, _, true, _) => 'J',
        (true, _, _, true) => 'L',
        (true, _, _, _) => '|',
        (_, true, true, _) => '7',
        (_, true, _, true) => 'F',
        (_, _, true, _) => '-',
        _ => 'S',
    }
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
