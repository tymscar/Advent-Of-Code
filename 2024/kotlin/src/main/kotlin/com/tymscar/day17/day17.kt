package com.tymscar.day17

import java.io.File
import com.tymscar.day17.part1.solve as part1
import com.tymscar.day17.part2.solve as part2

fun solve() {
    var input: String = File("src/main/kotlin/com/tymscar/day17/input.txt").readText()

    println("Day 17: ")
    println("Part 1: ${part1(input)}")
    println("Part 2: ${part2(input)}")
}
