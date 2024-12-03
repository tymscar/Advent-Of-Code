package com.tymscar.day03.part1

val mulRegex = Regex("mul\\((\\d{1,3}),(\\d{1,3})\\)")

fun solve(input: String): String {
    return mulRegex.findAll(input).sumOf {
        it.groupValues[1].toInt() * it.groupValues[2].toInt()
    }.toString()
}