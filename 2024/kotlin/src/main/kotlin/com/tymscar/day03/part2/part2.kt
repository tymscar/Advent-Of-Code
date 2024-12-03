package com.tymscar.day03.part2

val rangesRegex = Regex("""(?:^|do\(\))(.*?)(?:${'$'}|don't\(\))""")
val mulRegex = Regex("""mul\((\d{1,3}),(\d{1,3})\)""")

fun solve(input: String): String {
    val oneLineInput = input.split("\n").joinToString("")
    val validRanges = rangesRegex
        .findAll(oneLineInput)
        .map { it.groupValues[1] }.toList()
    return validRanges.sumOf {
        mulRegex.findAll(it).sumOf {
            it.groupValues[1].toInt() * it.groupValues[2].toInt()
        }
    }.toString()
}