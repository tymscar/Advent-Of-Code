use std::{collections::HashMap, usize};

#[derive(Debug, Clone, Copy)]
enum RuleKind {
    LessThan,
    GreaterThan,
    Default,
}

#[derive(Debug, Clone, Copy)]
enum Category {
    Cool,
    Musical,
    Aerodynamic,
    Shiny,
}

#[derive(Debug, Clone)]
struct Rule {
    kind: RuleKind,
    subject: Category,
    benchmark: usize,
    destination: String,
}

#[derive(Debug)]
struct Workflow {
    rules: Vec<Rule>,
}

#[derive(Debug, Clone, Copy)]
struct Range {
    x: (usize, usize),
    m: (usize, usize),
    a: (usize, usize),
    s: (usize, usize),
}

impl Range {
    fn get_combinations(&self) -> usize {
        (self.x.1 - self.x.0 + 1)
            * (self.m.1 - self.m.0 + 1)
            * (self.a.1 - self.a.0 + 1)
            * (self.s.1 - self.s.0 + 1)
    }
}

fn get_valid_ranges(
    curr_range: Range,
    curr_workflow_name: String,
    workflows: &HashMap<String, Workflow>,
) -> Vec<Range> {
    if curr_workflow_name == "A" {
        return vec![curr_range];
    }
    if curr_workflow_name == "R" {
        return vec![];
    }

    let mut valid_ranges: Vec<Range> = Vec::new();
    let mut curr_range = curr_range.clone();
    let curr_workflow = workflows.get(&curr_workflow_name).unwrap();

    for rule in &curr_workflow.rules {
        let destination = rule.destination.clone();
        match rule.subject {
            Category::Cool => match rule.kind {
                RuleKind::LessThan => {
                    if curr_range.x.1 < rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                    } else if curr_range.x.0 < rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(
                            Range {
                                x: (curr_range.x.0, rule.benchmark - 1),
                                m: curr_range.m,
                                a: curr_range.a,
                                s: curr_range.s,
                            },
                            destination,
                            workflows,
                        ));
                        curr_range.x.0 = rule.benchmark;
                    }
                }
                RuleKind::GreaterThan => {
                    if curr_range.x.0 > rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                    } else if curr_range.x.1 > rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(
                            Range {
                                x: (rule.benchmark + 1, curr_range.x.1),
                                m: curr_range.m,
                                a: curr_range.a,
                                s: curr_range.s,
                            },
                            destination,
                            workflows,
                        ));
                        curr_range.x.1 = rule.benchmark;
                    }
                }
                RuleKind::Default => {
                    valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                }
            },
            Category::Musical => match rule.kind {
                RuleKind::LessThan => {
                    if curr_range.m.1 < rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                    } else if curr_range.m.0 < rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(
                            Range {
                                x: curr_range.x,
                                m: (curr_range.m.0, rule.benchmark - 1),
                                a: curr_range.a,
                                s: curr_range.s,
                            },
                            destination,
                            workflows,
                        ));
                        curr_range.m.0 = rule.benchmark;
                    }
                }
                RuleKind::GreaterThan => {
                    if curr_range.m.0 > rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                    } else if curr_range.m.1 > rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(
                            Range {
                                x: curr_range.x,
                                m: (rule.benchmark + 1, curr_range.m.1),
                                a: curr_range.a,
                                s: curr_range.s,
                            },
                            destination,
                            workflows,
                        ));
                        curr_range.m.1 = rule.benchmark;
                    }
                }
                RuleKind::Default => {
                    valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                }
            },
            Category::Aerodynamic => match rule.kind {
                RuleKind::LessThan => {
                    if curr_range.a.1 < rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                    } else if curr_range.a.0 < rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(
                            Range {
                                x: curr_range.x,
                                m: curr_range.m,
                                a: (curr_range.a.0, rule.benchmark - 1),
                                s: curr_range.s,
                            },
                            destination,
                            workflows,
                        ));
                        curr_range.a.0 = rule.benchmark;
                    }
                }
                RuleKind::GreaterThan => {
                    if curr_range.a.0 > rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                    } else if curr_range.a.1 > rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(
                            Range {
                                x: curr_range.x,
                                m: curr_range.m,
                                a: (rule.benchmark + 1, curr_range.a.1),
                                s: curr_range.s,
                            },
                            destination,
                            workflows,
                        ));
                        curr_range.a.1 = rule.benchmark;
                    }
                }
                RuleKind::Default => {
                    valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                }
            },
            Category::Shiny => match rule.kind {
                RuleKind::LessThan => {
                    if curr_range.s.1 < rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                    } else if curr_range.s.0 < rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(
                            Range {
                                x: curr_range.x,
                                m: curr_range.m,
                                a: curr_range.a,
                                s: (curr_range.s.0, rule.benchmark - 1),
                            },
                            destination,
                            workflows,
                        ));
                        curr_range.s.0 = rule.benchmark;
                    }
                }
                RuleKind::GreaterThan => {
                    if curr_range.s.0 > rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                    } else if curr_range.s.1 > rule.benchmark {
                        valid_ranges.extend(get_valid_ranges(
                            Range {
                                x: curr_range.x,
                                m: curr_range.m,
                                a: curr_range.a,
                                s: (rule.benchmark + 1, curr_range.s.1),
                            },
                            destination,
                            workflows,
                        ));
                        curr_range.s.1 = rule.benchmark;
                    }
                }
                RuleKind::Default => {
                    valid_ranges.extend(get_valid_ranges(curr_range, destination, workflows))
                }
            },
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
                        let subject: Category = match rule[0].chars().next().unwrap() {
                            'x' => Category::Cool,
                            'm' => Category::Musical,
                            'a' => Category::Aerodynamic,
                            's' => Category::Shiny,
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
                        subject: Category::Cool,
                        benchmark: 0,
                        destination: rule.to_string(),
                    },
                })
                .collect();
            (name.to_string(), Workflow { rules })
        })
        .collect();

    get_valid_ranges(
        Range {
            x: (1, 4000),
            m: (1, 4000),
            a: (1, 4000),
            s: (1, 4000),
        },
        "in".to_string(),
        &workflows,
    )
    .into_iter()
    .map(|range| range.get_combinations())
    .sum::<usize>()
    .to_string()
}
