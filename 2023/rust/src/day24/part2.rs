use z3::ast::{Ast, Int};
use z3::{Config, Context, Solver};

struct Vec3 {
    x: i64,
    y: i64,
    z: i64,
}

struct Hailstone {
    pos: Vec3,
    vel: Vec3,
}

impl Hailstone {
    fn new(px: i64, py: i64, pz: i64, vx: i64, vy: i64, vz: i64) -> Hailstone {
        Hailstone {
            pos: Vec3 {
                x: px,
                y: py,
                z: pz,
            },
            vel: Vec3 {
                x: vx,
                y: vy,
                z: vz,
            },
        }
    }
}

fn get_hailstones(input: &str) -> Vec<Hailstone> {
    input
        .lines()
        .map(|line| {
            let line = line.split('@').collect::<Vec<&str>>();
            let pos: Vec<i64> = line[0]
                .split(',')
                .map(|p| p.trim().parse().unwrap())
                .collect();
            let vel: Vec<i64> = line[1]
                .split(',')
                .map(|v| v.trim().parse().unwrap())
                .collect();
            Hailstone::new(pos[0], pos[1], pos[2], vel[0], vel[1], vel[2])
        })
        .collect()
}

// Z3 logic from arthomnix's part2: https://github.com/arthomnix/aoc23/blob/master/src/days/day24.rs
pub fn solve(input: &str) -> String {
    let hailstones: Vec<Hailstone> = get_hailstones(input);

    let cfg = Config::new();
    let ctx = Context::new(&cfg);
    let solver = Solver::new(&ctx);

    let px = Int::new_const(&ctx, "px");
    let py = Int::new_const(&ctx, "py");
    let pz = Int::new_const(&ctx, "pz");
    let vx = Int::new_const(&ctx, "vx");
    let vy = Int::new_const(&ctx, "vy");
    let vz = Int::new_const(&ctx, "vz");

    for hailstone in hailstones {
        let pxn = Int::from_i64(&ctx, hailstone.pos.x);
        let pyn = Int::from_i64(&ctx, hailstone.pos.y);
        let pzn = Int::from_i64(&ctx, hailstone.pos.z);
        let vxn = Int::from_i64(&ctx, hailstone.vel.x);
        let vyn = Int::from_i64(&ctx, hailstone.vel.y);
        let vzn = Int::from_i64(&ctx, hailstone.vel.z);
        let tn = Int::fresh_const(&ctx, "t");

        solver.assert(&(&pxn + &vxn * &tn)._eq(&(&px + &vx * &tn)));
        solver.assert(&(&pyn + &vyn * &tn)._eq(&(&py + &vy * &tn)));
        solver.assert(&(&pzn + &vzn * &tn)._eq(&(&pz + &vz * &tn)));
    }

    solver.check();
    let model = solver.get_model().unwrap();
    let x = model.get_const_interp(&px).unwrap().as_i64().unwrap();
    let y = model.get_const_interp(&py).unwrap().as_i64().unwrap();
    let z = model.get_const_interp(&pz).unwrap().as_i64().unwrap();

    (x + y + z).to_string()
}
