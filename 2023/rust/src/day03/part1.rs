use std::collections::HashMap;

#[derive(Eq, Hash, PartialEq, Debug)]
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
                    if curr.len() > 0 {
                        schematic.insert(Pos(i, j - curr.len()), curr.clone());
                        curr.clear();
                    }
                    if character != '.' {
                        schematic.insert(Pos(i, j), character.to_string());
                    }
                }
            }
        }
        if curr.len() > 0 {
            schematic.insert(Pos(i, line.len() - curr.len()), curr.clone());
            curr.clear();
        }
    }

    schematic
}

fn is_pos_next_to_symbol(schematic: &HashMap<Pos, String>, pos: &Pos) -> bool {
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

    for pos in neighbouring_positions {
        match schematic.get(&pos) {
            Some(neighbour) => {
                if !neighbour.chars().nth(0).unwrap().is_numeric() {
                    return true;
                }
            }
            None => continue,
        }
    }

    false
}

fn has_symbol_neighbour(schematic: &HashMap<Pos, String>, pos: &Pos) -> bool {
    let curr = schematic.get(pos).unwrap();
    for (i, _) in curr.chars().enumerate() {
        if is_pos_next_to_symbol(schematic, &Pos(pos.0, pos.1 + i)) {
            return true;
        }
    }

    false
}

pub fn part1(input: &str) -> String {
    let schematic = get_schematic(input);

    let part_numbers: Vec<usize> = schematic
        .iter()
        .filter(|curr| {
            let (pos, symbol) = curr;
            if symbol.chars().nth(0).unwrap().is_numeric() {
                return has_symbol_neighbour(&schematic, pos);
            }
            false
        })
        .map(|(_, symbol)| symbol.clone().parse().unwrap())
        .collect();

    part_numbers.iter().sum::<usize>().to_string()
}
