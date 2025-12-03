import gleam/io
import day01/part1 as d1p1
import day01/part2 as d1p2
import day02/part1 as d2p1
import day02/part2 as d2p2
import day03/part1 as d3p1
import day03/part2 as d3p2

pub fn main() -> Nil {
  d1p1.solve() |> io.println
  d1p2.solve() |> io.println
  d2p1.solve() |> io.println
  d2p2.solve() |> io.println
  d3p1.solve() |> io.println
  d3p2.solve() |> io.println
}
