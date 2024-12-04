package com.tymscar.day05

import java.io.File
import com.tymscar.day05.part1.solve as part1
import com.tymscar.day05.part2.solve as part2

fun solve() {
    var input: String = File("src/main/kotlin/com/tymscar/day05/input.txt").readText()

    println("Day 05: ")
    println("Part 1: ${part1(input)}")
    println("Part 2: ${part2(input)}")
}
