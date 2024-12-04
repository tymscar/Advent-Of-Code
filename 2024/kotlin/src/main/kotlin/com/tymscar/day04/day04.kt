package com.tymscar.day04

import java.io.File
import com.tymscar.day04.part1.solve as part1
import com.tymscar.day04.part2.solve as part2

fun solve() {
    var input: String = File("src/main/kotlin/com/tymscar/day04/input.txt").readText()

    println("Day 04: ")
    println("Part 1: ${part1(input)}")
    println("Part 2: ${part2(input)}")
}