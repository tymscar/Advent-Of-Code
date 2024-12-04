package com.tymscar.day{{DAY}}

import java.io.File
import com.tymscar.day{{DAY}}.part1.solve as part1
import com.tymscar.day{{DAY}}.part2.solve as part2

fun solve() {
    var input: String = File("src/main/kotlin/com/tymscar/day{{DAY}}/input.txt").readText()

    println("Day {{DAY}}: ")
    println("Part 1: ${part1(input)}")
    println("Part 2: ${part2(input)}")
}
