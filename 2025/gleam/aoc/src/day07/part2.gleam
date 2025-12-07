import bigi
import gleam/dict
import gleam/list
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day07/input.txt"

pub fn solve() -> String {
  let input =
    input_path
    |> simplifile.read()
    |> result.unwrap("")
    |> string.split("\n")
    |> list.map(string.split(_, ""))
    |> list.filter(list.any(_, fn(char) { char != "." }))

  let starting_line =
    input
    |> list.take(1)
    |> list.flatten
    |> list.index_map(fn(char, index) {
      case char {
        "S" -> #(index, bigi.from_int(1))
        _ -> #(index, bigi.from_int(0))
      }
    })
    |> dict.from_list

  input
  |> list.drop(1)
  |> list.fold(starting_line, fn(acc, curr_line) {
    curr_line
    |> list.index_fold(acc, fn(curr_acc, curr_char, index) {
      case curr_char {
        "^" -> {
          let previous_middle =
            acc |> dict.get(index) |> result.unwrap(bigi.from_int(0))
          let new_left =
            bigi.add(
              {
                curr_acc
                |> dict.get(index - 1)
                |> result.unwrap(bigi.from_int(0))
              },
              previous_middle,
            )
          let new_middle = bigi.from_int(0)
          let new_right =
            bigi.add(
              {
                curr_acc
                |> dict.get(index + 1)
                |> result.unwrap(bigi.from_int(0))
              },
              previous_middle,
            )
          curr_acc
          |> dict.insert(index - 1, new_left)
          |> dict.insert(index, new_middle)
          |> dict.insert(index + 1, new_right)
        }
        _ -> curr_acc
      }
    })
  })
  |> dict.values
  |> bigi.sum
  |> bigi.to_string
}
