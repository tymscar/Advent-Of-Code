import gleam/dict.{type Dict}
import gleam/int
import gleam/list
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day11/input.txt"

type Graph =
  Dict(String, List(String))

type Path =
  List(String)

fn dfs(graph: Graph, from: String) -> List(Path) {
  case from == "out" {
    True -> [["out"]]
    False -> {
      graph
      |> dict.get(from)
      |> result.unwrap(["out"])
      |> list.flat_map(fn(neighbour) {
        dfs(graph, neighbour)
        |> list.map(fn(path) { path |> list.prepend(from) })
      })
    }
  }
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.map(fn(line) {
    let assert [from, to] = line |> string.split(": ")
    let neighbours = to |> string.split(" ")
    #(from, neighbours)
  })
  |> dict.from_list()
  |> dfs("you")
  |> list.length()
  |> int.to_string()
}
