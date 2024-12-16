package com.tymscar.day16.part1

import java.util.PriorityQueue


private data class Position(val x: Int, val y: Int)
private enum class Direction { NORTH, EAST, SOUTH, WEST }
private enum class Entity { EMPTY, WALL, START, END }

private data class Move(val state: State, val cost: Long)
private typealias State = Pair<Position, Direction>

private fun State.next(): List<Move> {
    val (position, direction) = this
    return when (direction) {
        Direction.NORTH -> listOf(
            Move(position.copy() to Direction.EAST, 1000),
            Move(position.copy(x = position.x - 1) to Direction.NORTH, 1),
            Move(position.copy() to Direction.WEST, 1000),
        )

        Direction.EAST -> listOf(
            Move(position.copy() to Direction.NORTH, 1000),
            Move(position.copy(y = position.y + 1) to Direction.EAST, 1),
            Move(position.copy() to Direction.SOUTH, 1000),
        )

        Direction.SOUTH -> listOf(
            Move(position.copy() to Direction.WEST, 1000),
            Move(position.copy(x = position.x + 1) to Direction.SOUTH, 1),
            Move(position.copy() to Direction.EAST, 1000),
        )

        Direction.WEST -> listOf(
            Move(position.copy() to Direction.SOUTH, 1000),
            Move(position.copy(y = position.y - 1) to Direction.WEST, 1),
            Move(position.copy() to Direction.NORTH, 1000),
        )
    }
}

private typealias Map = HashMap<Position, Entity>

private fun Map.find(entity: Entity): Position = entries.find { it.value == entity }!!.key

private fun Dijkstra(start: Position, end: Position, map: Map): Long {
    val visited = HashSet<State>()
    val scores = HashMap<State, Long>()
    val queue = PriorityQueue<Pair<State, Long>>(compareBy { it.second })

    queue.add((start to Direction.EAST) to 0)
    while (queue.isNotEmpty()) {
        val (current, score) = queue.poll()
        if (current.first == end) return score

        if (visited.contains(current)) continue
        visited.add(current)

        val nextMoves = current.next()
        for ((next, cost) in nextMoves) {
            if (map[next.first] == Entity.WALL || visited.contains(next)) continue
            val nextScore = score + cost
            if (nextScore < scores.getOrDefault(next, Long.MAX_VALUE)) {
                scores[next] = nextScore
                queue.add(next to nextScore)
            }
        }
    }
    return Long.MAX_VALUE
}

private fun getMap(input: String): Map = input
    .lines()
    .flatMapIndexed { i, line ->
        line.mapIndexed { j, c ->
            Position(i, j) to when (c) {
                '.' -> Entity.EMPTY
                '#' -> Entity.WALL
                'S' -> Entity.START
                'E' -> Entity.END
                else -> throw IllegalArgumentException("Unknown character: $c")
            }
        }
    }.toMap(HashMap())


fun solve(input: String): String {
    val map = getMap(input)
    val start = map.find(Entity.START)
    val end = map.find(Entity.END)

    return Dijkstra(start, end, map).toString()
}
