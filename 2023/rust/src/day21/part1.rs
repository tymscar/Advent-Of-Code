use std::collections::HashSet;

fn get_positions_after_steps(
    map: &Vec<Vec<char>>,
    start: (usize, usize),
    steps: usize,
) -> HashSet<(usize, usize)> {
    let mut positions: HashSet<(usize, usize)> = HashSet::new();
    positions.insert(start);

    for _ in 0..steps {
        let mut new_positions: HashSet<(usize, usize)> = HashSet::new();
        for position in positions {
            let (y, x) = position;
            if y > 0 && map[y - 1][x] == '.' {
                new_positions.insert((y - 1, x));
            }
            if y < map.len() - 1 && map[y + 1][x] == '.' {
                new_positions.insert((y + 1, x));
            }
            if x > 0 && map[y][x - 1] == '.' {
                new_positions.insert((y, x - 1));
            }
            if x < map[y].len() - 1 && map[y][x + 1] == '.' {
                new_positions.insert((y, x + 1));
            }
        }
        positions = new_positions;
    }
    positions
}

pub fn solve(input: &str) -> String {
    let mut starting_point = (0, 0);
    let map: Vec<Vec<char>> = input
        .lines()
        .enumerate()
        .map(|(y, l)| {
            l.chars()
                .enumerate()
                .map(|(x, char)| {
                    if char == 'S' {
                        starting_point = (y, x);
                        '.'
                    } else {
                        char
                    }
                })
                .collect()
        })
        .collect();

    get_positions_after_steps(&map, starting_point, 64)
        .len()
        .to_string()
}
