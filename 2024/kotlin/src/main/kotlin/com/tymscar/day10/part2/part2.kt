package com.tymscar.day10.part2

private data class Step(val x: Int, val y: Int, val height: Int) {
    fun getNeighbours(map: Map<Pair<Int, Int>, Step>): List<Step> = listOfNotNull(
        map.getOrDefault(x - 1 to y, null),
        map.getOrDefault(x + 1 to y, null),
        map.getOrDefault(x to y + 1, null),
        map.getOrDefault(x to y - 1, null),
    )
}

private fun countTrails(end: Step, map: Map<Pair<Int, Int>, Step>): Int {
    var count = 0

    var toVisit = mutableListOf(end)
    while (!toVisit.isEmpty()) {
        val currentTrail = toVisit.removeFirst()
        if (currentTrail.height == 0) count++

        currentTrail.getNeighbours(map).forEach { neighbour ->
            if (currentTrail.height - neighbour.height == 1) {
                toVisit.add(neighbour)
            }
        }
    }

    return count
}

fun solve(input: String): String {
    val steps = input.lines().withIndex().flatMap { (i, line) ->
        line.withIndex().map { (j, point) -> Step(i, j, point.digitToInt()) }
    }

    val map = steps.associateBy { it.x to it.y }

    return steps
        .filter { it.height == 9 }
        .sumOf { countTrails(it, map) }
        .toString()
}
