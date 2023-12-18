#[derive(Clone, Copy)]
struct Position {
    x: isize,
    y: isize,
}

enum Direction {
    Up,
    Down,
    Left,
    Right,
}

struct Instruction {
    direction: Direction,
    steps: usize,
}

fn shoelace_formula(points: &[Position], perimeter: isize) -> isize {
    let mut s1 = 0;
    let mut s2 = 0;
    for positions in points.windows(2) {
        s1 += positions[0].x * positions[1].y;
        s2 += positions[1].x * positions[0].y;
    }
    let area = (s1 - s2).abs() / 2;
    area - (perimeter / 2) + 1
}

pub fn solve(input: &str) -> String {
    let instructions: Vec<Instruction> = input
        .lines()
        .map(|line| {
            let line = line.split(' ').collect::<Vec<&str>>();
            Instruction {
                direction: match line[0] {
                    "U" => Direction::Up,
                    "D" => Direction::Down,
                    "L" => Direction::Left,
                    "R" => Direction::Right,
                    _ => panic!("Invalid direction"),
                },
                steps: line[1]
                    .parse::<usize>()
                    .expect("Second value should be a number of steps"),
            }
        })
        .collect();

    let mut curr_pos = Position { x: 0, y: 0 };
    let mut holes: Vec<Position> = vec![curr_pos];
    let mut perimeter: isize = 0;

    for instruction in instructions {
        perimeter += instruction.steps as isize;
        match instruction.direction {
            Direction::Up => {
                curr_pos.y -= instruction.steps as isize;
            }
            Direction::Down => {
                curr_pos.y += instruction.steps as isize;
            }
            Direction::Left => {
                curr_pos.x -= instruction.steps as isize;
            }
            Direction::Right => {
                curr_pos.x += instruction.steps as isize;
            }
        }
        holes.push(curr_pos);
    }

    (shoelace_formula(&holes, perimeter) + perimeter).to_string()
}
