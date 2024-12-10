package com.tymscar.day10.part2

private data class Step(val x: Int, val y: Int, val height: Int) {
    fun getNeighbours(map: Map<Pair<Int, Int>, Step>): List<Step> = listOfNotNull(
        map.getOrDefault(x - 1 to y, null),
        map.getOrDefault(x + 1 to y, null),
        map.getOrDefault(x to y + 1, null),
        map.getOrDefault(x to y - 1, null),
    )
}



private fun countTrails(start: Step, map: Map<Pair<Int, Int>, Step>): Int {
    var validTrails = mutableListOf<List<Step>>()

    var toVisit = ArrayDeque<List<Step>>()
    toVisit.add(listOf(start))
    while (!toVisit.isEmpty()) {
        val currentTrail = toVisit.removeFirst()
        if (currentTrail.last().height == 9) {
            validTrails.add(currentTrail.toList())
            continue
        }

       currentTrail.last().getNeighbours(map).forEach { neighbour ->
           if(neighbour.height - currentTrail.last().height in 0..1 && !currentTrail.contains(neighbour)) {
               toVisit.add(currentTrail + neighbour)
           }
        }
    }
    return validTrails.count()
}

fun solve(input: String): String {
    val steps = input.lines().withIndex().flatMap { (i, line) ->
        line.withIndex().map { (j, point) ->
            when (point) {
                '.' -> Step(i, j, Int.MAX_VALUE)
                else -> Step(i, j, point.digitToInt())
            }
        }
    }

    val map = steps.associateBy { it.x to it.y }
    val startingPoints = steps.filter { it.height == 0 }


    return startingPoints.sumOf { countTrails(it, map) }.toString()
}
