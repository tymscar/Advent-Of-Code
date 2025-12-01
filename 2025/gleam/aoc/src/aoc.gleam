import gleam/io
import day01/part1 as d1p1
import day01/part2 as d1p2

pub fn main() -> Nil {
  d1p1.solve() |> io.println
  d1p2.solve() |> io.println
}
