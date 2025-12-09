import bigi.{type BigInt}
import gleam/list
import gleam/pair
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day09/input.txt"

type Position {
  Position(x: BigInt, y: BigInt)
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.map(fn(line) {
    let assert [x, y] = line |> string.split(",")
    Position(
      x: bigi.from_string(x) |> result.unwrap(bigi.from_int(0)),
      y: bigi.from_string(y) |> result.unwrap(bigi.from_int(0)),
    )
  })
  |> list.combination_pairs()
  |> list.map(fn(pair) {
    let width =
      bigi.add(
        bigi.from_int(1),
        bigi.absolute(bigi.subtract(pair.first(pair).x, pair.second(pair).x)),
      )
    let height =
      bigi.add(
        bigi.from_int(1),
        bigi.absolute(bigi.subtract(pair.first(pair).y, pair.second(pair).y)),
      )
    bigi.multiply(width, height)
  })
  |> list.sort(bigi.compare)
  |> list.last()
  |> result.unwrap(bigi.from_int(0))
  |> bigi.to_string()
}
