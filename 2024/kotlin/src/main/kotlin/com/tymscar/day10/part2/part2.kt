package com.tymscar.day10.part2

import java.util.PriorityQueue

private data class Step(val x: Int, val y: Int, val height: Int) {
    fun getNeighbours(map: Map<Pair<Int, Int>, Step>): List<Step> = listOfNotNull(
        map.getOrDefault(x - 1 to y, null),
        map.getOrDefault(x + 1 to y, null),
        map.getOrDefault(x to y + 1, null),
        map.getOrDefault(x to y - 1, null),
    )
}

private fun canReach(start: Step, end: Step, map: Map<Pair<Int, Int>, Step>): Boolean {
    val distanceMap = mutableMapOf<Step, Int>()
    var toVisit = PriorityQueue<Step>(compareBy { distanceMap.getOrDefault(it, Int.MAX_VALUE / 2) })
    distanceMap[start] = 0
    toVisit.add(start)
    while (!toVisit.isEmpty()) {
        val currentStep = toVisit.poll()
        if (currentStep == end) return true
        val currentDistance = distanceMap[currentStep]!!
        currentStep
            .getNeighbours(map)
            .forEach { neighbour ->
                val cost = if (neighbour.height - currentStep.height == 1) 1 else Int.MAX_VALUE / 2
                val newDistance = currentDistance + cost
                if (distanceMap.getOrDefault(neighbour, Int.MAX_VALUE / 2) > newDistance) {
                    distanceMap[neighbour] = newDistance
                    toVisit.add(neighbour)
                }
            }
    }
    return false
}

private fun getReachableMapFrom(start: Step, map: Map<Pair<Int, Int>, Step>): Map<Pair<Int, Int>, Step> {
    val toVisit = ArrayDeque<Step>()
    val visited = mutableSetOf<Step>()
    toVisit.add(start)
    while (!toVisit.isEmpty()) {
        val currentStep = toVisit.removeFirst()
        visited.add(currentStep)
        currentStep
            .getNeighbours(map)
            .forEach { if (it.height - currentStep.height == 1) toVisit.add(it) }
    }

    return visited.associateBy { it.x to it.y }
}

private fun countTrailsFrom(start: Step, endings: List<Step>, map: Map<Pair<Int, Int>, Step>): Long {
    val reachableMap = getReachableMapFrom(start, map)
    val reachableEndings = endings.filter { canReach(start, it, reachableMap) }
    if (reachableEndings.isEmpty()) return 0

    return reachableMap.values.sumOf { point ->
        val validNeighbours = point.getNeighbours(reachableMap).filter { neighbour ->
            val itCanFinish = reachableEndings.any { canReach(neighbour, it, reachableMap) }
            val itsNextStep = (neighbour.height - point.height) in 0..1
            itCanFinish && itsNextStep
        }
        when (validNeighbours.count()) {
            2 -> 1L // fork means we add another trail
            3 -> 2L // junction means we add two trails
            else -> 0L
        }
    }.plus(reachableEndings.count()) // we add one for each main trail
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
    val endingPoints = steps.filter { it.height == 9 }

    return startingPoints
        .sumOf { countTrailsFrom(it, endingPoints, map) }
        .toString()
}
