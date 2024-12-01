package com.tymscar.day01.part1

import kotlin.math.abs

data class HistorianList(val left: MutableList<String>, val right: MutableList<String>) {
    fun sort() {
        left.sort()
        right.sort()
    }

    fun getDifferences(): List<Int> {
        this.sort()
        return left.mapIndexed { index, s -> abs(s.toInt() - right[index].toInt()) }
    }
}

fun solve(input: String): String {
    var list: HistorianList = input.split("\n").map { it.split(Regex("\\s+")) }
        .fold(HistorianList(mutableListOf(), mutableListOf())) { acc, item ->
            acc.left.add(item[0])
            acc.right.add(item[1])
            acc
        }

    return list.getDifferences().sum().toString()
}