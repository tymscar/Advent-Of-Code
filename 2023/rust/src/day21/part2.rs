use std::collections::HashSet;

fn count_positions(map: &Vec<Vec<char>>, start: (usize, usize), steps: usize) -> usize {
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
    positions.len()
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

    let map_size = map.len();
    let grid_size = 26501365 / map_size - 1;

    let even_maps_in_grid = ((grid_size + 1) / 2 * 2).pow(2);
    let odd_maps_in_grid = (grid_size / 2 * 2 + 1).pow(2);

    let odd_points_in_map = count_positions(&map, starting_point, map_size * 2 + 1);
    let even_points_in_map = count_positions(&map, starting_point, map_size * 2);

    let total_points_fully_in_grid =
        odd_points_in_map * odd_maps_in_grid + even_points_in_map * even_maps_in_grid;

    let corner_top = count_positions(&map, (map_size - 1, starting_point.1), map_size - 1);
    let corner_right = count_positions(&map, (starting_point.0, 0), map_size - 1);
    let corner_bottom = count_positions(&map, (0, starting_point.1), map_size - 1);
    let corner_left = count_positions(&map, (starting_point.0, map_size - 1), map_size - 1);

    let total_points_in_grid_corners = corner_top + corner_right + corner_bottom + corner_left;

    let small_diag_top_right = count_positions(&map, (map_size - 1, 0), map_size / 2 - 1);
    let small_diag_bottom_right = count_positions(&map, (0, 0), map_size / 2 - 1);
    let small_diag_bottom_left = count_positions(&map, (0, map_size - 1), map_size / 2 - 1);
    let small_diag_top_left = count_positions(&map, (map_size - 1, map_size - 1), map_size / 2 - 1);

    let total_points_in_small_diags = (grid_size + 1)
        * (small_diag_top_right
            + small_diag_bottom_right
            + small_diag_bottom_left
            + small_diag_top_left);

    let big_diag_top_right = count_positions(&map, (map_size - 1, 0), map_size * 3 / 2 - 1);
    let big_diag_bottom_right = count_positions(&map, (0, 0), map_size * 3 / 2 - 1);
    let big_diag_bottom_left = count_positions(&map, (0, map_size - 1), map_size * 3 / 2 - 1);
    let big_diag_top_left =
        count_positions(&map, (map_size - 1, map_size - 1), map_size * 3 / 2 - 1);

    let total_points_in_big_diags = grid_size
        * (big_diag_top_right + big_diag_bottom_right + big_diag_bottom_left + big_diag_top_left);

    let total_points_in_diag = total_points_in_small_diags + total_points_in_big_diags;

    (total_points_fully_in_grid + total_points_in_grid_corners + total_points_in_diag).to_string()
}
