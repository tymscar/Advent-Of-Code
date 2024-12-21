package com.tymscar.day21.part1

import java.util.*

private enum class DirectionPadKey() { UP, DOWN, LEFT, RIGHT, A; }

private enum class KeypadKey() {
    ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, ZERO, A;

    fun getDirectionPadKey(to: KeypadKey): DirectionPadKey = when (this) {
        ONE -> when (to) {
            TWO -> DirectionPadKey.RIGHT
            FOUR -> DirectionPadKey.UP
            else -> throw IllegalArgumentException("Invalid path")
        }

        TWO -> when (to) {
            ONE -> DirectionPadKey.LEFT
            FIVE -> DirectionPadKey.UP
            THREE -> DirectionPadKey.RIGHT
            ZERO -> DirectionPadKey.DOWN
            else -> throw IllegalArgumentException("Invalid path")
        }

        THREE -> when (to) {
            TWO -> DirectionPadKey.LEFT
            SIX -> DirectionPadKey.UP
            A -> DirectionPadKey.DOWN
            else -> throw IllegalArgumentException("Invalid path")
        }

        FOUR -> when (to) {
            ONE -> DirectionPadKey.DOWN
            FIVE -> DirectionPadKey.RIGHT
            SEVEN -> DirectionPadKey.UP
            else -> throw IllegalArgumentException("Invalid path")
        }

        FIVE -> when (to) {
            FOUR -> DirectionPadKey.LEFT
            SIX -> DirectionPadKey.RIGHT
            EIGHT -> DirectionPadKey.UP
            TWO -> DirectionPadKey.DOWN
            else -> throw IllegalArgumentException("Invalid path")
        }

        SIX -> when (to) {
            FIVE -> DirectionPadKey.LEFT
            NINE -> DirectionPadKey.UP
            THREE -> DirectionPadKey.DOWN
            else -> throw IllegalArgumentException("Invalid path")
        }

        SEVEN -> when (to) {
            FOUR -> DirectionPadKey.DOWN
            EIGHT -> DirectionPadKey.RIGHT
            else -> throw IllegalArgumentException("Invalid path")
        }

        EIGHT -> when (to) {
            SEVEN -> DirectionPadKey.LEFT
            NINE -> DirectionPadKey.RIGHT
            FIVE -> DirectionPadKey.DOWN
            else -> throw IllegalArgumentException("Invalid path")
        }

        NINE -> when (to) {
            EIGHT -> DirectionPadKey.LEFT
            SIX -> DirectionPadKey.DOWN
            else -> throw IllegalArgumentException("Invalid path")
        }

        ZERO -> when (to) {
            TWO -> DirectionPadKey.UP
            A -> DirectionPadKey.RIGHT
            else -> throw IllegalArgumentException("Invalid path")
        }

        A -> when (to) {
            ZERO -> DirectionPadKey.LEFT
            THREE -> DirectionPadKey.UP
            else -> throw IllegalArgumentException("Invalid path")
        }
    }

    fun getNeighbours(): List<KeypadKey> = when (this) {
        ONE -> listOf(TWO, FOUR)
        TWO -> listOf(ONE, FIVE, THREE, ZERO)
        THREE -> listOf(TWO, SIX, A)
        FOUR -> listOf(ONE, FIVE, SEVEN)
        FIVE -> listOf(FOUR, SIX, EIGHT, TWO)
        SIX -> listOf(FIVE, NINE, THREE)
        SEVEN -> listOf(FOUR, EIGHT)
        EIGHT -> listOf(SEVEN, FIVE, NINE)
        NINE -> listOf(EIGHT, SIX)
        ZERO -> listOf(TWO, A)
        A -> listOf(ZERO, THREE)
    }

