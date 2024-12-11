package com.tymscar.day11.part2

private fun getLineLengthFrom(stone: Long, memo: HashMap<Long, HashMap<Int, Long>>, stepsLeft: Int): Long {
    if (stepsLeft == 0) return 0
    memo.getOrPut(stone) { HashMap() }.let { if (it.contains(stepsLeft)) return it[stepsLeft]!! }

    val stoneString = stone.toString()
    return when {
        stone == 0L -> {
            val newLineLength = getLineLengthFrom(1, memo, stepsLeft - 1)
            memo[stone]!![stepsLeft] = newLineLength
            newLineLength
        }

        stoneString.length % 2 == 0 -> {
            val left = stoneString
                .subSequence(0, stone.toString().length / 2)
                .toString().toLong()
            val right = stoneString
                .subSequence(stone.toString().length / 2, stone.toString().length)
                .toString().toLong()
            val newLineLength =
                1 + getLineLengthFrom(left, memo, stepsLeft - 1) + getLineLengthFrom(right, memo, stepsLeft - 1)
            memo[stone]!![stepsLeft] = newLineLength
            newLineLength
        }

        else -> {
            val newLineLength = getLineLengthFrom(stone * 2024L, memo, stepsLeft - 1)
            memo[stone]!![stepsLeft] = newLineLength
            newLineLength
        }
    }
}

fun solve(input: String): String {
    val stones = input.split(" ").map(String::toLong)
    val memo = HashMap<Long, HashMap<Int, Long>>()

    return stones
        .sumOf { 1 + getLineLengthFrom(it, memo, 75) }
        .toString()
}
