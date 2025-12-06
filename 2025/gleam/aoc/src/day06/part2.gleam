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
    |> list.reverse
    |> list.map(string.split(_, on: ""))
    |> list.transpose
    |> list.map(fn(num) {
      num
      |> string.join("")
      |> string.replace(" ", "")
      |> bigi.from_string
      |> result.unwrap(bigi.from_int(0))
    })

  case symbol {
    "+" -> numbers |> bigi.sum
    _ -> numbers |> bigi.product
  }
}

fn get_strides(input: List(String)) -> List(Int) {
  let instructions = input |> list.reverse |> list.first |> result.unwrap("")
  let strides =
    instructions
    |> string.split("")
    |> list.drop(1)
    |> list.fold(#([], 0), fn(acc, curr) {
      case curr {
        " " -> #(acc.0, acc.1 + 1)
        _ -> #(list.append(acc.0, [acc.1]), 0)
      }
    })

  list.append(strides.0, [strides.1 + 1])
}

fn pad_inputs(strides: List(Int), inputs: List(String)) -> List(List(String)) {
  inputs
  |> list.map(fn(input_line) {
    let #(chunked, _) =
      strides
      |> list.fold(#([], input_line), fn(acc, stride) {
        let chunk = string.slice(acc.1, 0, stride)
        let next = string.slice(acc.1, stride + 1, string.length(acc.1))
        #(list.append(acc.0, [chunk]), next)
      })

    chunked
    |> list.map(fn(chunk) {
      let first_char = chunk |> string.first |> result.unwrap("")
      case first_char {
        "+" -> string.replace(chunk, " ", "")
        "*" -> string.replace(chunk, " ", "")
        _ -> chunk
      }
    })
  })
}

pub fn solve() -> String {
  let input =
    input_path
    |> simplifile.read()
    |> result.unwrap("")
    |> string.split("\n")
    |> list.filter(fn(line) { line |> string.length != 0 })

  input
  |> get_strides
  |> pad_inputs(input)
  |> list.transpose
  |> list.map(fn(line) { line |> calculate_instruction })
  |> bigi.sum
  |> bigi.to_string
}
