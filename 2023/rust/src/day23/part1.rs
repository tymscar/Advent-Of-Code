use std::collections::HashMap;

type Position = (usize, usize);

fn get_neighbours(position: Position, map: &Vec<&str>) -> Vec<Position> {
    let mut neighbours = Vec::new();

    if position.0 > 0 && map[position.0 - 1].chars().nth(position.1).unwrap() != '#' {
        neighbours.push((position.0 - 1, position.1));
    }

    if position.0 < map.len() - 1 && map[position.0 + 1].chars().nth(position.1).unwrap() != '#' {
        neighbours.push((position.0 + 1, position.1));
    }

    if position.1 > 0 && map[position.0].chars().nth(position.1 - 1).unwrap() != '#' {
        neighbours.push((position.0, position.1 - 1));
    }

    if position.1 < map[0].len() - 1 && map[position.0].chars().nth(position.1 + 1).unwrap() != '#'
    {
        neighbours.push((position.0, position.1 + 1));
    }

    neighbours
}

fn get_valid_next_pos(curr_pos: Position, map: &Vec<&str>) -> Vec<Position> {
    let mut valid_next_pos = Vec::new();
    let curr_char = map[curr_pos.0].chars().nth(curr_pos.1).unwrap();

    for neighbour in get_neighbours(curr_pos, map) {
        match curr_char {
            '.' => {
                valid_next_pos.push(neighbour);
            }
            '>' => {
                if neighbour.1 > curr_pos.1 {
                    valid_next_pos.push(neighbour);
                }
            }
            '<' => {
                if neighbour.1 < curr_pos.1 {
                    valid_next_pos.push(neighbour);
                }
            }
            '^' => {
                if neighbour.0 < curr_pos.0 {
                    valid_next_pos.push(neighbour);
                }
            }
            'v' => {
                if neighbour.0 > curr_pos.0 {
                    valid_next_pos.push(neighbour);
                }
            }
            _ => panic!("Invalid char: {}", curr_char),
        }
    }

    valid_next_pos
}

fn get_longest_dist(
    start: Position,
    end: Position,
    map: &HashMap<Position, HashMap<Position, usize>>,
) -> isize {
    if start == end {
        return 0;
    }

    let mut distance = isize::MIN;

    for neighbour in map.get(&start).unwrap().keys() {
        let next_dist = get_longest_dist(*neighbour, end, map);
        distance =
            distance.max(next_dist + *map.get(&start).unwrap().get(neighbour).unwrap() as isize);
    }

    distance
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.lines().collect();

    let start_pos: Position = (0, lines[0].find('.').unwrap());
    let end_pos: Position = (lines.len() - 1, lines[lines.len() - 1].find('.').unwrap());

    let mut points_of_interest = vec![start_pos, end_pos];

    for (i, line) in lines.iter().enumerate() {
        for (j, c) in line.chars().enumerate() {
            let curr_point: Position = (i, j);
            if c != '#' && get_neighbours(curr_point, &lines).len() > 2 {
                points_of_interest.push(curr_point);
            }
        }
    }

    let mut map: HashMap<Position, HashMap<Position, usize>> = HashMap::new();
    for point in &points_of_interest {
        map.insert(*point, HashMap::new());
    }

    for point in &points_of_interest {
        type PricePosition = (Position, usize);
        let mut to_visit: Vec<PricePosition> = vec![(*point, 0)];
        let mut visited: Vec<Position> = Vec::new();

        while let Some((curr_point, curr_price)) = to_visit.pop() {
            if points_of_interest.contains(&curr_point) && curr_price != 0 {
                map.entry(*point)
                    .or_default()
                    .entry(curr_point)
                    .or_insert(curr_price);
                continue;
            }

            for next_point in get_valid_next_pos(curr_point, &lines) {
                if !visited.contains(&next_point) {
                    to_visit.push((next_point, curr_price + 1));
                    visited.push(next_point);
                }
            }

            visited.push(curr_point);
        }
    }

    get_longest_dist(start_pos, end_pos, &map).to_string()
}
