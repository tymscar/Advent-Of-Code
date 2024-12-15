package com.tymscar.day15.part1


private enum class EntityType { WALL, ROBOT, BOX, EMPTY }

private enum class Move { UP, DOWN, LEFT, RIGHT }

private data class Position(val x: Int, val y: Int) {
    fun getNextPosition(move: Move): Position = when (move) {
        Move.UP -> Position(x - 1, y)
        Move.DOWN -> Position(x + 1, y)
        Move.LEFT -> Position(x, y - 1)
        Move.RIGHT -> Position(x, y + 1)
    }
}

private typealias Map = MutableMap<Position, EntityType>

private data class State(val map: Map) {
    private fun getRobotPosition(): Position = map.filterValues { it == EntityType.ROBOT }.keys.first()
    fun getEntitiesToMove(direction: Move): List<Position> {
        val entities = mutableListOf<Position>()
        var currPosition = getRobotPosition()
        if (map[currPosition.getNextPosition(direction)] == EntityType.WALL) return emptyList()
        while (map[currPosition] == EntityType.BOX || map[currPosition] == EntityType.ROBOT) {
            entities.add(currPosition)
            currPosition = currPosition.getNextPosition(direction)
        }
        return if (map[currPosition] == EntityType.EMPTY) entities.reversed() else emptyList()
    }

    fun applyMove(move: Move) {
        val toMove = getEntitiesToMove(move)
        if (toMove.isEmpty()) return

        toMove.forEach { map[it.getNextPosition(move)] = map[it] as EntityType }
        toMove.last().let { map[it] = EntityType.EMPTY }
    }
}


private fun getState(input: List<String>): State {
    var map: MutableMap<Position, EntityType> = mutableMapOf()
    for (x in input.indices) {
        for (y in input[x].indices) {
            val position = Position(x, y)
            when (input[x][y]) {
                '#' -> map[position] = EntityType.WALL
                '@' -> map[position] = EntityType.ROBOT
                'O' -> map[position] = EntityType.BOX
                '.' -> map[position] = EntityType.EMPTY
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
        .filter { it.value == EntityType.BOX }
        .keys
        .sumOf {
            it.x * 100 + it.y
        }
        .toString()
}
