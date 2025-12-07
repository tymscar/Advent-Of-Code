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

fn get_touched_splitters_from(
  position: Position,
  splitters: List(Position),
  max_depth: Int,
) -> Set(Position) {
  case position.y > max_depth {
    True -> set.from_list([])
    False -> {
      case splitters |> list.contains(position) {
        True ->
          set.insert(
            set.union(
              get_touched_splitters_from(
                Position(position.y, position.x - 1),
                splitters,
                max_depth,
              ),
              get_touched_splitters_from(
                Position(position.y, position.x + 1),
                splitters,
                max_depth,
              ),
            ),
            position,
          )

        False ->
          get_touched_splitters_from(
            Position(position.y + 1, position.x),
            splitters,
            max_depth,
          )
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


  echo get_touched_splitters_from(starting_position, splitters, max_depth) |> set.size

  "WIP"
}
