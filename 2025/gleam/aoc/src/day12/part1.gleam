import gleam/dict
import gleam/int
import gleam/list
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day12/input.txt"

pub fn solve() -> String {
  let input =
    input_path
    |> simplifile.read()
    |> result.unwrap("")
    |> string.split("\n\n")

  let shapes =
    input
    |> list.take(list.length(input) - 1)
    |> list.map(fn(val) {
      let id =
        val
        |> string.first()
        |> result.unwrap("0")
        |> int.parse()
        |> result.unwrap(0)
      let area =
        val
        |> string.split("")
        |> list.count(fn(char) { char == "#" })

      #(id, area)
    })
    |> dict.from_list()

  input
  |> list.last()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.filter(fn(region) {
    let assert [w, h] =
      region
      |> string.split(": ")
      |> list.first()
      |> result.unwrap("0x0")
      |> string.split("x")
      |> list.map(fn(val) { val |> int.parse() |> result.unwrap(0) })

    let max_area = w * h

    let heuristic_area =
      region
      |> string.split(": ")
      |> list.last()
      |> result.unwrap("0 0 0 0 0")
      |> string.split(" ")
      |> list.map(fn(val) { int.parse(val) |> result.unwrap(0) })
      |> list.index_fold(0, fn(acc, curr, idx) {
        acc + { shapes |> dict.get(idx) |> result.unwrap(0) } * curr
      })

    heuristic_area <= max_area
  })
  |> list.length()
  |> int.to_string()
}
