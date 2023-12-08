use std::collections::HashMap;

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.lines().collect();
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

    let mut steps: usize = 0;
    let mut curr_place: String = "AAA".to_string();
    while curr_place != "ZZZ" {
        let curr_instruction = instr.next().unwrap();

        curr_place = places[&curr_place][curr_instruction].to_owned();
        steps += 1;
    }

    steps.to_string()
}
