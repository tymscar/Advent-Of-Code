use rand::Rng;
use std::collections::{HashMap, HashSet, VecDeque};

fn bfs_path(
    graph: &HashMap<String, HashSet<String>>,
    start: String,
    end: String,
    memo: &mut HashMap<(String, String), Vec<String>>,
) -> Vec<String> {
    if let Some(path) = memo.get(&(start.clone(), end.clone())) {
        return path.clone();
    }

    let mut queue = VecDeque::new();
    let mut visited = HashSet::new();
    let mut prev: HashMap<String, String> = HashMap::new();

    queue.push_back(start.to_string());
    visited.insert(start.to_string());

    while let Some(node) = queue.pop_front() {
        if node == end {
            let mut path = vec![];
            let mut current = end.clone();

            while let Some(prev_node) = prev.get(&current) {
                path.push(current.clone());
                current = prev_node.clone();
            }

            path.push(current.to_string());
            path.reverse();
            memo.insert((start.clone(), end.clone()), path.clone());
            memo.insert((end.clone(), start.clone()), path.clone());

            return path;
        }

        if let Some(neighbors) = graph.get(&node) {
            for neighbor in neighbors {
                if !visited.contains(neighbor) {
                    queue.push_back(neighbor.clone());
                    visited.insert(neighbor.clone());
                    prev.insert(neighbor.clone(), node.clone());
                }
            }
        }
    }

    vec![]
}

pub fn solve(input: &str) -> String {
    let mut graph: HashMap<String, HashSet<String>> = HashMap::new();

    input.lines().for_each(|line| {
        let line = line.split(": ").collect::<Vec<_>>();
        let key = line[0].to_string();
        let neighbours = line[1]
            .split_whitespace()
            .map(|x| x.to_string())
            .collect::<Vec<_>>();
        for neighbour in neighbours {
            graph
                .entry(key.clone())
                .or_default()
                .insert(neighbour.clone());
            graph.entry(neighbour).or_default().insert(key.clone());
        }
    });

    loop {
        let mut visited_edges: HashMap<(String, String), usize> = HashMap::new();
        let mut memo: HashMap<(String, String), Vec<String>> = HashMap::new();
        let mut rng = rand::thread_rng();

        for node1 in graph.keys() {
            for node2 in graph.keys() {
                if node1 == node2 || rng.gen::<f64>() < 0.99999 {
                    continue;
                }
                let path = bfs_path(&graph, node1.clone(), node2.clone(), &mut memo);
                for node in path.windows(2) {
                    if visited_edges.contains_key(&(node[0].clone(), node[1].clone())) {
                        visited_edges
                            .entry((node[0].clone(), node[1].clone()))
                            .and_modify(|x| *x += 1);
                    } else if visited_edges.contains_key(&(node[1].clone(), node[0].clone())) {
                        visited_edges
                            .entry((node[1].clone(), node[0].clone()))
                            .and_modify(|x| *x += 1);
                    } else {
                        visited_edges.insert((node[0].clone(), node[1].clone()), 1);
                    }
                }
            }
        }

        let mut visited_edges = visited_edges.into_iter().collect::<Vec<_>>();
        visited_edges.sort_by(|a, b| b.1.cmp(&a.1));

        let edges_to_remove: Vec<(String, String)> =
            visited_edges.into_iter().map(|e| e.0).take(3).collect();

        for edge in edges_to_remove {
            graph.entry(edge.0.clone()).and_modify(|x| {
                x.remove(&edge.1);
            });
            graph.entry(edge.1.clone()).and_modify(|x| {
                x.remove(&edge.0);
            });
        }

        let mut nodes_in_first_cluster = 0;
        let pin_node = graph.keys().next().unwrap().clone();
        let mut memo: HashMap<(String, String), Vec<String>> = HashMap::new();

        for node in graph.keys() {
            let path = bfs_path(&graph, node.clone(), pin_node.clone(), &mut memo);
            if !path.is_empty() {
                nodes_in_first_cluster += 1;
            }
        }

        let nodes_in_second_cluster = graph.keys().count() - nodes_in_first_cluster;

        let answer = nodes_in_first_cluster * nodes_in_second_cluster;
        if answer > 0 {
            return answer.to_string();
        }
    }
}
