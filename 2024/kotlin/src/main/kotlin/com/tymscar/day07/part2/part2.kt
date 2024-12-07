package com.tymscar.day07.part2

import kotlin.math.floor
import kotlin.math.log10
import kotlin.math.pow

private fun deconcat(log: Long, splinter: Long): Long? {
    val splinterSizeInHundreds = 10.0.pow(floor(log10(splinter.toDouble())) + 1).toLong()
    val afterDeconcat: Long = log / splinterSizeInHundreds
    return if ((afterDeconcat * splinterSizeInHundreds + splinter) == log) afterDeconcat else null
}

private fun isValid(solution: Long?, equation: List<Long>): Boolean {
    if (solution == null) return false
    if (equation.isEmpty()) return solution == 0L
    val remainingEq = equation.drop(1)
    val sumSolution = isValid(solution - equation.first(), remainingEq)
    val multSolution =
        if (solution % equation.first() == 0L) isValid(solution / equation.first(), remainingEq) else false
    val concatSolution =
        isValid(deconcat(solution, equation.first()), remainingEq)
    return sumSolution || multSolution || concatSolution
}

fun solve(input: String): String {
    var equations = input.lines().map {
        Regex("""(\d+)""").findAll(it).map { it.value.toLong() }.toList()
    }

    return equations
        .filter { isValid(it.first(), it.drop(1).reversed()) }
        .sumOf { it.first() }
        .toString()
}
