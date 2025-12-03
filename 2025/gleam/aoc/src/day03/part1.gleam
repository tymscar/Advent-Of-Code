import gleam/int
import gleam/list
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day03/input.txt"

fn get_biggest_colinear(bank: String) -> Int {
  let batteries =
    bank
    |> string.split("")
    |> list.map(fn(battery) { battery |> int.parse |> result.unwrap(0) })

  let biggest_battery_tens =
    batteries
    |> list.take(list.length(batteries) - 1)
    |> list.index_fold(#(-1, -1), fn(acc, curr_battery, index) {
      case curr_battery > acc.0 {
        True -> #(curr_battery, index)
        False -> acc
      }
    })

  let biggest_battery_units =
    batteries
    |> list.drop(biggest_battery_tens.1 + 1)
    |> list.max(int.compare)
    |> result.unwrap(0)

  biggest_battery_tens.0 * 10 + biggest_battery_units
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.map(get_biggest_colinear)
  |> int.sum
  |> int.to_string
}
