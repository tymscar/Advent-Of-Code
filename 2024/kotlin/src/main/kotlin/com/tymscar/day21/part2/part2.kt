package com.tymscar.day21.part2

private enum class DirectionPadKey() { UP, DOWN, LEFT, RIGHT, A; }

private enum class KeypadKey() {
    ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, ZERO, A;

    companion object {
        fun fromChar(c: Char): KeypadKey = when (c) {
            '1' -> ONE
            '2' -> TWO
            '3' -> THREE
            '4' -> FOUR
            '5' -> FIVE
            '6' -> SIX
            '7' -> SEVEN
            '8' -> EIGHT
            '9' -> NINE
            '0' -> ZERO
            'A' -> A
            else -> throw IllegalArgumentException("Invalid keypad key: $c")
        }
    }
}

private fun getShortestKeypadPath(start: KeypadKey, end: KeypadKey): List<DirectionPadKey> = when (start to end) {
    KeypadKey.A to KeypadKey.ZERO -> listOf(DirectionPadKey.LEFT, DirectionPadKey.A)

    KeypadKey.A to KeypadKey.ONE -> listOf(
        DirectionPadKey.UP,
        DirectionPadKey.LEFT,
        DirectionPadKey.LEFT,
        DirectionPadKey.A
    )

    KeypadKey.A to KeypadKey.THREE -> listOf(DirectionPadKey.UP, DirectionPadKey.A)

    KeypadKey.A to KeypadKey.FOUR -> listOf(
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.LEFT,
        DirectionPadKey.LEFT,
        DirectionPadKey.A
    )

    KeypadKey.A to KeypadKey.SEVEN -> listOf(
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.LEFT,
        DirectionPadKey.LEFT,
        DirectionPadKey.A
    )

    KeypadKey.A to KeypadKey.EIGHT -> listOf(
        DirectionPadKey.LEFT,
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.A
    )

    KeypadKey.A to KeypadKey.NINE -> listOf(
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.A
    )

    KeypadKey.ZERO to KeypadKey.TWO -> listOf(DirectionPadKey.UP, DirectionPadKey.A)
    KeypadKey.ZERO to KeypadKey.A -> listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)

    KeypadKey.ONE to KeypadKey.THREE -> listOf(
        DirectionPadKey.RIGHT,
        DirectionPadKey.RIGHT,
        DirectionPadKey.A
    )

    KeypadKey.ONE to KeypadKey.SEVEN -> listOf(DirectionPadKey.UP, DirectionPadKey.UP, DirectionPadKey.A)

    KeypadKey.ONE to KeypadKey.NINE -> listOf(
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.RIGHT,
        DirectionPadKey.RIGHT,
        DirectionPadKey.A
    )

    KeypadKey.TWO to KeypadKey.NINE -> listOf(
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.RIGHT,
        DirectionPadKey.A
    )

    KeypadKey.THREE to KeypadKey.ONE -> listOf(
        DirectionPadKey.LEFT,
        DirectionPadKey.LEFT,
        DirectionPadKey.A
    )

    KeypadKey.THREE to KeypadKey.FIVE -> listOf(
        DirectionPadKey.LEFT,
        DirectionPadKey.UP,
        DirectionPadKey.A
    )

    KeypadKey.THREE to KeypadKey.SIX -> listOf(DirectionPadKey.UP, DirectionPadKey.A)

    KeypadKey.THREE to KeypadKey.SEVEN -> listOf(
        DirectionPadKey.LEFT,
        DirectionPadKey.LEFT,
        DirectionPadKey.UP,
        DirectionPadKey.UP,
        DirectionPadKey.A
    )

    KeypadKey.THREE to KeypadKey.A -> listOf(DirectionPadKey.DOWN, DirectionPadKey.A)

    KeypadKey.FOUR to KeypadKey.ONE -> listOf(DirectionPadKey.DOWN, DirectionPadKey.A)
    KeypadKey.FOUR to KeypadKey.FIVE -> listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)

    KeypadKey.FOUR to KeypadKey.EIGHT -> listOf(
        DirectionPadKey.UP,
        DirectionPadKey.RIGHT,
        DirectionPadKey.A
    )

    KeypadKey.FIVE to KeypadKey.A -> listOf(
        DirectionPadKey.DOWN,
        DirectionPadKey.DOWN,
        DirectionPadKey.RIGHT,
        DirectionPadKey.A
    )

    KeypadKey.FIVE to KeypadKey.SIX -> listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)

    KeypadKey.SIX to KeypadKey.A -> listOf(
        DirectionPadKey.DOWN,
        DirectionPadKey.DOWN,
        DirectionPadKey.A
    )

    KeypadKey.SEVEN to KeypadKey.SIX -> listOf(
        DirectionPadKey.DOWN,
        DirectionPadKey.RIGHT,
        DirectionPadKey.RIGHT,
        DirectionPadKey.A
    )

    KeypadKey.SEVEN to KeypadKey.THREE -> listOf(
        DirectionPadKey.DOWN,
        DirectionPadKey.DOWN,
        DirectionPadKey.RIGHT,
        DirectionPadKey.RIGHT,
        DirectionPadKey.A
    )

    KeypadKey.SEVEN to KeypadKey.EIGHT -> listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)

    KeypadKey.SEVEN to KeypadKey.NINE -> listOf(
        DirectionPadKey.RIGHT,
        DirectionPadKey.RIGHT,
        DirectionPadKey.A
    )

    KeypadKey.EIGHT to KeypadKey.ZERO -> listOf(
        DirectionPadKey.DOWN,
        DirectionPadKey.DOWN,
        DirectionPadKey.DOWN,
        DirectionPadKey.A
    )

    KeypadKey.EIGHT to KeypadKey.THREE -> listOf(
        DirectionPadKey.DOWN,
        DirectionPadKey.DOWN,
        DirectionPadKey.RIGHT,
        DirectionPadKey.A
    )

    KeypadKey.EIGHT to KeypadKey.FIVE -> listOf(
        DirectionPadKey.DOWN,
        DirectionPadKey.A
    )

    KeypadKey.EIGHT to KeypadKey.NINE -> listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)

    KeypadKey.NINE to KeypadKey.A -> listOf(
        DirectionPadKey.DOWN,
        DirectionPadKey.DOWN,
        DirectionPadKey.DOWN,
        DirectionPadKey.A
    )

    KeypadKey.NINE to KeypadKey.THREE -> listOf(
        DirectionPadKey.DOWN,
        DirectionPadKey.DOWN,
        DirectionPadKey.A
    )

    KeypadKey.NINE to KeypadKey.EIGHT -> listOf(DirectionPadKey.LEFT, DirectionPadKey.A)

    KeypadKey.NINE to KeypadKey.SEVEN -> listOf(
        DirectionPadKey.LEFT,
        DirectionPadKey.LEFT,
        DirectionPadKey.A
    )

    else -> throw IllegalArgumentException("Invalid path from $start to $end")
}

