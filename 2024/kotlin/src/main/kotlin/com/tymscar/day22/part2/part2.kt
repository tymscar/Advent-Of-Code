package com.tymscar.day22.part2


private fun getSequencePricesAfter(initial: Long, iterations: Int): LinkedHashMap<List<Long>, Long> {
    var value = initial
    val prices = mutableListOf<Long>(value % 10)
    repeat(iterations) {
        value = (value * 64).xor(value) % 16777216
        value = (value / 32).xor(value) % 16777216
        value = (value * 2048).xor(value) % 16777216
        prices.add(value % 10)
    }
    val sequences: List<Pair<List<Long>, Long>> = prices.mapIndexedNotNull { index, price ->
        if (index < 4) return@mapIndexedNotNull null
        listOf(
            prices[index - 3] - prices[index - 4],
            prices[index - 2] - prices[index - 3],
            prices[index - 1] - prices[index - 2],
            prices[index] - prices[index - 1],
        ) to price
    }

    return sequences.mapIndexedNotNull { index, (sequence, value) ->
        if (sequences.subList(0, index).any { it.first == sequence }) null
        else sequence to value
    }.toMap(LinkedHashMap())
}

fun solve(input: String): String {
    val sequencePrices = input
        .lines()
        .map(String::toLong)
        .map { getSequencePricesAfter(it, 2000) }

    return sequencePrices
        .flatMap { it.keys }
        .toSet()
        .maxOfOrNull { sequence -> sequencePrices.sumOf { it[sequence] ?: 0 } }
        .toString()
}
