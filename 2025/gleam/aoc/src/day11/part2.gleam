import bigi.{type BigInt}
import gleam/dict.{type Dict}
import gleam/list
import gleam/pair
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day11/input.txt"

type Graph =
  Dict(String, List(String))

fn dfs_helper(
  graph: Graph,
  from: String,
  seen_dac: Bool,
  seen_fft: Bool,
  memo: Dict(#(String, Bool, Bool), BigInt),
) -> #(BigInt, Dict(#(String, Bool, Bool), BigInt)) {
  case from == "out" {
    True -> {
      case seen_dac, seen_fft {
        True, True -> #(bigi.from_int(1), memo)
        _, _ -> #(bigi.from_int(0), memo)
      }
    }
    False -> {
      graph
      |> dict.get(from)
      |> result.unwrap(["out"])
      |> list.fold(#(bigi.from_int(0), memo), fn(acc, neighbour) {
        let new_seen_dac = seen_dac || from == "dac"
        let new_seen_fft = seen_fft || from == "fft"
        let prev_val =
          acc
          |> pair.second()
          |> dict.get(#(neighbour, new_seen_dac, new_seen_fft))
        case prev_val {
          Ok(val) -> #(
            bigi.add({ acc |> pair.first() }, val),
            acc |> pair.second(),
          )
          Error(_) -> {
            let new_val =
              dfs_helper(
                graph,
                neighbour,
                new_seen_dac,
                new_seen_fft,
                acc |> pair.second(),
              )
            let new_memo =
              new_val
              |> pair.second()
              |> dict.insert(
                #(neighbour, new_seen_dac, new_seen_fft),
                new_val |> pair.first(),
              )
            #(
              bigi.add({ new_val |> pair.first() }, { acc |> pair.first() }),
              new_memo,
            )
          }
        }
      })
    }
  }
}

fn dfs(graph: Graph, from: String) -> BigInt {
  dfs_helper(graph, from, False, False, dict.from_list([])) |> pair.first
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
  |> dfs("svr")
  |> bigi.to_string()
}
