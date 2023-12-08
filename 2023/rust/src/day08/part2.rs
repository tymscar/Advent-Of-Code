use std::collections::HashMap;

struct Timing {
    first_z_pos: usize,
    cycle_len: usize,
    z_offset_from_cycle_start: usize,
}

fn lcm_of_list(numbers: &[usize]) -> usize {
    fn gcd(a: usize, b: usize) -> usize {
        if b == 0 {
            a
        } else {
            gcd(b, a % b)
        }
    }

    fn lcm(a: usize, b: usize) -> usize {
        a / gcd(a, b) * b
    }

    numbers.iter().cloned().fold(1, lcm)
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.lines().collect();

    let places: HashMap<String, [String; 2]> = lines
        .iter()
        .skip(2)
        .map(|line| {
            let line: Vec<_> = line.split(" = ").collect();
            let name = line[0].to_string();
            let dest: Vec<String> = line[1][1..]
                .split_terminator(&[')', ','][..])
                .map(|s| s.to_string())
                .collect();
            (name, [dest[0].to_owned(), dest[1].trim().to_owned()])
        })
        .collect();

    let starting_positions: Vec<String> = places
        .iter()
        .filter(|(v, _)| v.ends_with('A'))
        .map(|(k, _)| k.clone())
        .collect();

    let timings: Vec<Timing> = starting_positions
        .iter()
        .map(|pos| {
            let mut instr = lines
                .first()
                .unwrap()
                .chars()
                .map(|ins| match ins {
                    'L' => 0,
                    'R' => 1,
                    _ => panic!("Unknown instruction: {}", ins),
                })
                .cycle();
            let instr_len = lines.first().unwrap().len();

            let mut steps: usize = 0;
            let mut curr_place: String = pos.to_owned();
            while !curr_place.ends_with('Z') {
                let curr_instruction = instr.next().unwrap();
                curr_place = places[&curr_place][curr_instruction].to_owned();
                steps += 1;
            }
            let z_pos: usize = steps;
            let mut z_offset_from_cycle_start = usize::max_value();
            steps = 0;

            let mut visited: HashMap<(String, usize), bool> = HashMap::new();

            loop {
                if curr_place.ends_with('Z') && steps > 0 {
                    z_offset_from_cycle_start = z_offset_from_cycle_start.min(steps);
                }

                if visited.contains_key(&(curr_place.clone(), steps % instr_len)) {
                    break;
                }

                visited.insert((curr_place.clone(), steps % instr_len), true);
                let curr_instruction = instr.next().unwrap();
                curr_place = places[&curr_place][curr_instruction].to_owned();
                steps += 1;
            }

            Timing {
                first_z_pos: z_pos,
                cycle_len: steps,
                z_offset_from_cycle_start,
            }
        })
        .collect();

    let timings_lcm = lcm_of_list(&timings.iter().map(|t| t.cycle_len).collect::<Vec<_>>());

    let mut curr_time = 0;
    loop {
        let mut all_synced = true;
        for t in &timings {
            if (curr_time - t.first_z_pos - t.z_offset_from_cycle_start) % t.cycle_len != 0 {
                all_synced = false;
                break;
            }
        }
        if all_synced {
            break;
        }
        curr_time += timings_lcm;
    }

    curr_time.to_string()
}
