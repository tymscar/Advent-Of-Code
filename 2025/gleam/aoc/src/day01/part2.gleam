import gleam/int
import gleam/list
import gleam/pair
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day01/input.txt"

const starting_position = 50

type Turn {
  Left
  Right
}

type Instruction {
  Instruction(direction: Turn, count: Int)
}

fn parse_instruction(line: String) -> Instruction {
  let direction =
    line
    |> string.first
    |> result.unwrap("L")
    |> fn(c) {
      case c {
        "L" -> Left
        _ -> Right
      }
    }

  let count = line |> string.drop_start(1) |> int.parse |> result.unwrap(0)

  Instruction(direction, count)
}

fn count_clicks(position: Int, instruction: Instruction) -> Int {
  case instruction.direction {
    Left -> {
      let new_position = position - instruction.count
      case new_position < 0 {
        True -> {
          let compensation = case position > 0 {
            True -> 1
            False -> 0
          }
          { new_position / -100 } + compensation
        }
        False ->
          case new_position == 0 {
            True -> 1
            False -> 0
          }
      }
    }
    Right -> {
      { position + instruction.count } / 100
    }
  }
}

fn get_new_position(position: Int, instruction: Instruction) -> Int {
  let actual_moves = case instruction.direction {
    Left -> { -1 * instruction.count } % 100
    Right -> instruction.count % 100
  }

  { position + actual_moves + 100 } % 100
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.map(parse_instruction)
  |> list.fold(#(starting_position, 0), fn(acc, curr_instruction) {
    #(
      get_new_position(acc.0, curr_instruction),
      acc.1 + count_clicks(acc.0, curr_instruction),
    )
  })
  |> pair.second
  |> int.to_string
}
