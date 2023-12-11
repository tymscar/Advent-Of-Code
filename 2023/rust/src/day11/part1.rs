use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::collections::HashMap;

type Position = (usize, usize);
type Path = (Position, Position);
type Cost = usize;

fn get_empty_columns(map: &[Vec<char>]) -> Vec<usize> {
    let mut empty_columns: Vec<usize> = vec![];

    for x in 0..map[0].len() {
        let mut empty = true;
        for column in map.iter() {
            if column[x] == '#' {
                empty = false;
                break;
            }
        }
        if empty {
            empty_columns.push(x);
        }
    }

    empty_columns
}

fn get_empty_rows(map: &[Vec<char>]) -> Vec<usize> {
    let mut empty_rows: Vec<usize> = vec![];

    for (row_num, row) in map.iter().enumerate() {
        let mut empty = true;
        for cell in row.iter() {
            if *cell == '#' {
                empty = false;
                break;
            }
        }
        if empty {
            empty_rows.push(row_num);
        }
    }

    empty_rows
}

fn get_costs_map(map: &[Vec<char>]) -> HashMap<Position, Cost> {
    let empty_columns = get_empty_columns(map);
    let empty_rows = get_empty_rows(map);

    let mut costs: HashMap<Position, usize> = HashMap::new();

    for (row_num, row) in map.iter().enumerate() {
        for (col_num, cell) in row.iter().enumerate() {
            let cell_pos: Position = (row_num, col_num);
            let mut cell_price: usize = 1;
            match cell {
                '#' => {
                    cell_price = usize::MAX;
                    costs.insert(cell_pos, cell_price);
                }
                '.' => {
                    if empty_columns.contains(&cell_pos.1) {
                        cell_price += 1;
                    }
                    if empty_rows.contains(&cell_pos.0) {
                        cell_price += 1;
                    }
                    costs.insert(cell_pos, cell_price);
                }
                _ => panic!("Unknown cell type"),
            }
        }
    }

    costs
}

fn get_distance(
    map: &[Vec<char>],
    costs: &HashMap<Position, Cost>,
    start: Position,
    end: Position,
) -> usize {
    let mut heap: BinaryHeap<(Reverse<Cost>, Position)> = BinaryHeap::new();
    let mut distances: HashMap<Position, Cost> = HashMap::new();

    distances.insert(start, 0);
    heap.push((Reverse(0), start));

    while let Some((Reverse(cost), pos)) = heap.pop() {
        if pos == end {
            return cost;
        }

        if cost > *distances.get(&pos).unwrap_or(&usize::MAX) {
            continue;
        }

        let neighbors = [(0, 1), (1, 0), (0, -1), (-1, 0)];
        for &(dx, dy) in neighbors.iter() {
            let next_x = pos.0 as isize + dx;
            let next_y = pos.1 as isize + dy;

            if next_x < 0
                || next_y < 0
                || next_x as usize >= map.len()
                || next_y as usize >= map[0].len()
            {
                continue;
            }

            let next = (next_x as usize, next_y as usize);

            if map[next.0][next.1] == '#' && next != end {
                continue;
            }

            let mut next_cost = cost;
            if next == end {
                next_cost += 1;
            } else {
                next_cost += costs.get(&next).unwrap_or(&usize::MAX);
            }
            if next_cost < *distances.get(&next).unwrap_or(&usize::MAX) {
                heap.push((Reverse(next_cost), next));
                distances.insert(next, next_cost);
            }
        }
    }

    usize::MAX
}

fn get_star_distances(map: &[Vec<char>]) -> HashMap<Path, usize> {
    let mut star_distances: HashMap<Path, usize> = HashMap::new();
    let costs_map: HashMap<Position, Cost> = get_costs_map(map);

    let star_positions = map
        .iter()
        .enumerate()
        .flat_map(|(row_num, row)| {
            row.iter().enumerate().filter_map(move |(col_num, cell)| {
                if *cell == '#' {
                    Some((row_num, col_num))
                } else {
                    None
                }
            })
        })
        .collect::<Vec<_>>();

    let mut num = 0;
    for star1 in star_positions.iter() {
        for star2 in star_positions.iter() {
            if num % 5000 == 0 {
                println!("{} / {}", num, star_positions.len() * star_positions.len());
            }
            num += 1;
            if star1 == star2 {
                continue;
            }

            if star_distances.contains_key(&(*star2, *star1))
                || star_distances.contains_key(&(*star1, *star2))
            {
                continue;
            }

            let distance = get_distance(map, &costs_map, *star1, *star2);
            star_distances.insert((*star1, *star2), distance);
        }
    }

    star_distances
}

pub fn solve(input: &str) -> String {
    let map: Vec<_> = input
        .split('\n')
        .map(|l| l.chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();

    let distances = get_star_distances(&map);

    let total_distance = distances.values().sum::<usize>();

    total_distance.to_string()
}
