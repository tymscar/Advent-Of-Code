package com.tymscar.day04

import com.tymscar.Answer
import com.tymscar.Solution
import java.io.File
import kotlin.system.measureTimeMillis
import kotlinx.coroutines.*

import com.tymscar.day04.part1.solve as part1
import com.tymscar.day04.part2.solve as part2

fun solve(): Solution {
    val input: String = File("src/main/kotlin/com/tymscar/day04/input.txt").readText()
    val name: String = "Day 04: Ceres Search"
    val part1Expected: String = "2562"
    val part2Expected: String = "1902"


    lateinit var part1Answer: Answer
    lateinit var part2Answer: Answer
    runBlocking {
        val part1Deffered = async {
            measureTimeMillis {
                part1(input)
            } to part1(input)
        }
        part1Answer = Answer(part1Deffered.await().second, part1Expected, part1Deffered.await().first)

        val part2Deferred = async {
            measureTimeMillis {
                part2(input)
            } to part2(input)
        }
        part2Answer = Answer(part2Deferred.await().second, part2Expected, part2Deferred.await().first)
    }

    return Solution(name, part1Answer, part2Answer)
}