private fun getShortestDirectionPadPath(start: DirectionPadKey, end: DirectionPadKey) = when (start to end) {
    DirectionPadKey.A to DirectionPadKey.UP ->
        listOf(DirectionPadKey.LEFT, DirectionPadKey.A)

    DirectionPadKey.A to DirectionPadKey.LEFT ->
        listOf(DirectionPadKey.DOWN, DirectionPadKey.LEFT, DirectionPadKey.LEFT, DirectionPadKey.A)

    DirectionPadKey.A to DirectionPadKey.DOWN ->
        listOf(DirectionPadKey.LEFT, DirectionPadKey.DOWN, DirectionPadKey.A)

    DirectionPadKey.A to DirectionPadKey.RIGHT ->
        listOf(DirectionPadKey.DOWN, DirectionPadKey.A)

    DirectionPadKey.UP to DirectionPadKey.A ->
        listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)

    DirectionPadKey.UP to DirectionPadKey.LEFT ->
        listOf(DirectionPadKey.DOWN, DirectionPadKey.LEFT, DirectionPadKey.A)

    DirectionPadKey.UP to DirectionPadKey.DOWN ->
        listOf(DirectionPadKey.DOWN, DirectionPadKey.A)

    DirectionPadKey.UP to DirectionPadKey.RIGHT ->
        listOf(DirectionPadKey.DOWN, DirectionPadKey.RIGHT, DirectionPadKey.A)

    DirectionPadKey.LEFT to DirectionPadKey.A ->
        listOf(DirectionPadKey.RIGHT, DirectionPadKey.RIGHT, DirectionPadKey.UP, DirectionPadKey.A)

    DirectionPadKey.LEFT to DirectionPadKey.UP ->
        listOf(DirectionPadKey.RIGHT, DirectionPadKey.UP, DirectionPadKey.A)

    DirectionPadKey.LEFT to DirectionPadKey.DOWN ->
        listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)

    DirectionPadKey.LEFT to DirectionPadKey.RIGHT ->
        listOf(DirectionPadKey.RIGHT, DirectionPadKey.RIGHT, DirectionPadKey.A)

    DirectionPadKey.DOWN to DirectionPadKey.A ->
        listOf(DirectionPadKey.UP, DirectionPadKey.RIGHT, DirectionPadKey.A)

    DirectionPadKey.DOWN to DirectionPadKey.UP ->
        listOf(DirectionPadKey.UP, DirectionPadKey.A)

    DirectionPadKey.DOWN to DirectionPadKey.LEFT ->
        listOf(DirectionPadKey.LEFT, DirectionPadKey.A)

    DirectionPadKey.DOWN to DirectionPadKey.RIGHT ->
        listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)

    DirectionPadKey.RIGHT to DirectionPadKey.A ->
        listOf(DirectionPadKey.UP, DirectionPadKey.A)

    DirectionPadKey.RIGHT to DirectionPadKey.UP ->
        listOf(DirectionPadKey.LEFT, DirectionPadKey.UP, DirectionPadKey.A)

    DirectionPadKey.RIGHT to DirectionPadKey.DOWN ->
        listOf(DirectionPadKey.LEFT, DirectionPadKey.A)

    DirectionPadKey.RIGHT to DirectionPadKey.LEFT ->
        listOf(DirectionPadKey.LEFT, DirectionPadKey.LEFT, DirectionPadKey.A)

    else -> throw IllegalArgumentException("Invalid path from $start to $end")
}

