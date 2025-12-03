import gleam/int
import gleam/list
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day03/input.txt"

fn get_biggest_array_of(from: List(String), size: Int) -> String {
  case size {
    0 -> ""
    _ -> {
      let biggest_current =
        from
        |> list.take(list.length(from) - size + 1)
        |> list.index_fold(#(-1, -1), fn(acc, curr_battery, index) {
          let curr_battery_value = curr_battery |> int.parse |> result.unwrap(0)
          case curr_battery_value > acc.0 {
            True -> #(curr_battery_value, index)
            False -> acc
          }
        })

      let next_list = from |> list.drop(biggest_current.1 + 1)

      biggest_current.0 |> int.to_string
      <> get_biggest_array_of(next_list, size - 1)
    }
  }
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.map(string.split(_, ""))
  |> list.map(fn(val) {
    val |> get_biggest_array_of(12) |> int.parse |> result.unwrap(0)
  })
  |> int.sum
  |> int.to_string
}
