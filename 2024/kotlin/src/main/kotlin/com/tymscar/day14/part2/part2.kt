package com.tymscar.day14.part2

private data class Vec2(val x: Int, val y: Int)
private data class Robot(val position: Vec2, val velocity: Vec2) {
    fun getPosAfter(time: Int, mapSize: Vec2): Vec2 {
        val newX = (position.x + velocity.x * time) % mapSize.x
        val newY = (position.y + velocity.y * time) % mapSize.y
        return Vec2(
            if (newX < 0) mapSize.x + newX else newX,
            if (newY < 0) mapSize.y + newY else newY
        )
    }
}

private fun parseRobot(line: String): Robot {
    fun getVec2(line: String, type: String): Vec2 = Regex("""${type}=(-?\d+),(-?\d+)""")
        .find(line)!!
        .groupValues
        .drop(1)
        .let { Vec2(it[0].toInt(), it[1].toInt()) }

    return Robot(
        position = getVec2(line, "p"),
        velocity = getVec2(line, "v")
    )
}

private fun getEntropy(time: Int, robots: List<Robot>, mapSize: Vec2): Int =
    getCountInQuadrants(robots.map { it.getPosAfter(time, mapSize) }, mapSize).fold(1, Int::times)


private fun getCountInQuadrants(positions: List<Vec2>, mapSize: Vec2): List<Int> {
    fun getCountIn(xRange: IntRange, yRange: IntRange): Int = positions.count { it.x in xRange && it.y in yRange }

    return listOf(
        getCountIn(
            0 until mapSize.x / 2,
            0 until mapSize.y / 2
        ),
        getCountIn(
            mapSize.x / 2 + 1 until mapSize.x,
            0 until mapSize.y / 2
        ),
        getCountIn(
            0 until mapSize.x / 2,
            mapSize.y / 2 + 1 until mapSize.y
        ),
        getCountIn(
            mapSize.x / 2 + 1 until mapSize.x,
            mapSize.y / 2 + 1 until mapSize.y
        )
    )
}

fun solve(input: String): String {
    val mapSize = Vec2(101, 103)
    val robots = input
        .lines()
        .map(::parseRobot)

    var time = 0
    var lowestEntropyTime = 0
    var timeSinceLowerEntropy = 0
    var lowestEntropy = getEntropy(lowestEntropyTime, robots, mapSize)
    while (timeSinceLowerEntropy < 10_000) {
        val entropy = getEntropy(time, robots, mapSize)
        if (entropy < lowestEntropy) {
            lowestEntropy = entropy
            lowestEntropyTime = time
            timeSinceLowerEntropy = 0
        } else {
            timeSinceLowerEntropy++
        }
        time++
    }

    return lowestEntropyTime.toString()
}
