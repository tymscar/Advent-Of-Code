package com.tymscar.day08.part1

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
}

private fun getAntinodes(firstAntenna: Position, secondAntenna: Position): List<Position> {
    val offset = firstAntenna - secondAntenna
    return listOf(firstAntenna + offset, secondAntenna - offset)
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
        .flatMap { it.mapPairs { a, b -> getAntinodes(a, b) }.flatten() }
        .toSet()
        .count { it.x in 0 until mapHeight && it.y in 0 until mapWidth }
        .toString()
}
