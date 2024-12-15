package com.tymscar.day15.part2


private enum class EntityType { WALL, ROBOT, BOXL, BOXR, EMPTY }

private enum class Move { UP, DOWN, LEFT, RIGHT }

private data class Position(val x: Int, val y: Int) {
    fun getNextPosition(move: Move): Position = when (move) {
        Move.UP -> Position(x - 1, y)
        Move.DOWN -> Position(x + 1, y)
        Move.LEFT -> Position(x, y - 1)
        Move.RIGHT -> Position(x, y + 1)
    }

    fun getPreviousPosition(move: Move): Position = when (move) {
        Move.UP -> Position(x + 1, y)
        Move.DOWN -> Position(x - 1, y)
        Move.LEFT -> Position(x, y + 1)
        Move.RIGHT -> Position(x, y - 1)
    }

    fun getRightPosition(): Position = Position(x, y + 1)
    fun getLeftPosition(): Position = Position(x, y - 1)
}

private typealias Map = MutableMap<Position, EntityType>

private data class State(val map: Map) {
    private fun getRobotPosition(): Position = map.filterValues { it == EntityType.ROBOT }.keys.first()

    private fun getEntitiesToMoveVertical(direction: Move): List<Position> {
        val initialRobotPosition = getRobotPosition()
        val entities = mutableListOf<Position>()
        if (map[initialRobotPosition.getNextPosition(direction)] == EntityType.WALL) return emptyList()
        var currHorizon = listOf(initialRobotPosition)

        while (true) {
            val anyWalls = currHorizon.any { map[it.getNextPosition(direction)] == EntityType.WALL }
            if (anyWalls) return emptyList()
            entities.addAll(currHorizon)
            val allEmpty = currHorizon.all { map[it.getNextPosition(direction)] == EntityType.EMPTY }
            if (allEmpty) {
                entities.addAll(
                    entities
                        .filter { map[it.getNextPosition(direction)] == EntityType.EMPTY }
                        .map { it.getNextPosition(direction) })
                val result = entities.drop(1).sortedBy { it.x }
                return if (direction == Move.DOWN) result.reversed() else result
            }

            currHorizon = currHorizon
                .map { it.getNextPosition(direction) }
                .filter { map[it] == EntityType.BOXL || map[it] == EntityType.BOXR }
                .flatMap {
                    when (map[it]) {
                        EntityType.BOXL -> listOf(it, it.getRightPosition())
                        EntityType.BOXR -> listOf(it, it.getLeftPosition())
                        else -> throw IllegalArgumentException("Invalid entity")
                    }
                }
                .distinct()
        }
    }

    private fun getEntitiesToMoveHorizontal(direction: Move): List<Position> {
        val entities = mutableListOf<Position>()
        var currPosition = getRobotPosition()
        if (map[currPosition.getNextPosition(direction)] == EntityType.WALL) return emptyList()
        while (map[currPosition] == EntityType.BOXR || map[currPosition] == EntityType.BOXL || map[currPosition] == EntityType.ROBOT) {
            entities.add(currPosition)
            currPosition = currPosition.getNextPosition(direction)
        }
        return if (map[currPosition] == EntityType.EMPTY) entities.reversed() else emptyList()
    }

    fun getEntitiesToMove(direction: Move): List<Position> = when (direction) {
        Move.UP, Move.DOWN -> getEntitiesToMoveVertical(direction)
        Move.LEFT, Move.RIGHT -> getEntitiesToMoveHorizontal(direction)
    }

    private fun applyMoveHorizontal(move: Move, toMove: List<Position>) {
        toMove.forEach { map[it.getNextPosition(move)] = map[it] as EntityType }
        toMove.last().let { map[it] = EntityType.EMPTY }
    }

    private fun applyMoveVertical(move: Move, toMove: List<Position>) {
        val robotPosition = getRobotPosition()
        toMove.forEach {
            val previousPosition = it.getPreviousPosition(move)
            val previousItem = map[previousPosition]
            map[it] = if (!toMove.contains(previousPosition)) {
                if (previousItem == EntityType.ROBOT) EntityType.ROBOT else EntityType.EMPTY
            } else when (previousItem) {
                EntityType.WALL -> EntityType.EMPTY
                else -> previousItem
            } as EntityType
        }
        map[robotPosition] = EntityType.EMPTY
    }

    fun applyMove(move: Move) {
        val toMove = getEntitiesToMove(move)
        if (toMove.isEmpty()) return

        when (move) {
            Move.UP, Move.DOWN -> applyMoveVertical(move, toMove)
            Move.LEFT, Move.RIGHT -> applyMoveHorizontal(move, toMove)
        }
    }
}

private fun getState(input: List<String>): State {
    var map: MutableMap<Position, EntityType> = mutableMapOf()
    for (x in input.indices) {
        for (y in input[x].indices) {
            val positionLeft = Position(x, y * 2)
            val positionRight = Position(x, y * 2 + 1)
            when (input[x][y]) {
                '#' -> {
                    map[positionLeft] = EntityType.WALL
                    map[positionRight] = EntityType.WALL
                }

                '@' -> {
                    map[positionLeft] = EntityType.ROBOT
                    map[positionRight] = EntityType.EMPTY
                }

                'O' -> {
                    map[positionLeft] = EntityType.BOXL
                    map[positionRight] = EntityType.BOXR
                }

                '.' -> {
                    map[positionLeft] = EntityType.EMPTY
                    map[positionRight] = EntityType.EMPTY
                }

                else -> throw IllegalArgumentException("Invalid entity")
            }
        }
    }
    return State(map)
}

private fun getMoves(input: List<String>): List<Move> = input.joinToString("")
    .map {
        when (it) {
            '^' -> Move.UP
            'v' -> Move.DOWN
            '<' -> Move.LEFT
            '>' -> Move.RIGHT
            else -> throw IllegalArgumentException("Invalid move")
        }
    }

fun solve(input: String): String {
    val (mapInput, movesInput) = input.split("\n\n").map(String::lines)
    val state = getState(mapInput)
    val moves = getMoves(movesInput)

    moves.forEach(state::applyMove)

    return state
        .map
        .filter { it.value == EntityType.BOXL }
        .keys
        .sumOf {
            it.x.toLong() * 100L + it.y.toLong()
        }
        .toString()
}
