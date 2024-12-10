package com.tymscar.day10.part1

import java.util.PriorityQueue

private data class Step(val x: Int, val y: Int, val height: Int)

private fun canReach(start: Step, end: Step, map: Map<Pair<Int, Int>, Step>): Boolean {
    val distanceMap = mutableMapOf<Step, Int>()
    var toVisit = PriorityQueue<Step>(compareBy { distanceMap.getOrDefault(it, Int.MAX_VALUE / 2) })
    distanceMap[start] = 0
    toVisit.add(start)
    while (!toVisit.isEmpty()) {
        val currentStep = toVisit.poll()
        if (currentStep == end) return true
        val currentDistance = distanceMap[currentStep]!!
        val neighbours = listOfNotNull(
            map.getOrDefault(currentStep.x - 1 to currentStep.y, null),
            map.getOrDefault(currentStep.x + 1 to currentStep.y, null),
            map.getOrDefault(currentStep.x to currentStep.y + 1, null),
            map.getOrDefault(currentStep.x to currentStep.y - 1, null),
        )
        neighbours.forEach { neighbour ->
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

fun solve(input: String): String {
    val steps = input.lines().withIndex().flatMap { (i, line) ->
        line.withIndex().map { (j, point) ->
            Step(i, j, point.digitToInt())
        }
    }

    val map = steps.associateBy { it.x to it.y }
    val startingPoints = steps.filter { it.height == 0 }
    val endingPoints = steps.filter { it.height == 9 }

    return startingPoints
        .sumOf { start ->
            endingPoints.sumOf { if (canReach(start, it, map)) 1L else 0L }
        }.toString()
}
