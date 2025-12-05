import bigi.{type BigInt}
import gleam/list
import gleam/order
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

fn is_in_range(value: BigInt, range: Range) -> Bool {
  let cmp_start = bigi.compare(value, range.start)
  let cmp_end = bigi.compare(value, range.end)

  case cmp_start, cmp_end {
    order.Lt, _ -> False
    _, order.Gt -> False
    _, _ -> True
  }
}

fn is_range_inside_range(left: Range, right: Range) -> Bool {
  case is_in_range(right.start, left), is_in_range(right.end, left) {
    True, True -> True
    _, _ -> False
  }
}

fn count_values_in_range(range: Range) -> BigInt {
  bigi.add(bigi.subtract(range.end, range.start), bigi.from_int(1))
}

fn merge_ranges(input_ranges: List(Range)) -> List(Range) {
  let first_range =
    input_ranges
    |> list.first
    |> result.unwrap(Range(bigi.from_int(0), bigi.from_int(0)))
  let new_ranges =
    input_ranges
    |> list.fold(#([], first_range), fn(acc, next_range) {
      let #(new_ranges, current_range) = acc
      case is_range_inside_range(current_range, next_range) {
        True -> #(new_ranges, current_range)
        False ->
          case is_in_range(current_range.end, next_range) {
            True -> #(
              new_ranges,
              Range(start: current_range.start, end: next_range.end),
            )
            False -> #(new_ranges |> list.append([current_range]), next_range)
          }
      }
    })
  new_ranges.0 |> list.append([new_ranges.1])
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n\n")
  |> list.first
  |> result.unwrap("")
  |> parse_ranges
  |> list.sort(fn(first_range, second_range) {
    bigi.compare(first_range.start, second_range.start)
  })
  |> merge_ranges
  |> list.map(count_values_in_range)
  |> bigi.sum
  |> bigi.to_string
}
