use std::collections::{HashMap, VecDeque};

#[derive(PartialEq, Clone)]
enum ModuleType {
    Broadcast,
    FlipFlop,
    Conjunction,
}

struct Pulse {
    status: bool,
    origin: String,
    destination: String,
}

#[derive(Clone)]
struct Module {
    module_type: ModuleType,
    name: String,
    status: bool,
    inputs: HashMap<String, bool>,
    outputs: Vec<String>,
}

fn input_parser(input: &str) -> HashMap<String, Module> {
    let mut map: HashMap<String, Module> = input
        .lines()
        .map(|line| {
            let line = line.split(" -> ").collect::<Vec<&str>>();

            let outputs = line[1]
                .split(", ")
                .map(|s| s.to_owned())
                .collect::<Vec<String>>();

            let module_type = match line[0].chars().next().unwrap() {
                'b' => ModuleType::Broadcast,
                '%' => ModuleType::FlipFlop,
                '&' => ModuleType::Conjunction,
                _ => panic!("Unknown module type"),
            };

            let name = if module_type == ModuleType::Broadcast {
                line[0].to_owned()
            } else {
                line[0][1..].to_owned()
            };

            let module = Module {
                name: name.to_owned(),
                module_type,
                status: false,
                inputs: HashMap::new(),
                outputs,
            };

            (name, module)
        })
        .collect();

    for module in map.clone().values() {
        for output in &module.outputs {
            if let Some(output_module) = map.get_mut(output) {
                output_module.inputs.insert(module.name.to_owned(), false);
            }
        }
    }

    map
}

fn count_pulses(modules: &mut HashMap<String, Module>, button_presses: usize) -> (usize, usize) {
    let mut low_pulses = 0;
    let mut high_pulses = 0;

    for _ in 0..button_presses {
        let mut queue: VecDeque<Pulse> = VecDeque::new();
        queue.push_back(Pulse {
            status: false,
            origin: "button".to_string(),
            destination: "broadcaster".to_string(),
        });

        while let Some(curr_pulse) = queue.pop_front() {
            match curr_pulse.status {
                true => high_pulses += 1,
                false => low_pulses += 1,
            }

            if let Some(curr_module) = modules.get_mut(&curr_pulse.destination) {
                match curr_module.module_type {
                    ModuleType::Broadcast => {
                        for output in &curr_module.outputs {
                            queue.push_back(Pulse {
                                status: curr_pulse.status,
                                origin: curr_module.name.to_owned(),
                                destination: output.to_owned(),
                            });
                        }
                    }
                    ModuleType::FlipFlop => {
                        if !curr_pulse.status {
                            match curr_module.status {
                                false => {
                                    curr_module.status = true;
                                    for output in &curr_module.outputs {
                                        queue.push_back(Pulse {
                                            status: true,
                                            origin: curr_module.name.to_owned(),
                                            destination: output.to_owned(),
                                        });
                                    }
                                }
                                true => {
                                    curr_module.status = false;
                                    for output in &curr_module.outputs {
                                        queue.push_back(Pulse {
                                            status: false,
                                            origin: curr_module.name.to_owned(),
                                            destination: output.to_owned(),
                                        });
                                    }
                                }
                            }
                        }
                    }
                    ModuleType::Conjunction => {
                        *curr_module.inputs.entry(curr_pulse.origin).or_insert(false) =
                            curr_pulse.status;

                        match curr_module.inputs.values().all(|&x| x) {
                            true => {
                                for output in &curr_module.outputs {
                                    queue.push_back(Pulse {
                                        status: false,
                                        origin: curr_module.name.to_owned(),
                                        destination: output.to_owned(),
                                    });
                                }
                            }
                            false => {
                                for output in &curr_module.outputs {
                                    queue.push_back(Pulse {
                                        status: true,
                                        origin: curr_module.name.to_owned(),
                                        destination: output.to_owned(),
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    (low_pulses, high_pulses)
}

pub fn solve(input: &str) -> String {
    let mut modules: HashMap<String, Module> = input_parser(input);

    let pulses = count_pulses(&mut modules, 1_000);

    (pulses.0 * pulses.1).to_string()
}
