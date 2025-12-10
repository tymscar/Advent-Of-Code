import gleam/int
import gleam/list
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day10/input.txt"

fn lights_to_number(lights: String) -> Int {
  lights
  |> string.drop_start(1)
  |> string.drop_end(1)
  |> string.replace("#", "1")
  |> string.replace(".", "0")
  |> string.reverse()
  |> int.base_parse(2)
  |> result.unwrap(0)
}

fn schematics_to_numbers(schematics: List(String)) -> List(Int) {
  schematics
  |> list.map(fn(schematic) {
    schematic
    |> string.drop_start(1)
    |> string.drop_end(1)
    |> string.split(",")
    |> list.map(fn(button) {
      button
      |> int.parse()
      |> result.unwrap(0)
      |> int.bitwise_shift_left(1, _)
    })
    |> list.fold(0, fn(acc, curr) { acc |> int.bitwise_or(curr) })
  })
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.map(fn(line) {
    let assert [lights, ..rest] = line |> string.split(" ")
    let schematics =
      rest
      |> list.take({ rest |> list.length } - 1)
      |> schematics_to_numbers()
    let lights_value = lights |> lights_to_number()

    list.range(0, schematics |> list.length)
    |> list.fold_until(0, fn(_, curr) {
      case
        schematics
        |> list.combinations(curr)
        |> list.any(fn(combination) {
          {
            combination
            |> list.fold(0, fn(acc, comb) {
              int.bitwise_exclusive_or(acc, comb)
            })
          }
          == lights_value
        })
      {
        True -> list.Stop(curr)
        False -> list.Continue(curr)
      }
    })
  })
  |> int.sum()
  |> int.to_string()
}
