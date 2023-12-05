pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.split("\n\n").collect();
    let seeds: Vec<_> = lines
        .first()
        .unwrap()
        .split(": ")
        .collect::<Vec<_>>()
        .iter()
        .last()
        .unwrap()
        .split(' ')
        .collect::<Vec<_>>()
        .iter()
        .map(|f| f.parse::<usize>().unwrap())
        .collect::<Vec<_>>();

    let translations = lines
        .iter()
        .skip(1)
        .map(|translation| {
            translation
                .split(":\n")
                .skip(1)
                .collect::<Vec<_>>()
                .iter()
                .flat_map(|f| f.split('\n').collect::<Vec<_>>())
                .map(|x| {
                    x.split(' ')
                        .collect::<Vec<_>>()
                        .iter()
                        .map(|f| f.parse::<usize>().unwrap())
                        .collect::<Vec<_>>()
                })
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();

    let locations = seeds
        .iter()
        .map(|seed| {
            translations
                .iter()
                .fold(*seed, |curr_id, curr_translation| {
                    let correct_translation = curr_translation.iter().find(|translation| {
                        translation[1] <= curr_id && curr_id <= translation[1] + translation[2]
                    });
                    match correct_translation {
                        Some(traslation) => {
                            let offset = curr_id - traslation[1];
                            traslation[0] + offset
                        }
                        None => curr_id,
                    }
                })
        })
        .collect::<Vec<_>>();

    locations.iter().min().unwrap().to_string()
}
