package com.tymscar.day20.part2

import java.util.PriorityQueue
import kotlin.collections.set
import kotlin.math.abs

private const val MAX_CHEAT_DISTANCE = 20

private enum class EntityType { TRACK, WALL, START, END }
private data class Position(val x: Int, val y: Int) {
    fun getValidNeighbours(map: Map): List<Position> = listOf(
        Position(x - 1, y),
        Position(x + 1, y),
        Position(x, y - 1),
        Position(x, y + 1)
    ).filter { map.getOrDefault(it, EntityType.WALL) != EntityType.WALL }

    fun getDistance(other: Position): Int = abs(x - other.x) + abs(y - other.y)

    fun getValidCheatPositions(map: Map): List<Position> =
        (-MAX_CHEAT_DISTANCE..MAX_CHEAT_DISTANCE).flatMap { xOffset ->
            (-MAX_CHEAT_DISTANCE..MAX_CHEAT_DISTANCE).mapNotNull { yOffset ->
                val position = Position(x + xOffset, y + yOffset)
                when {
                    xOffset == 0 && yOffset == 0 -> return@mapNotNull null
                    this.getDistance(position) > MAX_CHEAT_DISTANCE -> return@mapNotNull null
                    else -> position
                }
            }
        }.filter { map.getOrDefault(it, EntityType.WALL) != EntityType.WALL }
}

private data class Cheat(val start: Position, val end: Position, val timeSaved: Int)
private typealias Map = HashMap<Position, EntityType>
private typealias Path = List<Position>

private fun getTiming(start: Position, end: Position, map: Map): Int {
    val visited = HashSet<Position>()
    val costs = HashMap<Position, Int>()
    val queue = PriorityQueue<Pair<Position, Int>>(compareBy { it.second })

    queue.add(start to 0)
    while (queue.isNotEmpty()) {
        val (currPos, currCost) = queue.poll()
        if (currPos == end) return currCost

        if (visited.contains(currPos)) continue
        visited.add(currPos)

        val neighbours = currPos.getValidNeighbours(map)
        for (neighbour in neighbours) {
            if (visited.contains(neighbour)) continue
            val nextCost = currCost + 1
            if (nextCost < costs.getOrDefault(neighbour, Int.MAX_VALUE)) {
                costs[neighbour] = nextCost
                queue.add(neighbour to nextCost)
            }
        }
    }
    return Int.MAX_VALUE
}

private fun getPath(start: Position, end: Position, map: Map): Path {
    val visited = HashSet<Path>()
    val costs = HashMap<Position, Int>()
    val queue = PriorityQueue<Pair<Path, Int>>(compareBy { it.second })

    queue.add(listOf(start) to 0)
    while (queue.isNotEmpty()) {
        val (currPath, currCost) = queue.poll()
        val currPoint = currPath.last()
        if (currPoint == end) return currPath

        if (visited.contains(currPath)) continue
        visited.add(currPath)

        val neighbours = currPoint.getValidNeighbours(map)
        for (neighbour in neighbours) {
            val neighbourPath = currPath + neighbour
            if (visited.contains(neighbourPath)) continue
            val nextCost = currCost + 1
            if (nextCost < costs.getOrDefault(neighbour, Int.MAX_VALUE)) {
                costs[neighbour] = nextCost
                queue.add(neighbourPath to nextCost)
            }
        }
    }
    return emptyList()
}

private fun getCheats(path: Path, map: Map, memo: HashMap<Position, Int>): List<Cheat> = path
    .flatMapIndexed { i, position ->
        position.getValidCheatPositions(map)
            .map { cheatEndPosition ->
                val cheatTime = when {
                    memo.containsKey(cheatEndPosition) -> memo[cheatEndPosition]!!
                    else -> getTiming(cheatEndPosition, path.last(), map)
                }
                if (!memo.containsKey(cheatEndPosition)) memo[cheatEndPosition] = cheatTime
                val cheatDistance = position.getDistance(cheatEndPosition)
                Cheat(position, cheatEndPosition, path.count() - cheatTime - i - (1 + cheatDistance))
            }
    }

private fun parseMap(input: String): Map = input
    .lines()
    .flatMapIndexed { i, line ->
        line.mapIndexed { j, char ->
            val position = Position(i, j)
            val type = when (char) {
                '#' -> EntityType.WALL
                '.' -> EntityType.TRACK
                'S' -> EntityType.START
                'E' -> EntityType.END
                else -> throw IllegalArgumentException("Invalid character in map: $char")
            }
            position to type
        }
    }.toMap(Map())

fun solve(input: String): String {
    val map = parseMap(input)
    val start = map.entries.find { it.value == EntityType.START }!!.key
    val end = map.entries.find { it.value == EntityType.END }!!.key
    map[start] = EntityType.TRACK
    map[end] = EntityType.TRACK

    val initialTiming = getTiming(start, end, map)
    val initialPath = getPath(start, end, map)

    val memo = initialPath
        .mapIndexed { i, position -> position to (initialTiming - i) }
        .toMap(HashMap())

    return getCheats(initialPath, map, memo)
        .count { it.timeSaved >= 100 }
        .toString()
}
