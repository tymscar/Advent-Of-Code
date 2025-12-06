import bigi.{type BigInt}
import gleam/list
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day06/input.txt"

fn calculate_instruction(instruction: List(String)) -> BigInt {
  let assert [symbol, ..rest] = instruction |> list.reverse
  let numbers =
    rest
    |> list.map(fn(number) {
      number |> bigi.from_string |> result.unwrap(bigi.from_int(0))
    })

  case symbol {
    "+" -> numbers |> bigi.sum
    _ -> numbers |> bigi.product
  }
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.map(fn(line) {
    line
    |> string.split(" ")
    |> list.filter(fn(val) { val |> string.length != 0 })
  })
  |> list.transpose
  |> list.map(fn(line) { line |> calculate_instruction })
  |> bigi.sum
  |> bigi.to_string
}
