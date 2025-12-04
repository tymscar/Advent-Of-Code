import gleam/dict.{type Dict}
import gleam/int
import gleam/list
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day04/input.txt"

type Position =
  #(Int, Int)

type Grid(a) =
  Dict(Position, a)

type Object {
  Empty
  Roll
}

fn parse_map(input: String) -> Grid(Object) {
  input
  |> string.split("\n")
  |> list.index_map(fn(row, y) {
    row
    |> string.split("")
    |> list.index_map(fn(val, x) {
      case val {
        "@" -> #(#(y, x), Roll)
        _ -> #(#(y, x), Empty)
      }
    })
  })
  |> list.flatten
  |> dict.from_list
}

fn get_neighbours(grid: Grid(Object), pos: Position) -> List(Object) {
  [
    #(pos.0 - 1, pos.1 - 1),
    #(pos.0 - 1, pos.1),
    #(pos.0 - 1, pos.1 + 1),
    #(pos.0, pos.1 - 1),
    #(pos.0, pos.1 + 1),
    #(pos.0 + 1, pos.1 - 1),
    #(pos.0 + 1, pos.1),
    #(pos.0 + 1, pos.1 + 1),
  ]
  |> list.filter_map(fn(neighbour_pos) { grid |> dict.get(neighbour_pos) })
}

fn get_simplified_grid(grid: Grid(Object)) -> Grid(Object) {
  let new_grid =
    grid
    |> dict.filter(fn(pos, _) {
      grid
      |> get_neighbours(pos)
      |> list.length
      >= 4
    })
  case dict.size(new_grid) == dict.size(grid) {
    True -> new_grid
    False -> get_simplified_grid(new_grid)
  }
}

pub fn solve() -> String {
  let map =
    input_path
    |> simplifile.read()
    |> result.unwrap("")
    |> parse_map
    |> dict.filter(fn(_, obj) { obj == Roll })

  let final_map = get_simplified_grid(map)

  dict.size(map) - dict.size(final_map)
  |> int.to_string
}
