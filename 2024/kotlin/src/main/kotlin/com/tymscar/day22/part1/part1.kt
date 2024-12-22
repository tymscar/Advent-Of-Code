package com.tymscar.day22.part1


private fun getSecretAfter(initial: Long, iterations: Int): Long {
    var value = initial
    repeat(iterations) {
        value = (value * 64).xor(value) % 16777216
        value = (value / 32).xor(value) % 16777216
        value = (value * 2048).xor(value) % 16777216
    }
    return value
}

fun solve(input: String): String = input
    .lines()
    .map(String::toLong)
    .sumOf { getSecretAfter(it, 2000) }
    .toString()
