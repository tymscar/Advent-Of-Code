package com.tymscar.day01.part2

data class HistorianList(val left: MutableList<Int>, val right: MutableList<Int>) {
    fun getSimilarity(): Int {
        return left.fold(0) { acc, leftItem ->
            acc + right.count { it == leftItem } * leftItem
        }
    }
}

fun solve(input: String): String {
    var list: HistorianList = input.split("\n")
        .map { it.split(Regex("\\s+")) }
        .fold(HistorianList(mutableListOf(), mutableListOf())) { acc, item ->
            acc.left.add(item[0].toInt())
            acc.right.add(item[1].toInt())
            acc
        }

    return list.getSimilarity().toString()
}