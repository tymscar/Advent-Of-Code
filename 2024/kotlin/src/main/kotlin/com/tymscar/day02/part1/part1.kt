package com.tymscar.day02.part1

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

fun solve(input: String): String {
    val reports = input.split("\n").map { s -> s.split(" ").map { it.toInt() } }
    val safeReports = reports.count(::isReportSafe)

    return safeReports.toString()
}