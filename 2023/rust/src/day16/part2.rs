use std::collections::HashSet;

type Position = (usize, usize);

#[derive(Eq, Hash, PartialEq, Clone, Copy)]
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

#[derive(Eq, Hash, PartialEq, Clone, Copy)]
struct Beam {
    pos: Position,
    dir: Direction,
}

fn get_amount_energized_from_pos(start_beam: Beam, map: &Vec<Vec<char>>) -> usize {
    let mut visited: HashSet<Position> = HashSet::new();
    let mut previous_beams: HashSet<Beam> = HashSet::new();

    let mut to_explore = vec![start_beam];

    while let Some(curr_beam) = to_explore.pop() {
        let curr_tile = map[curr_beam.pos.0][curr_beam.pos.1];
        if previous_beams.contains(&curr_beam) {
            continue;
        }
        previous_beams.insert(curr_beam);
        visited.insert(curr_beam.pos);
        match curr_tile {
            '.' => match curr_beam.dir {
                Direction::Up => {
                    if curr_beam.pos.0 == 0 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0 - 1, curr_beam.pos.1),
                        dir: Direction::Up,
                    });
                }
                Direction::Down => {
                    if curr_beam.pos.0 == map.len() - 1 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0 + 1, curr_beam.pos.1),
                        dir: Direction::Down,
                    });
                }
                Direction::Left => {
                    if curr_beam.pos.1 == 0 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0, curr_beam.pos.1 - 1),
                        dir: Direction::Left,
                    });
                }
                Direction::Right => {
                    if curr_beam.pos.1 == map[0].len() - 1 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0, curr_beam.pos.1 + 1),
                        dir: Direction::Right,
                    });
                }
            },
            '|' => match curr_beam.dir {
                Direction::Up => {
                    if curr_beam.pos.0 == 0 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0 - 1, curr_beam.pos.1),
                        dir: Direction::Up,
                    });
                }
                Direction::Down => {
                    if curr_beam.pos.0 == map.len() - 1 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0 + 1, curr_beam.pos.1),
                        dir: Direction::Down,
                    });
                }
                Direction::Left | Direction::Right => {
                    if curr_beam.pos.0 > 0 {
                        to_explore.push(Beam {
                            pos: (curr_beam.pos.0 - 1, curr_beam.pos.1),
                            dir: Direction::Up,
                        });
                    }
                    if curr_beam.pos.0 < map.len() - 1 {
                        to_explore.push(Beam {
                            pos: (curr_beam.pos.0 + 1, curr_beam.pos.1),
                            dir: Direction::Down,
                        });
                    }
                }
            },
            '-' => match curr_beam.dir {
                Direction::Up | Direction::Down => {
                    if curr_beam.pos.1 > 0 {
                        to_explore.push(Beam {
                            pos: (curr_beam.pos.0, curr_beam.pos.1 - 1),
                            dir: Direction::Left,
                        });
                    }
                    if curr_beam.pos.1 < map[0].len() - 1 {
                        to_explore.push(Beam {
                            pos: (curr_beam.pos.0, curr_beam.pos.1 + 1),
                            dir: Direction::Right,
                        });
                    }
                }
                Direction::Left => {
                    if curr_beam.pos.1 == 0 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0, curr_beam.pos.1 - 1),
                        dir: Direction::Left,
                    });
                }
                Direction::Right => {
                    if curr_beam.pos.1 == map[0].len() - 1 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0, curr_beam.pos.1 + 1),
                        dir: Direction::Right,
                    });
                }
            },
            '/' => match curr_beam.dir {
                Direction::Up => {
                    if curr_beam.pos.1 == map[0].len() - 1 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0, curr_beam.pos.1 + 1),
                        dir: Direction::Right,
                    });
                }
                Direction::Down => {
                    if curr_beam.pos.1 == 0 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0, curr_beam.pos.1 - 1),
                        dir: Direction::Left,
                    });
                }
                Direction::Left => {
                    if curr_beam.pos.0 == map.len() - 1 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0 + 1, curr_beam.pos.1),
                        dir: Direction::Down,
                    });
                }
                Direction::Right => {
                    if curr_beam.pos.0 == 0 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0 - 1, curr_beam.pos.1),
                        dir: Direction::Up,
                    });
                }
            },
            '\\' => match curr_beam.dir {
                Direction::Up => {
                    if curr_beam.pos.1 == 0 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0, curr_beam.pos.1 - 1),
                        dir: Direction::Left,
                    });
                }
                Direction::Down => {
                    if curr_beam.pos.1 == map[0].len() - 1 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0, curr_beam.pos.1 + 1),
                        dir: Direction::Right,
                    });
                }
                Direction::Left => {
                    if curr_beam.pos.0 == 0 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0 - 1, curr_beam.pos.1),
                        dir: Direction::Up,
                    });
                }
                Direction::Right => {
                    if curr_beam.pos.0 == map.len() - 1 {
                        continue;
                    }
                    to_explore.push(Beam {
                        pos: (curr_beam.pos.0 + 1, curr_beam.pos.1),
                        dir: Direction::Down,
                    });
                }
            },
            _ => panic!("Invalid tile {}", curr_tile),
        }
    }

    visited.len()
}

fn get_max_energy_on_map(map: &Vec<Vec<char>>) -> usize {
    let mut max_energy = 0;

    // top row, towards bottom
    for i in 0..map[0].len() {
        let energy = get_amount_energized_from_pos(
            Beam {
                pos: (0, i),
                dir: Direction::Down,
            },
            map,
        );
        max_energy = max_energy.max(energy);
    }

    // left column, towards right
    for i in 0..map.len() {
        let energy = get_amount_energized_from_pos(
            Beam {
                pos: (i, 0),
                dir: Direction::Right,
            },
            map,
        );
        max_energy = max_energy.max(energy);
    }

    // bottom row, towards top
    for i in 0..map[0].len() {
        let energy = get_amount_energized_from_pos(
            Beam {
                pos: (map.len() - 1, i),
                dir: Direction::Up,
            },
            map,
        );
        max_energy = max_energy.max(energy);
    }

    // right column, towards left
    for i in 0..map.len() {
        let energy = get_amount_energized_from_pos(
            Beam {
                pos: (i, map[0].len() - 1),
                dir: Direction::Left,
            },
            map,
        );
        max_energy = max_energy.max(energy);
    }

    max_energy
}

pub fn solve(input: &str) -> String {
    let lines: Vec<Vec<_>> = input.lines().map(|line| line.chars().collect()).collect();

    get_max_energy_on_map(&lines).to_string()
}
