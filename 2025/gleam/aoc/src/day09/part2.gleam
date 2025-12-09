import bigi.{type BigInt}
import gleam/list
import gleam/order
import gleam/result
import gleam/string
import simplifile

const input_path = "src/day09/input.txt"

type Position {
  Position(x: BigInt, y: BigInt)
}

type Segment {
  Segment(start: Position, end: Position)
}

type Side {
  Left
  Right
  On
}

fn is_point_on_segment(segment: Segment, point: Position) -> Bool {
  case
    bigi.compare(point.x, bigi.min(segment.start.x, segment.end.x)),
    bigi.compare(point.x, bigi.max(segment.start.x, segment.end.x)),
    bigi.compare(point.y, bigi.min(segment.start.y, segment.end.y)),
    bigi.compare(point.y, bigi.max(segment.start.y, segment.end.y))
  {
    order.Lt, _, _, _ -> False
    _, order.Gt, _, _ -> False
    _, _, order.Lt, _ -> False
    _, _, _, order.Gt -> False
    _, _, _, _ -> which_side_of(segment, point) == On
  }
}

fn do_segments_cross(first_segment: Segment, second_segment: Segment) -> Bool {
  let side_a = which_side_of(second_segment, first_segment.start)
  let side_b = which_side_of(second_segment, first_segment.end)
  let side_c = which_side_of(first_segment, second_segment.start)
  let side_d = which_side_of(first_segment, second_segment.end)

  are_opposite_sides(side_a, side_b) && are_opposite_sides(side_c, side_d)
}

fn are_opposite_sides(side_a: Side, side_b: Side) -> Bool {
  case side_a, side_b {
    Left, Right -> True
    Right, Left -> True
    _, _ -> False
  }
}

fn which_side_of(line: Segment, point: Position) -> Side {
  let value =
    bigi.subtract(
      bigi.multiply(
        bigi.subtract(line.end.x, line.start.x),
        bigi.subtract(point.y, line.start.y),
      ),
      bigi.multiply(
        bigi.subtract(line.end.y, line.start.y),
        bigi.subtract(point.x, line.start.x),
      ),
    )

  case bigi.compare(value, bigi.from_int(0)) {
    order.Lt -> Right
    order.Gt -> Left
    order.Eq -> On
  }
}

fn is_point_inside(point: Position, polygon: List(Segment)) -> Bool {
  case list.any(polygon, is_point_on_segment(_, point)) {
    True -> True
    False -> {
      let crossings =
        polygon
        |> list.count(fn(segment) {
          let min_y = bigi.min(segment.start.y, segment.end.y)
          let max_y = bigi.max(segment.start.y, segment.end.y)

          case bigi.compare(point.y, min_y), bigi.compare(point.y, max_y) {
            order.Lt, _ -> False
            _, order.Gt -> False
            _, order.Eq -> False
            _, _ -> {
              let x_intersect =
                bigi.add(
                  segment.start.x,
                  bigi.divide(
                    bigi.multiply(
                      bigi.subtract(point.y, segment.start.y),
                      bigi.subtract(segment.end.x, segment.start.x),
                    ),
                    bigi.subtract(segment.end.y, segment.start.y),
                  ),
                )
              case bigi.compare(x_intersect, point.x) {
                order.Gt -> True
                _ -> False
              }
            }
          }
        })

      crossings % 2 == 1
    }
  }
}

fn get_rectangle_sizes_in(polygon: List(Position)) -> List(BigInt) {
  let edges =
    [polygon, polygon |> list.take(1)]
    |> list.flatten
    |> list.window_by_2()
    |> list.map(fn(pair) { Segment(start: pair.0, end: pair.1) })

  polygon
  |> list.combination_pairs
  |> list.filter_map(fn(vertex_pair) {
    let #(rectangle_vertex_a, rectangle_vertex_b) = vertex_pair
    let rectangle_vertex_c =
      Position(x: rectangle_vertex_a.x, y: rectangle_vertex_b.y)
    let rectangle_vertex_d =
      Position(x: rectangle_vertex_b.x, y: rectangle_vertex_a.y)

    case
      is_point_inside(rectangle_vertex_c, edges),
      is_point_inside(rectangle_vertex_d, edges)
    {
      False, _ -> Error("One vertex is outside")
      _, False -> Error("One vertex is outside")
      True, True -> {
        // all vertices inside
        let rectangle_edges = [
          Segment(rectangle_vertex_a, rectangle_vertex_c),
          Segment(rectangle_vertex_c, rectangle_vertex_b),
          Segment(rectangle_vertex_b, rectangle_vertex_d),
          Segment(rectangle_vertex_d, rectangle_vertex_a),
        ]

        let has_any_crossing =
          edges
          |> list.any(fn(polygon_edge) {
            rectangle_edges
            |> list.any(fn(rectangle_edge) {
              do_segments_cross(polygon_edge, rectangle_edge)
            })
          })

        case has_any_crossing {
          False -> {
            let width =
              bigi.add(
                bigi.from_int(1),
                bigi.absolute(bigi.subtract(
                  rectangle_vertex_a.x,
                  rectangle_vertex_b.x,
                )),
              )
            let height =
              bigi.add(
                bigi.from_int(1),
                bigi.absolute(bigi.subtract(
                  rectangle_vertex_a.y,
                  rectangle_vertex_b.y,
                )),
              )
            Ok(bigi.multiply(width, height))
          }
          True -> Error("Polygon edges cross with rectangle edges")
        }
      }
    }
  })
}

pub fn solve() -> String {
  input_path
  |> simplifile.read()
  |> result.unwrap("")
  |> string.split("\n")
  |> list.map(fn(line) {
    let assert [x, y] = line |> string.split(",")
    Position(
      x: bigi.from_string(x) |> result.unwrap(bigi.from_int(0)),
      y: bigi.from_string(y) |> result.unwrap(bigi.from_int(0)),
    )
  })
  |> get_rectangle_sizes_in
  |> list.sort(bigi.compare)
  |> list.last
  |> result.unwrap(bigi.from_int(0))
  |> bigi.to_string
}
