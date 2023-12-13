type ReflectionPos = (Option<usize>, Option<usize>);

fn get_reflection_pos_after_smudge(pattern: &[Vec<char>]) -> ReflectionPos {
    let mut pattern = pattern.to_vec();
    let original_reflection = find_reflection_positions(pattern.as_slice())[0];

    for y in 0..pattern.len() {
        for x in 0..pattern[0].len() {
            let old_char = pattern[y][x];
            let new_char = if old_char == '#' { '.' } else { '#' };
            pattern[y][x] = new_char;
            let reflection_pos = find_reflection_positions(pattern.as_slice());
            for pos in reflection_pos {
                if pos != (None, None) && pos != original_reflection {
                    return pos;
                }
            }
            pattern[y][x] = old_char;
        }
    }

    (None, None)
}

fn find_reflection_positions(pattern: &[Vec<char>]) -> Vec<ReflectionPos> {
    let mut positions = Vec::new();
    for y_ref_start in 0..pattern.len() - 1 {
        let mut all_equal = true;
        for x in 0..pattern[0].len() {
            let mut mirror_offset = 0;
            while mirror_offset + 1 + y_ref_start < pattern.len() && y_ref_start >= mirror_offset {
                if pattern[y_ref_start - mirror_offset][x]
                    != pattern[y_ref_start + 1 + mirror_offset][x]
                {
                    all_equal = false;
                    break;
                }
                mirror_offset += 1;
            }
        }
        if all_equal {
            positions.push((Some(y_ref_start + 1), None));
        }
    }

    for x_ref_start in 0..pattern[0].len() - 1 {
        let mut all_equal = true;
        for y in 0..pattern.len() {
            let mut mirror_offset = 0;
            while mirror_offset + 1 + x_ref_start < pattern[0].len() && x_ref_start >= mirror_offset
            {
                if pattern[y][x_ref_start - mirror_offset]
                    != pattern[y][mirror_offset + 1 + x_ref_start]
                {
                    all_equal = false;
                    break;
                }
                mirror_offset += 1;
            }
        }
        if all_equal {
            positions.push((None, Some(x_ref_start + 1)));
        }
    }

    positions
}

pub fn solve(input: &str) -> String {
    let patterns: Vec<Vec<Vec<_>>> = input
        .split("\n\n")
        .map(|pattern| {
            pattern
                .split('\n')
                .map(|line| line.chars().collect())
                .collect::<Vec<_>>()
        })
        .collect();

    let mut total = (0, 0);

    for pattern in patterns.iter() {
        let reflection_pos = get_reflection_pos_after_smudge(pattern.as_slice());
        if let Some(y_ref_start) = reflection_pos.0 {
            total.0 += y_ref_start;
        }
        if let Some(x_ref_start) = reflection_pos.1 {
            total.1 += x_ref_start;
        }
    }

    let answer = total.0 * 100 + total.1;

    answer.to_string()
}
