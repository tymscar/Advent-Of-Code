package com.tymscar.day08.part2

import kotlin.math.abs
import kotlin.math.min

fun <T, R> List<T>.mapPairs(transform: (T, T) -> R): List<R> {
    return this.flatMapIndexed { i, a ->
        this.drop(i + 1).map { b ->
            transform(a, b)
        }
    }
}

data class Position(val x: Int, val y: Int) {
    operator fun plus(other: Position): Position = Position(x + other.x, y + other.y)
    operator fun minus(other: Position): Position = Position(x - other.x, y - other.y)
    operator fun times(other: Int): Position = Position(x * other, y * other)
}

private fun getAntinodes(firstAntenna: Position, secondAntenna: Position, width: Int, height: Int): List<Position> {
    val offset = firstAntenna - secondAntenna
    val maxMovementVert = abs(height / offset.x)
    val maxMovementHoriz = abs(width / offset.y)
    val maxMovement = min(maxMovementVert, maxMovementHoriz)
    return (0..maxMovement)
        .flatMap { listOf(firstAntenna + offset * it, secondAntenna - offset * it) }
        .filter { it.x in 0 until height && it.y in 0 until width }
}

fun solve(input: String): String {
    val mapWidth = input.lines().first().count()
    val mapHeight = input.lines().count()

    val antennae = input
        .lines()
        .withIndex()
        .flatMap { (i, line) ->
            line
                .toCharArray()
                .withIndex()
                .map { (j, character) -> if (character != '.') character to Position(i, j) else null }
        }
        .filterNotNull()
        .groupBy({ it.first }, { it.second })

    return antennae
        .values
        .flatMap { it.mapPairs { a, b -> getAntinodes(a, b, mapWidth, mapHeight) }.flatten() }
        .toSet()
        .count()
        .toString()
}
