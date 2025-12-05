import gleam/int
import gleam/order
import bigi.{type BigInt}
import gleam/list
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day05/input.txt"

type Range {
  Range(start: BigInt, end: BigInt)
}

fn parse_ranges(input: String) -> List(Range) {
  input
  |> string.split("\n")
  |> list.map(fn(range) {
    let assert [start, end] = string.split(range, "-")
    let start_of_range =
      start |> bigi.from_string |> result.unwrap(bigi.from_int(0))
    let end_of_range =
      end |> bigi.from_string |> result.unwrap(bigi.from_int(0))
    Range(start_of_range, end_of_range)
  })
}

fn parse_ingredients(input: String) -> List(BigInt) {
  input
  |> string.split("\n")
  |> list.map(fn(ingredient) {
    ingredient |> bigi.from_string |> result.unwrap(bigi.from_int(0))
  })
}

pub fn solve() -> String {
  let assert [ranges_input, ingredients_input] =
    input_path
    |> simplifile.read()
    |> result.unwrap("")
    |> string.split("\n\n")

  let ranges = ranges_input |> parse_ranges
  let ingredients = ingredients_input |> parse_ingredients

  let fresh_ingredients = ingredients |> list.filter(fn(ingredient){
    ranges |> list.any(fn(range){
      let cmp_start = bigi.compare(ingredient, range.start)
      let cmp_end = bigi.compare(ingredient, range.end)

      case cmp_start, cmp_end {
        order.Lt, _ -> False
        _, order.Gt -> False
        _, _ -> True
      }
    })
  })

 fresh_ingredients |> list.length |> int.to_string
}
