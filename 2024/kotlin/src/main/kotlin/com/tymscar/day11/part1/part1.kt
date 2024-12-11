package com.tymscar.day11.part1

private fun blink(stones: List<Long>): List<Long> = stones.flatMap { stone ->
    val stringOfStone = stone.toString()
    when {
        stone == 0L -> listOf(1)
        stringOfStone.length % 2 == 0 -> listOf(
            stringOfStone.subSequence(0, stringOfStone.length / 2)
                .toString()
                .toLong(),
            stringOfStone.subSequence((stringOfStone.length / 2), stringOfStone.length)
                .toString()
                .toLong()
        )

        else -> listOf(stone * 2024L)
    }
}

fun solve(input: String): String = (0..<25)
    .fold(input.split(" ").map(String::toLong)) { acc, _ -> blink(acc) }
    .count()
    .toString()
