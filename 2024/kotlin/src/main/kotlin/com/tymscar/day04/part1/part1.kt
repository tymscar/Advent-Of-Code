package com.tymscar.day04.part1

private data class Coordinate(val x: Int, val y: Int)

private fun List<List<Char>>.nestedGetOrNull(position: Coordinate) = this.getOrNull(position.x)?.getOrNull(position.y)

private fun getPossibleLocations(from: Coordinate): List<List<Coordinate>> {
    var range = 0..<"XMAS".length
    return listOf(
        range.map { Coordinate(from.x, from.y + it) },
        range.map { Coordinate(from.x + it, from.y + it) },
        range.map { Coordinate(from.x + it, from.y) },
        range.map { Coordinate(from.x + it, from.y - it) },
        range.map { Coordinate(from.x, from.y - it) },
        range.map { Coordinate(from.x - it, from.y - it) },
        range.map { Coordinate(from.x - it, from.y) },
        range.map { Coordinate(from.x - it, from.y + it) }
    )
}

private fun wordsStartingAt(grid: List<List<Char>>, position: Coordinate) = getPossibleLocations(position)
    .map {
        val lettersFound = it.map(grid::nestedGetOrNull)
        if (lettersFound.any { it == null }) 0 else (if (lettersFound.joinToString("") == "XMAS") 1 else 0)
    }.sum()

fun solve(input: String): String {
    val grid = input.lines().map { it.toList() }
    return grid
        .flatMapIndexed { j, row ->
            row.mapIndexed { i, _ ->
                wordsStartingAt(grid, Coordinate(i, j))
            }
        }
        .sum()
        .toString()
}
