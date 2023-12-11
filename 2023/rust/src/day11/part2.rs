type Distance = usize;

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

fn get_distances(map: &[Vec<char>], expansion_coefficient: usize) -> Vec<Distance> {
    let mut distances = vec![];
    let empty_columns = get_empty_columns(map);
    let empty_rows = get_empty_rows(map);
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

    for star1 in star_positions.iter() {
        for star2 in star_positions.iter() {
            let first_x = star1.1.min(star2.1);
            let first_y = star1.0.min(star2.0);
            let second_x = star1.1.max(star2.1);
            let second_y = star1.0.max(star2.0);

            let mut x_dist = 0;
            let mut y_dist = 0;

            for y in first_y..second_y {
                y_dist += 1;
                if empty_rows.contains(&y) {
                    y_dist += expansion_coefficient - 1;
                }
            }

            for x in first_x..second_x {
                x_dist += 1;
                if empty_columns.contains(&x) {
                    x_dist += expansion_coefficient - 1;
                }
            }

            let distance = x_dist + y_dist;
            distances.push(distance);
        }
    }

    distances
}

pub fn solve(input: &str) -> String {
    let map: Vec<_> = input
        .split('\n')
        .map(|l| l.chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();

    let distances = get_distances(&map, 1000000);

    let total_distance = distances.iter().sum::<usize>() / 2;

    total_distance.to_string()
}
