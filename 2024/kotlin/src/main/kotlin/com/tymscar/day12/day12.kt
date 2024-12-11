package com.tymscar.day12

import java.io.File
import com.tymscar.day12.part1.solve as part1
import com.tymscar.day12.part2.solve as part2

fun solve() {
    var input: String = File("src/main/kotlin/com/tymscar/day12/input.txt").readText()

    println("Day 12: ")
    println("Part 1: ${part1(input)}")
    println("Part 2: ${part2(input)}")
}
