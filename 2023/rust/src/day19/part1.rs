use std::collections::HashMap;

#[derive(Clone, Copy)]
enum RuleKind {
    LessThan,
    GreaterThan,
    Default,
}

#[derive(Clone, Copy)]
enum Category {
    Cool,
    Musical,
    Aerodynamic,
    Shiny,
}

#[derive(Clone)]
struct Rule {
    kind: RuleKind,
    subject: Category,
    benchmark: usize,
    destination: String,
}

struct Workflow {
    rules: Vec<Rule>,
}

struct Rating {
    x: usize,
    m: usize,
    a: usize,
    s: usize,
    total: usize,
}

impl Rating {
    fn is_accepted(&self, workflows: &HashMap<String, Workflow>) -> bool {
        let mut curr_workflow = workflows.get("in").unwrap();
        loop {
            let mut destination: String = "R".to_string();
            for rule in &curr_workflow.rules {
                match rule.subject {
                    Category::Cool => match rule.kind {
                        RuleKind::LessThan => {
                            if self.x < rule.benchmark {
                                destination = rule.destination.clone();
                                break;
                            }
                        }
                        RuleKind::GreaterThan => {
                            if self.x > rule.benchmark {
                                destination = rule.destination.clone();
                                break;
                            }
                        }
                        RuleKind::Default => {
                            destination = rule.destination.clone();
                        }
                    },

                    Category::Musical => match rule.kind {
                        RuleKind::LessThan => {
                            if self.m < rule.benchmark {
                                destination = rule.destination.clone();
                                break;
                            }
                        }
                        RuleKind::GreaterThan => {
                            if self.m > rule.benchmark {
                                destination = rule.destination.clone();
                                break;
                            }
                        }
                        RuleKind::Default => {
                            destination = rule.destination.clone();
                        }
                    },
                    Category::Aerodynamic => match rule.kind {
                        RuleKind::LessThan => {
                            if self.a < rule.benchmark {
                                destination = rule.destination.clone();
                                break;
                            }
                        }
                        RuleKind::GreaterThan => {
                            if self.a > rule.benchmark {
                                destination = rule.destination.clone();
                                break;
                            }
                        }
                        RuleKind::Default => {
                            destination = rule.destination.clone();
                        }
                    },
                    Category::Shiny => match rule.kind {
                        RuleKind::LessThan => {
                            if self.s < rule.benchmark {
                                destination = rule.destination.clone();
                                break;
                            }
                        }
                        RuleKind::GreaterThan => {
                            if self.s > rule.benchmark {
                                destination = rule.destination.clone();
                                break;
                            }
                        }
                        RuleKind::Default => {
                            destination = rule.destination.clone();
                        }
                    },
                }
            }
            match destination.chars().next().unwrap() {
                'A' => return true,
                'R' => return false,
                _ => {
                    curr_workflow = workflows.get(&destination).unwrap();
                }
            }
        }
    }
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

    let ratings: Vec<Rating> = lines[1]
        .lines()
        .map(|line| {
            let line = line[1..line.len() - 1].split(',').collect::<Vec<_>>();
            let x = line[0][2..].parse().unwrap();
            let m = line[1][2..].parse().unwrap();
            let a = line[2][2..].parse().unwrap();
            let s = line[3][2..].parse().unwrap();
            let total = x + m + a + s;
            Rating { x, m, a, s, total }
        })
        .collect();

    ratings
        .iter()
        .filter_map(|rating| {
            if rating.is_accepted(&workflows) {
                Some(rating.total)
            } else {
                None
            }
        })
        .sum::<usize>()
        .to_string()
}