private fun List<DirectionPadKey>.getNextLevel(): List<DirectionPadKey> {
    var currPos = DirectionPadKey.A
    val nextLevel = mutableListOf<DirectionPadKey>()
    this.forEach { key ->
        if (key == currPos) {
            nextLevel.add(DirectionPadKey.A)
        } else {
            nextLevel.addAll(getShortestDirectionPadPath(currPos, key))
        }
        currPos = key
    }
    return nextLevel
}

private fun List<DirectionPadKey>.split(): List<List<DirectionPadKey>> {
    val nextPaths = mutableListOf<List<DirectionPadKey>>()
    var currentPath = mutableListOf<DirectionPadKey>()
    for (key in this) {
        if (key == DirectionPadKey.A) {
            nextPaths.add(currentPath)
            currentPath = mutableListOf()
        } else {
            currentPath.add(key)
        }
    }
    return nextPaths
}

fun getComplexity(input: String): Long {
    var currentPos = KeypadKey.A
    var robotInstructions = mutableListOf<DirectionPadKey>()
    input.forEach {
        val nextPos = KeypadKey.fromChar(it)
        val nextPath = getShortestKeypadPath(currentPos, nextPos)
        robotInstructions.addAll(nextPath)
        currentPos = nextPos
    }

    var frequency = robotInstructions
        .split()
        .map { it + listOf(DirectionPadKey.A) }
        .groupBy { it }
        .mapValues { it.value.count().toLong() } as LinkedHashMap

    repeat(25) {
        val newFrequency = LinkedHashMap<List<DirectionPadKey>, Long>()
        for ((key, value) in frequency) {
            val nextCommands = key.getNextLevel()
            val nextParts = nextCommands
                .split()
                .map { it + listOf(DirectionPadKey.A) }
            nextParts.forEach { newFrequency[it] = newFrequency.getOrDefault(it, 0L) + value }
        }
        frequency = newFrequency
    }

    val finalMinLength = frequency.map { it.key.count() * it.value }.sum()
    return finalMinLength * input.dropLast(1).toLong()
}

fun solve(input: String): String = input
    .lines()
    .sumOf(::getComplexity)
    .toString()
