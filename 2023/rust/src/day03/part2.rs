use std::collections::HashMap;

#[derive(Eq, Hash, PartialEq, Debug, Clone)]
struct Pos(usize, usize);

fn get_schematic(input: &str) -> HashMap<Pos, String> {
    let lines: Vec<_> = input.split('\n').collect();
    let mut schematic: HashMap<Pos, String> = HashMap::new();

    for (i, line) in lines.iter().enumerate() {
        let mut curr = String::new();
        for (j, character) in line.chars().enumerate() {
            match character.is_numeric() {
                true => {
                    curr.push(character);
                }
                false => {
                    if !curr.is_empty() {
                        schematic.insert(Pos(i, j - curr.len()), curr.clone());
                        curr.clear();
                    }
                    if character != '.' {
                        schematic.insert(Pos(i, j), character.to_string());
                    }
                }
            }
        }
        if !curr.is_empty() {
            schematic.insert(Pos(i, line.len() - curr.len()), curr.clone());
            curr.clear();
        }
    }

    schematic
}

fn get_neighbouring_part_numbers(schematic: &HashMap<Pos, String>, pos: &Pos) -> Vec<usize> {
    let mut neighbouring_positions = vec![
        Pos(pos.0, pos.1 + 1),
        Pos(pos.0 + 1, pos.1),
        Pos(pos.0 + 1, pos.1 + 1),
    ];
    if pos.0 > 0 {
        neighbouring_positions.push(Pos(pos.0 - 1, pos.1));
        if pos.1 > 0 {
            neighbouring_positions.push(Pos(pos.0 - 1, pos.1 - 1));
            neighbouring_positions.push(Pos(pos.0 - 1, pos.1 + 1));
        }
    }
    if pos.1 > 0 {
        neighbouring_positions.push(Pos(pos.0, pos.1 - 1));
        neighbouring_positions.push(Pos(pos.0 + 1, pos.1 - 1));
    }

    let mut neighbours_added: Vec<Pos> = Vec::new();

    let mut part_numbers = Vec::new();
    for pos in neighbouring_positions {
        for (curr_pos, curr_symbol) in schematic {
            if curr_symbol.chars().next().unwrap().is_numeric() {
                for (i, _) in curr_symbol.chars().enumerate() {
                    if pos == Pos(curr_pos.0, curr_pos.1 + i)
                        && !neighbours_added.contains(curr_pos)
                    {
                        part_numbers.push(curr_symbol.clone().parse().unwrap());
                        neighbours_added.push(curr_pos.clone());
                        break;
                    }
                }
            }
        }
    }

    part_numbers
}

pub fn part2(input: &str) -> String {
    let schematic = get_schematic(input);

    let gear_ratios: Vec<usize> = schematic
        .iter()
        .filter_map(|curr| {
            let (pos, symbol) = curr;
            if symbol.starts_with('*') {
                let part_numbers = get_neighbouring_part_numbers(&schematic, pos);
                if part_numbers.len() >= 2 {
                    return Some(part_numbers.iter().product::<usize>());
                } else {
                    return None;
                }
            }
            None
        })
        .collect();

    gear_ratios.iter().sum::<usize>().to_string()
}
