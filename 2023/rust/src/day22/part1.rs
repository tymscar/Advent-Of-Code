use std::collections::HashMap;

type Vec3 = (usize, usize, usize);

struct Brick {
    id: usize,
    pos: Vec3,
    size: Vec3,
}

impl Brick {
    fn overlaps(&self, other: &Brick) -> bool {
        let horizontal_overlap =
            self.pos.0 < other.pos.0 + other.size.0 && self.pos.0 + self.size.0 > other.pos.0;

        let vertical_overlap =
            self.pos.1 < other.pos.1 + other.size.1 && self.pos.1 + self.size.1 > other.pos.1;

        horizontal_overlap && vertical_overlap
    }
}

fn get_bricks(input: &str) -> Vec<Brick> {
    input
        .lines()
        .enumerate()
        .map(|(id, line)| {
            let line: Vec<&str> = line.split('~').collect();
            let pos1: Vec<_> = line[0]
                .split(',')
                .map(|val| val.parse::<usize>().unwrap())
                .collect();
            let pos2: Vec<_> = line[1]
                .split(',')
                .map(|val| val.parse::<usize>().unwrap())
                .collect();

            Brick {
                id,
                pos: (pos1[0], pos1[1], pos1[2]),
                size: (
                    pos2[0] - pos1[0] + 1,
                    pos2[1] - pos1[1] + 1,
                    pos2[2] - pos1[2] + 1,
                ),
            }
        })
        .collect()
}

pub fn solve(input: &str) -> String {
    let mut to_process = get_bricks(input);
    to_process.sort_by(|b, a| a.pos.2.cmp(&b.pos.2));

    let mut supported_by: HashMap<usize, Vec<usize>> = HashMap::new();
    let mut supporting: HashMap<usize, Vec<usize>> = HashMap::new();
    for brick in &to_process {
        supporting.insert(brick.id, Vec::new());
    }

    let mut processed = Vec::new();
    let ground = Brick {
        id: usize::MAX,
        pos: (0, 0, 0),
        size: (usize::MAX, usize::MAX, 0),
    };
    processed.push(ground);

    while let Some(curr_brick) = to_process.pop() {
        let overlapping: Vec<&Brick> = processed
            .iter()
            .filter(|brick| brick.overlaps(&curr_brick))
            .collect();
        let highest_z: usize = overlapping
            .iter()
            .map(|brick| brick.pos.2 + brick.size.2)
            .max()
            .unwrap_or(0);
        let bricks_to_fall_onto: Vec<usize> = overlapping
            .iter()
            .filter_map(|brick| {
                if brick.pos.2 + brick.size.2 == highest_z {
                    Some(brick.id)
                } else {
                    None
                }
            })
            .collect();

        supported_by.insert(curr_brick.id, bricks_to_fall_onto.clone());
        for brick_id in bricks_to_fall_onto {
            supporting.entry(brick_id).or_default().push(curr_brick.id);
        }

        let new_curr_brick = Brick {
            id: curr_brick.id,
            pos: (curr_brick.pos.0, curr_brick.pos.1, highest_z),
            size: curr_brick.size,
        };
        processed.push(new_curr_brick);
    }

    let mut can_remove: Vec<usize> = Vec::new();

    for brick in processed.iter() {
        let supported_bricks = supporting.get(&brick.id).unwrap();

        if supported_bricks.is_empty() {
            can_remove.push(brick.id);
            continue;
        }

        let mut bricks_above_fine = 0;
        for top_brick in supported_bricks {
            if supported_by.get(top_brick).unwrap().len() > 1 {
                bricks_above_fine += 1;
            }
        }
        if bricks_above_fine == supported_bricks.len() {
            can_remove.push(brick.id);
        }
    }

    can_remove.len().to_string()
}
