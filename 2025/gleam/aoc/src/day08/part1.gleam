import gleam/float
import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
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

fn add_pair(
  circuits: List(Set(Position)),
  pair: #(Position, Position),
) -> List(Set(Position)) {
  let #(position1, position2) = pair
  let #(circuit1, rest1) = find_and_remove(position1, circuits)
  let #(circuit2, rest2) = find_and_remove(position2, rest1)

  case circuit1, circuit2 {
    None, None -> [set.from_list([position1, position2]), ..rest2]

    Some(c), None -> [set.insert(c, position2), ..rest2]
    None, Some(c) -> [set.insert(c, position1), ..rest2]

    Some(c1), Some(c2) -> [set.union(c1, c2), ..rest2]
  }
}

pub fn solve() -> String {
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
  |> list.combination_pairs
  |> list.sort(fn(pair1, pair2) {
    let pair1_distance = get_distance(pair1.0, pair1.1)
    let pair2_distance = get_distance(pair2.0, pair2.1)

    float.compare(pair1_distance, pair2_distance)
  })
  |> list.take(1000)
  |> list.fold([], fn(acc, pair) { acc |> add_pair(pair) })
  |> list.map(set.size)
  |> list.sort(int.compare)
  |> list.reverse()
  |> list.take(3)
  |> int.product
  |> int.to_string
}
