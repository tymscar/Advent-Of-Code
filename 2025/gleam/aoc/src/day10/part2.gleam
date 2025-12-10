import gleam/dict
import gleam/int
import gleam/list
import gleam/pair
import gleam/result
import gleam/string
import shellout
import simplifile

const input_path = "src/day10/input.txt"

fn get_number_list_from_bracket_string(str: String) -> List(Int) {
  str
  |> string.drop_start(1)
  |> string.drop_end(1)
  |> string.split(",")
  |> list.map(int.parse)
  |> list.map(result.unwrap(_, 0))
}

fn get_lp_file(
  constraints: List(#(#(Int, List(Int)), Int)),
  buttons_count: Int,
) -> String {
  let buttons =
    list.range(0, buttons_count - 1)
    |> list.map(fn(btn) { "x" <> int.to_string(btn) })

  "Minimize\n"
  <> "  total: "
  <> buttons
  |> string.join(" + ")
  <> "\n\nSubject To\n"
  <> constraints
  |> list.map(fn(constraint) {
    let constraint_index =
      constraint |> pair.first() |> pair.first() |> int.to_string()
    let affecting_buttons =
      constraint
      |> pair.first()
      |> pair.second()
      |> list.map(fn(btn) { "x" <> int.to_string(btn) })
      |> string.join(" + ")
    let needed_result = constraint |> pair.second() |> int.to_string()
    "  c"
    <> constraint_index
    <> ": "
    <> affecting_buttons
    <> " = "
    <> needed_result
  })
  |> string.join("\n")
  <> "\n\nGeneral\n  "
  <> buttons |> string.join(" ")
  <> "\n\nEnd"
}

fn parse_lp_solution(solution: String) -> Int {
  solution
  |> string.split("\n")
  |> list.find(fn(line) { string.starts_with(line, "s ") })
  |> result.unwrap("")
  |> string.split(" ")
  |> list.last()
  |> result.unwrap("")
  |> int.parse()
  |> result.unwrap(0)
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.map(fn(line) {
    let line_no_lights = line |> string.split(" ") |> list.drop(1)

    let buttons =
      line_no_lights
      |> list.take({ line_no_lights |> list.length } - 1)
      |> list.map(get_number_list_from_bracket_string)

    let joltages =
      line_no_lights
      |> list.drop({ line_no_lights |> list.length } - 1)
      |> list.flat_map(get_number_list_from_bracket_string)

    let counters =
      buttons
      |> list.index_fold(
        dict.from_list([]),
        fn(acc, curr_button, curr_button_index) {
          curr_button
          |> list.fold(acc, fn(curr_acc, affected_counter) {
            let old_affected_counter_value =
              curr_acc |> dict.get(affected_counter) |> result.unwrap([])
            curr_acc
            |> dict.insert(
              affected_counter,
              list.append(old_affected_counter_value, [curr_button_index]),
            )
          })
        },
      )

    let lp_source_code =
      counters
      |> dict.to_list
      |> list.zip(joltages)
      |> get_lp_file(buttons |> list.length)

    let _ = simplifile.write("temp.lp", lp_source_code)

    let _ =
      shellout.command(
        "glpsol",
        ["--lp", "temp.lp", "-w", "temp_sol.txt"],
        ".",
        [],
      )
    let solution =
      simplifile.read("temp_sol.txt")
      |> result.unwrap("")
      |> parse_lp_solution()

    let _ = simplifile.delete("temp.lp")
    let _ = simplifile.delete("temp_sol.txt")

    solution
  })
  |> int.sum()
  |> int.to_string()
}
