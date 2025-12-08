import gleam/float
import gleam/int
import gleam/list.{Continue, Stop}
import gleam/option.{type Option, None, Some}
import gleam/pair
import gleam/result
import gleam/set.{type Set}
import gleam/string
import simplifile

const input_path = "src/day08/input.txt"

type Position {
  Position(x: Int, y: Int, z: Int)
}

fn get_distance(from: Position, to: Position) -> Float {
  let dx = to.x - from.x
  let dy = to.y - from.y
  let dz = to.z - from.z

  int.square_root(dx * dx + dy * dy + dz * dz) |> result.unwrap(0.0)
}

fn find_and_remove(
  item: Position,
  groups: List(Set(Position)),
) -> #(Option(Set(Position)), List(Set(Position))) {
  case groups {
    [] -> #(None, [])
    [first, ..rest] -> {
      case set.contains(first, item) {
        True -> #(Some(first), rest)
        False -> {
          let #(found, remaining) = find_and_remove(item, rest)
          #(found, [first, ..remaining])
        }
      }
    }
  }
}

pub fn solve() -> String {
  let boxes =
    input_path
    |> simplifile.read()
    |> result.unwrap("")
    |> string.split("\n")
    |> list.map(fn(str) {
      let assert [x, y, z] =
        str
        |> string.split(",")
        |> list.map(int.parse)
        |> list.map(result.unwrap(_, 0))
      Position(x, y, z)
    })

  boxes
  |> list.combination_pairs
  |> list.sort(fn(pair1, pair2) {
    let pair1_distance = get_distance(pair1.0, pair1.1)
    let pair2_distance = get_distance(pair2.0, pair2.1)

    float.compare(pair1_distance, pair2_distance)
  })
  |> list.fold_until(
    #([], #(Position(0, 0, 0), Position(0, 0, 0))),
    fn(acc, pair) {
      let #(position1, position2) = pair
      let #(circuits, _) = acc
      let #(circuit1, rest1) = find_and_remove(position1, circuits)
      let #(circuit2, rest2) = find_and_remove(position2, rest1)

      let new_circuits = case circuit1, circuit2 {
        None, None -> [set.from_list([position1, position2]), ..rest2]

        Some(c), None -> [set.insert(c, position2), ..rest2]
        None, Some(c) -> [set.insert(c, position1), ..rest2]

        Some(c1), Some(c2) -> [set.union(c1, c2), ..rest2]
      }

      let assert Ok(first_set) = new_circuits |> list.first

      case set.size(first_set) == list.length(boxes) {
        True -> Stop(#(new_circuits, pair))
        False -> Continue(#(new_circuits, pair))
      }
    },
  )
  |> pair.second
  |> fn(p) { { p.0 }.x * { p.1 }.x }
  |> int.to_string
}
