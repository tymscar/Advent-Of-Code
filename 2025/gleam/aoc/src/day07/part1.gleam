import gleam/int
import gleam/list
import gleam/result
import gleam/set.{type Set}
import gleam/string
import simplifile

const input_path = "src/day07/input.txt"

type Object {
  Object(position: Position, kind: ObjectKind)
}

type ObjectKind {
  Empty
  Splitter
  Start
}

type Position {
  Position(y: Int, x: Int)
}

fn get_touched_splitters(
  splitters: List(Position),
  starting_postion: Position,
  max_depth: Int,
) -> Set(Position) {
  get_touched_splitters__helper(
    [starting_postion],
    splitters,
    max_depth,
    set.from_list([]),
  )
}

fn get_touched_splitters__helper(
  positions_to_check: List(Position),
  splitters: List(Position),
  max_depth: Int,
  acc: Set(Position),
) -> Set(Position) {
  case positions_to_check {
    [] -> acc
    [pos, ..rest] -> {
      case acc |> set.contains(pos) {
        True -> get_touched_splitters__helper(rest, splitters, max_depth, acc)
        False -> {
          let #(new_acc, new_positions_to_check) = case
            splitters |> list.contains(pos)
          {
            True -> #(
              acc |> set.insert(pos),
              rest
                |> list.append([
                  Position(x: pos.x + 1, y: pos.y),
                  Position(x: pos.x - 1, y: pos.y),
                ]),
            )
            False -> {
              let new_pos = Position(x: pos.x, y: pos.y + 1)
              case new_pos.y > max_depth {
                True -> #(acc, rest)
                False -> #(acc, rest |> list.append([new_pos]))
              }
            }
          }
          get_touched_splitters__helper(
            new_positions_to_check,
            splitters,
            max_depth,
            new_acc,
          )
        }
      }
    }
  }
}

pub fn solve() -> String {
  let #(starting_position, splitters) =
    input_path
    |> simplifile.read()
    |> result.unwrap("")
    |> string.split("\n")
    |> list.map(string.split(_, ""))
    |> list.index_map(fn(row, y) {
      row
      |> list.index_map(fn(object, x) {
        let position = Position(y, x)
        case object {
          "S" -> Object(position, Start)
          "^" -> Object(position, Splitter)
          _ -> Object(position, Empty)
        }
      })
    })
    |> list.flatten
    |> list.fold(#(Position(0, 0), []), fn(acc, current_object) {
      case current_object.kind {
        Start -> #(current_object.position, acc.1)
        Splitter -> #(acc.0, list.append(acc.1, [current_object.position]))
        Empty -> acc
      }
    })

  let max_depth =
    splitters
    |> list.fold(0, fn(max_depth, curr) { int.max(max_depth, curr.y) })

  splitters
  |> get_touched_splitters(starting_position, max_depth)
  |> set.size
  |> int.to_string
}
