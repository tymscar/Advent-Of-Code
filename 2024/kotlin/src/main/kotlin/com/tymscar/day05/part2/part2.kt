package com.tymscar.day05.part2


private fun isValidUpdate(update: List<String>, orderingRules: Map<String, List<String>>): Boolean = update
    .withIndex()
    .fold(listOf<Boolean>()) { a, (index, page) ->
        val previousPages = update.take(index)
        val shouldBeLaterPages = orderingRules[page] ?: listOf()
        if (previousPages.any { shouldBeLaterPages.contains(it) }) (a + true) else (a + false)
    }.all(Boolean::not)

private fun correctUpdate(update: List<String>, orderingRules: Map<String, List<String>>): List<String> {
    var correctedUpdate = update.toMutableList()

    while (!isValidUpdate(correctedUpdate, orderingRules)) {
        run breaking@{
            correctedUpdate.withIndex().forEach { (index, page) ->
                val previousPages = correctedUpdate.take(index)
                val shouldBeLaterPages = orderingRules[page] ?: listOf()
                val firstPageToSwapIndex = previousPages.indexOfFirst { shouldBeLaterPages.contains(it) }
                if (firstPageToSwapIndex != -1) {
                    val firstPageToSwap = previousPages[firstPageToSwapIndex]
                    correctedUpdate[index] = firstPageToSwap
                    correctedUpdate[firstPageToSwapIndex] = page
                    return@breaking
                }
            }
        }
    }

    return correctedUpdate
}

fun solve(input: String): String {
    val orderingRules = Regex("""(\d+)\|(\d+)""")
        .findAll(input)
        .groupBy({ it.groupValues[1] }, { it.groupValues[2] })

    val pagesToCheck = Regex("""\d+(,\d+)+""")
        .findAll(input)
        .map { it.groupValues[0].split(",") }
        .toList()

    return pagesToCheck
        .filter { !isValidUpdate(it, orderingRules) }
        .sumOf() { correctUpdate(it, orderingRules)
        .let { it[it.count() / 2].toInt() } }
        .toString()
}