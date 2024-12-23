package com.tymscar

import com.tymscar.day01.solve as day01
import com.tymscar.day02.solve as day02
import com.tymscar.day03.solve as day03
import com.tymscar.day04.solve as day04
import com.tymscar.day05.solve as day05
import com.tymscar.day06.solve as day06
import com.tymscar.day07.solve as day07
import com.tymscar.day08.solve as day08
import com.tymscar.day09.solve as day09
import com.tymscar.day10.solve as day10
import com.tymscar.day11.solve as day11
import com.tymscar.day12.solve as day12
import com.tymscar.day13.solve as day13
import com.tymscar.day14.solve as day14
import com.tymscar.day15.solve as day15
import com.tymscar.day16.solve as day16
import com.tymscar.day17.solve as day17
import com.tymscar.day18.solve as day18
import com.tymscar.day19.solve as day19
import com.tymscar.day20.solve as day20
import com.tymscar.day21.solve as day21
import com.tymscar.day22.solve as day22
import com.tymscar.day23.solve as day23
import com.tymscar.day24.solve as day24
import com.tymscar.day25.solve as day25


data class Answer(val answer: String, val expected: String, val time: Long)
data class Solution(val name: String, val part1Answer: Answer, val part2Answer: Answer)
private enum class RowType { HEADER, TITLE, DATA }


private fun getAnswerValidEmoji(answer: Answer) = if (answer.answer == answer.expected) "✅" else "❎"

private fun getTimeStrings(time: Long): Pair<String, String> {
    val milliseconds = time % 1000
    val seconds = (time / 1000) % 60
    val minutes = (time / (1000 * 60)) % 60
    if (minutes > 0) return minutes.toString() to "m"
    if (seconds > 0) return seconds.toString() to "s"
    return milliseconds.toString() to "ms"
}

private fun printAsciiTable(days: List<() -> Solution>) {
    val headers: List<Pair<String, String?>> = listOf("Day" to null, "Part 1" to null, "Part 2" to null, "Time" to null)
    val solutions = days.map { it() }

    val rows = solutions.map { solution ->
        listOf(
            solution.name to null,
            solution.part1Answer.answer.toString() to getAnswerValidEmoji(solution.part1Answer),
            solution.part2Answer.answer.toString() to getAnswerValidEmoji(solution.part2Answer),
            getTimeStrings(solution.part1Answer.time + solution.part2Answer.time)
        )
    }

    val columnWidths = headers.mapIndexed { index, header ->
        maxOf(
            header.first.length,
            rows.maxOf { it[index].first.length + 3 + (it[index].second?.length ?: -3) })
    }


    fun formatRow(cells: List<Pair<String, String?>>, rowType: RowType): String {
        return cells.mapIndexed() { index, cell ->
            when (rowType) {
                RowType.TITLE -> {
                    val width = columnWidths.sum() + columnWidths.count() * 2 + 1
                    val padding = (width - cell.first.length) / 2
                    " ".repeat(padding) + cell.first + " ".repeat(width - cell.first.length - padding)
                }

                RowType.HEADER -> {
                    cell.first.padEnd(columnWidths[index] + (cell.second?.length ?: 0))
                }

                RowType.DATA -> {
                    if (cell.second != null) {
                        val size = when (cell.second) {
                            "✅", "❎" -> cell.first.length + cell.second!!.length + 1
                            else -> cell.first.length + cell.second!!.length
                        }
                        "${cell.first}${" ".repeat(columnWidths[index] - size)}${cell.second}"
                    } else cell.first.padEnd(columnWidths[index])
                }
            }
        }.joinToString(" ║ ", prefix = "║ ", postfix = " ║")
    }

    val topSeparator = columnWidths.joinToString("═══", prefix = "╔═", postfix = "═╗") { "═".repeat(it) }
    val botSeparator = columnWidths.joinToString("═╩═", prefix = "╚═", postfix = "═╝") { "═".repeat(it) }
    val headSeparator = columnWidths.joinToString("═╦═", prefix = "╠═", postfix = "═╣") { "═".repeat(it) }
    val midSeparator = columnWidths.joinToString("═╬═", prefix = "╠═", postfix = "═╣") { "═".repeat(it) }

    println(topSeparator)
    println(formatRow(listOf("\uD83E\uDD84 Advent of Code 2024 \uD83E\uDD84" to null), RowType.TITLE))
    println(headSeparator)
    println(formatRow(headers, RowType.HEADER))
    println(midSeparator)
    rows.forEach { println(formatRow(it, RowType.DATA)) }
    println(botSeparator)
}

fun main() {
    printAsciiTable(
        listOf(
            ::day01, ::day02, ::day03, ::day04, ::day05,
            ::day06, ::day07, ::day08, ::day09, ::day10,
            ::day11, ::day12, ::day13, ::day14, ::day15,
            ::day16, ::day17, ::day18, ::day19, ::day20,
            ::day21, ::day22, ::day23, ::day24, ::day25,
        )
    )
}