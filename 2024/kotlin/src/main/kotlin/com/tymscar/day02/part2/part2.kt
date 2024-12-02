package com.tymscar.day02.part2

import kotlin.math.abs

fun isReportSafe(report: List<Int>): Boolean {
    val windowed = report.windowed(2)
    val allIncreasing = windowed.map { (l, r) -> l < r}.all{it}
    val allDecreasing = windowed.map { (l, r) -> l > r}.all{it}
    val smallDifference = windowed.map { (l, r) -> abs(r - l)}.all {
        it >= 1 && it <= 3
    }
    return (allIncreasing || allDecreasing) && smallDifference
}

fun isReportSafeDampened(report: List<Int>): Boolean {
    val dampenedLists = report.indices.map { report.filterIndexed { i, _ -> i != it } }
    return dampenedLists.count(::isReportSafe) > 0 || isReportSafe(report)
}

fun solve(input: String): String {
    val reports = input.split("\n").map { s -> s.split(" ").map { it.toInt() } }
    val safeReports = reports.count(::isReportSafeDampened)

    return safeReports.toString()
}