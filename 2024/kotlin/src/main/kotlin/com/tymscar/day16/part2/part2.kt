package com.tymscar.day16.part2

import java.util.PriorityQueue
import kotlin.collections.ArrayDeque


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

private fun getLowestScore(start: State, end: Position, map: Map): Long {
    val visited = HashSet<State>()
    val scores = HashMap<State, Long>()
    val queue = PriorityQueue<Pair<State, Long>>(compareBy { it.second })

    queue.add(start to 0)
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

private fun getAllShortestPathLengths(start: Position, end: Position, targetScore: Long, map: Map): Int {
    val visited = HashSet<State>()
    val queue = ArrayDeque<Pair<State, Long>>()
    val validPositions = HashSet<Position>()

    queue.add(start to Direction.EAST to 0)
    while (queue.isNotEmpty()) {
        val (currentState, currentScore) = queue.removeFirst()
        validPositions.add(currentState.first)

        if (currentState.first == end) continue

        if (visited.contains(currentState)) continue
        visited.add(currentState)

        val nextMoves = currentState.next()
        for ((nextState, cost) in nextMoves) {
            if (map[nextState.first] == Entity.WALL || visited.contains(nextState)) continue
            if( currentScore + cost + getLowestScore(nextState, end, map) > targetScore) continue

            val nextScore = currentScore + cost
            queue.add(nextState to nextScore)
        }
    }

    return validPositions.count()
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

    val smallestScore = getLowestScore((start to Direction.EAST), end, map)
    return getAllShortestPathLengths(start, end, smallestScore, map).toString()
}
