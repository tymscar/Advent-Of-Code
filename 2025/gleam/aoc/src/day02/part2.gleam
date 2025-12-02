import gleam/int
import gleam/list
import gleam/regexp
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day02/input.txt"

type Range {
  Range(start: Int, end: Int)
}

fn get_invalid_id_in_range(range: Range) -> List(Int) {
  list.range(range.start, range.end)
  |> list.map(int.to_string)
  |> list.filter(fn(val) {
    list.range(1, string.length(val) / 2)
    |> list.map(fn(index) { string.slice(val, 0, index) })
    |> list.any(fn(substring) {
      let assert Ok(re) = regexp.from_string("^(" <> substring <> ")+$")
      regexp.check(re, val)
      && string.length(val) >= string.length(substring) * 2
    })
  })
  |> list.map(fn(val) { val |> int.parse |> result.unwrap(0) })
}

fn string_to_range(input: String) -> Range {
  let value =
    input |> string.split("-") |> list.try_map(int.parse) |> result.unwrap([])
  case value {
    [first, second, ..] -> Range(start: first, end: second)
    _ -> Range(start: 0, end: 0)
  }
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split(",")
  |> list.map(string_to_range)
  |> list.flat_map(get_invalid_id_in_range)
  |> int.sum
  |> int.to_string
}
