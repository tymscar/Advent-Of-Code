package com.tymscar.day19.part2

private fun isValidDesign(design: String, towels: List<String>): Boolean =
    Regex("""^(${towels.joinToString("|")})+$""")
        .matches(design)

private fun waysToMake(
    design: String,
    towels: List<String>,
    memo: HashMap<String, Long>
): Long {
    if (memo.contains(design)) return memo[design]!!
    if (!isValidDesign(design, towels)) return 0

    val result = towels.sumOf {
        when {
            design == it -> 1
            design.startsWith(it) -> waysToMake(design.removePrefix(it), towels, memo)
            else -> 0
        }
    }

    memo[design] = result
    return result
}

fun solve(input: String): String {
    val towels = input
        .split("\n\n")[0]
        .split(", ")
    val designs = input
        .split("\n\n")[1]
        .lines()

    val memo = HashMap<String, Long>()

    return designs
        .sumOf { waysToMake(it, towels, memo) }
        .toString()
}
