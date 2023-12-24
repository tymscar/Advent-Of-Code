// Code inspired by HyperNeutrino's video: https://www.youtube.com/watch?v=guOyA7Ijqgk

struct Vec2 {
    x: f64,
    y: f64,
}

struct Hailstone {
    pos: Vec2,
    vel: Vec2,
    a: f64,
    b: f64,
    c: f64,
}

impl Hailstone {
    fn new(px: f64, py: f64, vx: f64, vy: f64) -> Hailstone {
        Hailstone {
            pos: Vec2 { x: px, y: py },
            vel: Vec2 { x: vx, y: vy },
            a: vy,
            b: -vx,
            c: (vy * px - vx * py),
        }
    }

    fn is_parallel(&self, other: &Hailstone) -> bool {
        self.a * other.b == self.b * other.a
    }

    fn get_2d_intersection_with(&self, other: &Hailstone) -> Option<Vec2> {
        if self.is_parallel(other) {
            return None;
        }

        let x = (other.b * self.c - self.b * other.c) / (self.a * other.b - self.b * other.a);
        let y = (self.a * other.c - other.a * self.c) / (self.a * other.b - other.a * self.b);

        let intersects_in_future = (x - self.pos.x < 0.0) == (self.vel.x < 0.0)
            && (y - self.pos.y < 0.0) == (self.vel.y < 0.0)
            && (x - other.pos.x < 0.0) == (other.vel.x < 0.0)
            && (y - other.pos.y < 0.0) == (other.vel.y < 0.0);

        match intersects_in_future {
            true => Some(Vec2 { x, y }),
            false => None,
        }
    }
}

fn get_hailstones(input: &str) -> Vec<Hailstone> {
    input
        .lines()
        .map(|line| {
            let line = line.split('@').collect::<Vec<&str>>();
            let pos: Vec<f64> = line[0]
                .split(',')
                .map(|p| p.trim().parse().unwrap())
                .collect();
            let vel: Vec<f64> = line[1]
                .split(',')
                .map(|v| v.trim().parse().unwrap())
                .collect();
            Hailstone::new(pos[0], pos[1], vel[0], vel[1])
        })
        .collect()
}

pub fn solve(input: &str) -> String {
    let hailstones: Vec<Hailstone> = get_hailstones(input);

    let area = (200000000000000.0, 400000000000000.0);
    let mut intersections_in_area: Vec<Vec2> = vec![];

    for (i, hailstone1) in hailstones.iter().enumerate() {
        for hailstone2 in hailstones.iter().skip(i + 1) {
            if let Some(intersection) = hailstone1.get_2d_intersection_with(hailstone2) {
                if intersection.x >= area.0
                    && intersection.x <= area.1
                    && intersection.y >= area.0
                    && intersection.y <= area.1
                {
                    intersections_in_area.push(intersection);
                }
            }
        }
    }

    intersections_in_area.len().to_string()
}
