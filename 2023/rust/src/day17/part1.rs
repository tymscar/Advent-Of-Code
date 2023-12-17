use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

type Position = (usize, usize);

#[derive(Clone, Copy, Eq, Hash, PartialEq, Ord, PartialOrd)]
enum Direction {
    Up,
    Right,
    Down,
    Left,
}

#[derive(Clone, Copy, Eq, Hash, PartialEq, Ord, PartialOrd)]
struct State {
    position: Position,
    remaining_up: u8,
    remaining_right: u8,
    remaining_down: u8,
    remaining_left: u8,
    direction: Direction,
}

fn get_neighbouring_states(state: State, map: &Vec<Vec<usize>>) -> Vec<State> {
    let mut neighbours: Vec<State> = Vec::new();

    if state.remaining_up >= 1 && state.position.0 >= 1 && state.direction != Direction::Down {
        neighbours.push(State {
            position: (state.position.0 - 1, state.position.1),
            remaining_up: state.remaining_up - 1,
            remaining_right: 3,
            remaining_down: 3,
            remaining_left: 3,
            direction: Direction::Up,
        });
    }

    if state.remaining_right >= 1
        && state.position.1 < map[0].len() - 1
        && state.direction != Direction::Left
    {
        neighbours.push(State {
            position: (state.position.0, state.position.1 + 1),
            remaining_up: 3,
            remaining_right: state.remaining_right - 1,
            remaining_down: 3,
            remaining_left: 3,
            direction: Direction::Right,
        });
    }

    if state.remaining_down >= 1
        && state.position.0 < map.len() - 1
        && state.direction != Direction::Up
    {
        neighbours.push(State {
            position: (state.position.0 + 1, state.position.1),
            remaining_up: 3,
            remaining_right: 3,
            remaining_down: state.remaining_down - 1,
            remaining_left: 3,
            direction: Direction::Down,
        });
    }

    if state.remaining_left >= 1 && state.position.1 >= 1 && state.direction != Direction::Right {
        neighbours.push(State {
            position: (state.position.0, state.position.1 - 1),
            remaining_up: 3,
            remaining_right: 3,
            remaining_down: 3,
            remaining_left: state.remaining_left - 1,
            direction: Direction::Left,
        });
    }

    neighbours
}

fn get_cost(map: &Vec<Vec<usize>>, source: Position, destination: Position) -> usize {
    let mut costs: HashMap<State, usize> = HashMap::new();
    let mut heap: BinaryHeap<Reverse<(usize, State)>> = BinaryHeap::new();

    let start_state = State {
        position: source,
        remaining_up: 3,
        remaining_right: 3,
        remaining_down: 3,
        remaining_left: 3,
        direction: Direction::Right,
    };

    costs.insert(start_state, 0);
    heap.push(Reverse((0, start_state)));

    while let Some(Reverse((curr_cost, curr_state))) = heap.pop() {
        if curr_state.position == destination {
            return curr_cost;
        }

        if curr_cost > *costs.get(&curr_state).unwrap_or(&usize::MAX) {
            continue;
        }

        let neighbours = get_neighbouring_states(curr_state, map);

        for neighbour in neighbours {
            let next_pos = neighbour.position;
            let next_cost = curr_cost + map[next_pos.0][next_pos.1];
            if next_cost < *costs.get(&neighbour).unwrap_or(&usize::MAX) {
                heap.push(Reverse((next_cost, neighbour)));
                costs.insert(neighbour, next_cost);
            }
        }
    }

    usize::MAX
}

pub fn solve(input: &str) -> String {
    let lines: Vec<Vec<usize>> = input
        .split('\n')
        .map(|line| {
            line.chars()
                .map(|char| char.to_digit(10).unwrap() as usize)
                .collect()
        })
        .collect();

    let start = (0, 0);
    let end = (lines.len() - 1, lines[0].len() - 1);

    get_cost(&lines, start, end).to_string()
}
