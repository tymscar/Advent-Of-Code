use std::{collections::HashMap, usize};

struct Lens {
    label: String,
    focal_length: usize,
}

fn get_hash_of(string: &str) -> usize {
    string
        .chars()
        .fold(0, |acc, c| ((acc + c as usize) * 17) % 256)
}

pub fn solve(input: &str) -> String {
    let input: Vec<_> = input.split(',').collect();
    let mut boxes: HashMap<usize, Vec<Lens>> = HashMap::new();

    for instruction in input {
        match instruction.chars().last().unwrap() {
            '-' => {
                let label = instruction[..instruction.len() - 1].to_string();
                if let Some(container) = boxes.get_mut(&get_hash_of(&label)) {
                    if let Some(index) = container.iter().position(|l| l.label == label) {
                        container.remove(index);
                    }
                }
            }
            '1'..='9' => {
                let label = instruction[..instruction.len() - 2].to_string();
                let focal_length = instruction[instruction.len() - 1..]
                    .parse::<usize>()
                    .unwrap();
                let new_lens = Lens {
                    label: label.clone(),
                    focal_length,
                };
                if let Some(container) = boxes.get_mut(&get_hash_of(&label)) {
                    if let Some(index) = container.iter().position(|l| l.label == label) {
                        container[index] = new_lens;
                    } else {
                        container.push(new_lens);
                    }
                } else {
                    let new_box: Vec<Lens> = vec![new_lens];
                    boxes.insert(get_hash_of(&label), new_box);
                }
            }
            _ => panic!("Invalid instruction"),
        }
    }

    boxes
        .iter()
        .map(|(box_num, container)| {
            container
                .iter()
                .enumerate()
                .map(|(index, lens)| (box_num + 1) * (index + 1) * lens.focal_length)
                .sum::<usize>()
        })
        .sum::<usize>()
        .to_string()
}
