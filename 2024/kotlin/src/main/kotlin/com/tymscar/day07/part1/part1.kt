package com.tymscar.day07.part1

private fun isValid(solution: Long, equation: List<Long>): Boolean {
    if (equation.isEmpty()) return solution == 0L
    val sumSolution = isValid(solution - equation.first(), equation.drop(1))
    val multSolution =
        if (solution % equation.first() == 0L) isValid(solution / equation.first(), equation.drop(1)) else false
    return sumSolution || multSolution
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
