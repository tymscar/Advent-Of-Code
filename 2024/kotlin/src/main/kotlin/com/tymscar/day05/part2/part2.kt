package com.tymscar.day05.part2

import kotlinx.coroutines.*

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
                if (previousPages.any { shouldBeLaterPages.contains(it) }) {
                    val firstPageToSwap = previousPages.first { shouldBeLaterPages.contains(it) }
                    val firstPageToSwapIndex = correctedUpdate.indexOf(firstPageToSwap)
                    correctedUpdate.removeAt(firstPageToSwapIndex)
                    correctedUpdate.add(index, firstPageToSwap)
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

    val invalidUpdates = pagesToCheck.filter { !isValidUpdate(it, orderingRules) }

    return runBlocking {
        val deferredResults = invalidUpdates.mapIndexed { index, update ->
            async(Dispatchers.Default) {
                val correctedUpdate = correctUpdate(update, orderingRules)
                correctedUpdate[correctedUpdate.count() / 2].toInt()
            }
        }

        val results = deferredResults.awaitAll()
        return@runBlocking results.sum().toString()
    }

}