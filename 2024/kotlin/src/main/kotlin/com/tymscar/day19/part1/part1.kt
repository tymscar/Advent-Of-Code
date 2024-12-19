package com.tymscar.day19.part1

private fun getValidDesigns(designs: List<String>, towels: List<String>): List<String> = designs
    .filter {
        Regex("""^(${towels.joinToString("|")})+$""")
            .matches(it)
    }

fun solve(input: String): String {
    val towels = input
        .split("\n\n")[0]
            .split(", ")
    val designs = input
        .split("\n\n")[1]
            .lines()

    return getValidDesigns(designs, towels)
        .count()
        .toString()
}
