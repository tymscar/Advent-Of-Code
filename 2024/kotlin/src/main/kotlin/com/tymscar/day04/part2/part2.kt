package com.tymscar.day04.part2

private data class Coordinate(val x: Int, val y: Int)

private fun List<List<Char>>.nestedGetOrNull(position: Coordinate) = this.getOrNull(position.x)?.getOrNull(position.y)

private fun getPossibleLocations(from: Coordinate): List<List<Coordinate>> {
    var range = 0..<"MAS".length
    return listOf(
        range.map { Coordinate(from.x + it, from.y + it) },
        range.map { Coordinate(from.x + it, from.y - it) },
        range.map { Coordinate(from.x - it, from.y - it) },
        range.map { Coordinate(from.x - it, from.y + it) }
    )
}

private fun findACoordsInMas(grid: List<List<Char>>, position: Coordinate) = getPossibleLocations(position)
    .mapNotNull {
        val lettersFound = it.map(grid::nestedGetOrNull)
        if (lettersFound.any { it == null }) null else (if (lettersFound.joinToString("") == "MAS") it[1] else null)
    }

fun solve(input: String): String {
    val grid = input.lines().map { it.toList() }
    return grid
        .flatMapIndexed { j, row ->
            row.mapIndexed { i, _ ->
                findACoordsInMas(grid, Coordinate(i, j))
            }
        }
        .flatten()
        .groupBy { it }
        .filter { it.value.size > 1 }
        .flatMap { it.value }
        .count()
        .div(2)
        .toString()
}
