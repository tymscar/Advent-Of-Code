package com.tymscar.day05.part1

private fun isValidUpdate(update: List<String>, orderingRules: Map<String, List<String>>): Boolean = update
    .withIndex()
    .fold(listOf<Boolean>()) { a, (index, page) ->
        val previousPages = update.take(index)
        val shouldBeLaterPages = orderingRules[page] ?: listOf()
        if (previousPages.any { shouldBeLaterPages.contains(it) }) (a + true) else (a + false)
    }.all(Boolean::not)

fun solve(input: String): String {
    val orderingRules = Regex("""(\d+)\|(\d+)""")
        .findAll(input)
        .groupBy({ it.groupValues[1] }, { it.groupValues[2] })

    val pagesToCheck = Regex("""\d+(,\d+)+""")
        .findAll(input)
        .map { it.groupValues[0].split(",") }
        .toList()

    return pagesToCheck
        .filter { isValidUpdate(it, orderingRules) }
        .sumOf { it[it.count() / 2].toInt() }
        .toString()
}
