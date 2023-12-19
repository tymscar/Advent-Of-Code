use std::{collections::HashMap, usize};

#[derive(Clone)]
enum RuleKind {
    LessThan,
    GreaterThan,
    Default,
}

#[derive(Clone)]
struct Rule {
    kind: RuleKind,
    subject: usize,
    benchmark: usize,
    destination: String,
}

struct Workflow {
    rules: Vec<Rule>,
}

type Range = [(usize, usize); 4];

fn get_combinations(range: Range) -> usize {
    range
        .iter()
        .fold(1, |acc, &(start, end)| acc * (end - start + 1))
}

fn get_valid_ranges(
    curr_range: Range,
    curr_workflow_name: String,
    workflows: &HashMap<String, Workflow>,
) -> Vec<Range> {
    match curr_workflow_name.as_str() {
        "A" => return vec![curr_range],
        "R" => return vec![],
        _ => (),
    }

    let mut valid_ranges: Vec<Range> = Vec::new();
    let mut curr_range = curr_range;
    let curr_workflow = workflows.get(&curr_workflow_name).unwrap();

    for rule in &curr_workflow.rules {
        let destination = rule.destination.clone();

        match rule.kind {
            RuleKind::LessThan => {
                if curr_range[rule.subject].1 < rule.benchmark {
                    valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                } else if curr_range[rule.subject].0 < rule.benchmark {
                    let mut new_range = curr_range;
                    new_range[rule.subject].1 = rule.benchmark - 1;
                    valid_ranges.extend(get_valid_ranges(new_range, destination, workflows));
                    curr_range[rule.subject].0 = rule.benchmark;
                }
            }
            RuleKind::GreaterThan => {
                if curr_range[rule.subject].0 > rule.benchmark {
                    valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                } else if curr_range[rule.subject].1 > rule.benchmark {
                    let mut new_range = curr_range;
                    new_range[rule.subject].0 = rule.benchmark + 1;
                    valid_ranges.extend(get_valid_ranges(new_range, destination, workflows));
                    curr_range[rule.subject].1 = rule.benchmark;
                }
            }
            RuleKind::Default => {
                valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
            }
        }
    }

    valid_ranges
}

pub fn solve(input: &str) -> String {
    let lines: Vec<_> = input.split("\n\n").collect();
    let workflows: HashMap<String, Workflow> = lines[0]
        .lines()
        .map(|line| {
            let line: Vec<_> = line.split('{').collect();
            let name = line[0].trim().to_string();
            let rules: Vec<Rule> = line[1][..line[1].len() - 1]
                .split(',')
                .map(|rule| match rule.find(':') {
                    Some(_) => {
                        let rule: Vec<_> = rule.split(':').collect();
                        let destination: String = rule[1].trim().to_string();
                        let kind: RuleKind = match rule[0].chars().nth(1).unwrap() {
                            '<' => RuleKind::LessThan,
                            '>' => RuleKind::GreaterThan,
                            _ => panic!("Invalid rule {}", rule[0]),
                        };
                        let subject: usize = match rule[0].chars().next().unwrap() {
                            'x' => 0,
                            'm' => 1,
                            'a' => 2,
                            's' => 3,
                            _ => panic!("Invalid rule {}", rule[0]),
                        };
                        let benchmark: usize = rule[0][2..].parse().unwrap();
                        Rule {
                            kind,
                            subject,
                            benchmark,
                            destination,
                        }
                    }
                    None => Rule {
                        kind: RuleKind::Default,
                        subject: 0,
                        benchmark: 0,
                        destination: rule.to_string(),
                    },
                })
                .collect();
            (name.to_string(), Workflow { rules })
        })
        .collect();

    get_valid_ranges(
        [(1, 4000), (1, 4000), (1, 4000), (1, 4000)],
        "in".to_string(),
        &workflows,
    )
    .into_iter()
    .map(get_combinations)
    .sum::<usize>()
    .to_string()
}