    companion object {
        fun fromChar(c: Char): KeypadKey {
            return when (c) {
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
}

private fun getShortestKeypadPaths(start: KeypadKey, end: KeypadKey): List<List<DirectionPadKey>> {
    val visited = HashSet<KeypadKey>()
    val costs = HashMap<KeypadKey, Int>()
    val queue = PriorityQueue<Pair<KeypadKey, Int>>(compareBy { it.second })
    val parents = HashMap<KeypadKey, Set<KeypadKey>>()

    queue.add(start to 0)
    while (queue.isNotEmpty()) {
        val (currPos, currCost) = queue.poll()
        if (currPos == end) continue

        if (visited.contains(currPos)) continue
        visited.add(currPos)

        val neighbours = currPos.getNeighbours()
        for (neighbour in neighbours) {
            if (visited.contains(neighbour)) continue

            val nextCost = currCost + 1
            val currParents = parents.getOrDefault(neighbour, emptySet())
            if (nextCost < costs.getOrDefault(neighbour, Int.MAX_VALUE)) {
                parents[neighbour] = currParents + currPos
                costs[neighbour] = nextCost
                queue.add(neighbour to nextCost)
            } else if (nextCost == costs.getOrDefault(neighbour, Int.MAX_VALUE)) {
                parents[neighbour] = currParents + currPos
            }
        }
    }


    fun constructPaths(current: KeypadKey, path: List<KeypadKey>): List<List<KeypadKey>> {
        if (current == start) return listOf(path)
        return parents[current]!!.flatMap { parent -> constructPaths(parent, listOf(parent) + path) }
    }

    val shortestPaths = constructPaths(end, listOf(end))

    return shortestPaths.map { it.windowed(2).map { (from, to) -> from.getDirectionPadKey(to) } + DirectionPadKey.A }
}

private fun getShortestDirectionPadPaths(start: DirectionPadKey, end: DirectionPadKey): List<List<DirectionPadKey>> =
    when (start) {
        DirectionPadKey.UP -> when (end) {
            DirectionPadKey.UP -> listOf(
                listOf(DirectionPadKey.A)
            )

            DirectionPadKey.A -> listOf(
                listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)
            )

            DirectionPadKey.LEFT -> listOf(
                listOf(DirectionPadKey.DOWN, DirectionPadKey.LEFT, DirectionPadKey.A)
            )

            DirectionPadKey.DOWN -> listOf(
                listOf(DirectionPadKey.DOWN, DirectionPadKey.A)
            )

            DirectionPadKey.RIGHT -> listOf(
                listOf(DirectionPadKey.DOWN, DirectionPadKey.RIGHT, DirectionPadKey.A),
                listOf(DirectionPadKey.RIGHT, DirectionPadKey.DOWN, DirectionPadKey.A)
            )
        }

        DirectionPadKey.A -> when (end) {

            DirectionPadKey.UP -> listOf(
                listOf(DirectionPadKey.LEFT, DirectionPadKey.A)
            )

            DirectionPadKey.A -> listOf(
                listOf(DirectionPadKey.A)
            )

            DirectionPadKey.LEFT -> listOf(
                listOf(DirectionPadKey.LEFT, DirectionPadKey.DOWN, DirectionPadKey.LEFT, DirectionPadKey.A),
                listOf(DirectionPadKey.DOWN, DirectionPadKey.LEFT, DirectionPadKey.LEFT, DirectionPadKey.A)
            )

            DirectionPadKey.DOWN -> listOf(
                listOf(DirectionPadKey.LEFT, DirectionPadKey.DOWN, DirectionPadKey.A),
                listOf(DirectionPadKey.DOWN, DirectionPadKey.LEFT, DirectionPadKey.A)
            )

            DirectionPadKey.RIGHT -> listOf(
                listOf(DirectionPadKey.DOWN, DirectionPadKey.A)
            )
        }

        DirectionPadKey.LEFT -> when (end) {
            DirectionPadKey.UP -> listOf(
                listOf(DirectionPadKey.RIGHT, DirectionPadKey.UP, DirectionPadKey.A)
            )

            DirectionPadKey.A -> listOf(
                listOf(DirectionPadKey.RIGHT, DirectionPadKey.UP, DirectionPadKey.RIGHT, DirectionPadKey.A),
                listOf(DirectionPadKey.RIGHT, DirectionPadKey.RIGHT, DirectionPadKey.UP, DirectionPadKey.A)
            )

            DirectionPadKey.LEFT -> listOf(
                listOf(DirectionPadKey.A)
            )

            DirectionPadKey.DOWN -> listOf(
                listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)
            )

            DirectionPadKey.RIGHT -> listOf(
                listOf(DirectionPadKey.RIGHT, DirectionPadKey.RIGHT, DirectionPadKey.A),
            )
        }

        DirectionPadKey.DOWN -> when (end) {
            DirectionPadKey.UP -> listOf(
                listOf(DirectionPadKey.UP, DirectionPadKey.A)
            )

            DirectionPadKey.A -> listOf(
                listOf(DirectionPadKey.UP, DirectionPadKey.RIGHT, DirectionPadKey.A),
                listOf(DirectionPadKey.RIGHT, DirectionPadKey.UP, DirectionPadKey.A)
            )

            DirectionPadKey.LEFT -> listOf(
                listOf(DirectionPadKey.LEFT, DirectionPadKey.A),
            )

            DirectionPadKey.DOWN -> listOf(
                listOf(DirectionPadKey.A)
            )

            DirectionPadKey.RIGHT -> listOf(
                listOf(DirectionPadKey.RIGHT, DirectionPadKey.A)
            )
        }

        DirectionPadKey.RIGHT -> when (end) {
            DirectionPadKey.UP -> listOf(
                listOf(DirectionPadKey.UP, DirectionPadKey.LEFT, DirectionPadKey.A),
                listOf(DirectionPadKey.LEFT, DirectionPadKey.UP, DirectionPadKey.A)
            )

            DirectionPadKey.A -> listOf(
                listOf(DirectionPadKey.UP, DirectionPadKey.A),
            )

            DirectionPadKey.LEFT -> listOf(
                listOf(DirectionPadKey.LEFT, DirectionPadKey.LEFT, DirectionPadKey.A),
            )

            DirectionPadKey.DOWN -> listOf(
                listOf(DirectionPadKey.LEFT, DirectionPadKey.A)
            )

            DirectionPadKey.RIGHT -> listOf(
                listOf(DirectionPadKey.A)
            )
        }
    }

private fun List<DirectionPadKey>.getControls(): List<List<DirectionPadKey>> = this
    .windowed(2)
    .fold(listOf(listOf<DirectionPadKey>())) { list, currentPair ->
        val nextPaths = getShortestDirectionPadPaths(currentPair.first(), currentPair.last())
        list.flatMap { path -> nextPaths.map { path + it } }
    }

private fun List<List<DirectionPadKey>>.getNextRobotInstructions(): List<List<DirectionPadKey>> {
    val nextPaths = this.flatMap { (listOf(DirectionPadKey.A) + it).getControls() }
    val minimumLength = nextPaths.minOf { it.count() }
    return nextPaths.filter { it.count() == minimumLength }
}

fun getComplexity(input: String): Int {
    val firstRobotInstructions = "A$input"
        .map(KeypadKey::fromChar)
        .windowed(2)
        .fold(listOf(listOf<DirectionPadKey>())) { list, currentPair ->
            val nextPaths = getShortestKeypadPaths(currentPair.first(), currentPair.last())
            list.flatMap { path -> nextPaths.map { path + it } }
        }

    val secondRobotInstructions = firstRobotInstructions.getNextRobotInstructions()
    val thirdRobotInstructions = secondRobotInstructions.getNextRobotInstructions()

    return thirdRobotInstructions.first().count() * input.dropLast(1).toInt()
}

fun solve(input: String): String = input
    .lines()
    .sumOf(::getComplexity)
    .toString()
