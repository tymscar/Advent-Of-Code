package com.tymscar.day06.part2

enum class Tile {
    EMPTY, OBJECT, START
}

enum class Direction {
    UP {
        override fun turnRight() = RIGHT
    },
    RIGHT {
        override fun turnRight() = DOWN
    },
    DOWN {
        override fun turnRight() = LEFT
    },
    LEFT {
        override fun turnRight() = UP
    };

    abstract fun turnRight(): Direction
    fun getAllDirectionsFrom(): List<Direction> {
        return listOf(this, turnRight(), turnRight().turnRight(), turnRight().turnRight().turnRight())
    }
}

data class Position(val y: Int, val x: Int) {
    fun getNextValidPosition(
        direction: Direction,
        obstacle: Position,
        grid: List<List<Tile>>
    ): Pair<Position, Direction> {
        val (forward, right, backward, left) = direction.getAllDirectionsFrom()
        val nextForward = getNextPosition(forward)
        val nextRight = getNextPosition(right)
        val nextBackward = getNextPosition(backward)
        val nextLeft = getNextPosition(left)
        return when {
            nextForward.isValidPosition(obstacle, grid) -> nextForward to forward
            nextRight.isValidPosition(obstacle, grid) -> nextRight to right
            nextBackward.isValidPosition(obstacle, grid) -> nextBackward to backward
            nextLeft.isValidPosition(obstacle, grid) -> nextLeft to left
            else -> error("No valid position found")
        }
    }

    fun isOutsideGrid(grid: List<List<Tile>>): Boolean {
        return x < 0 || y < 0 || x >= grid[0].size || y >= grid.size
    }

    private fun isValidPosition(obstacle: Position, grid: List<List<Tile>>): Boolean =
        when {
            isOutsideGrid(grid) -> true
            obstacle == this -> false
            grid[y][x] == Tile.OBJECT -> false
            else -> true
        }


    private fun getNextPosition(direction: Direction): Position {
        return when (direction) {
            Direction.UP -> Position(y - 1, x)
            Direction.RIGHT -> Position(y, x + 1)
            Direction.DOWN -> Position(y + 1, x)
            Direction.LEFT -> Position(y, x - 1)
        }
    }
}

private tailrec fun doesItLoop(
    currentPath: List<Pair<Position, Direction>>,
    extraObstacle: Position,
    grid: List<List<Tile>>,
): Boolean {
    val (currentPosition, currentDirection) = currentPath.last()

    val (nextPosition, nextDir) = currentPosition.getNextValidPosition(currentDirection, extraObstacle, grid)
    return when {
        nextPosition.isOutsideGrid(grid) -> false
        (nextPosition to nextDir) in currentPath -> true
        else -> doesItLoop(currentPath + (nextPosition to nextDir), extraObstacle, grid)
    }
}

fun solve(input: String): String {
    val grid = input.lines().map { line ->
        line.map { char ->
            when (char) {
                '.' -> Tile.EMPTY
                '^' -> Tile.START
                '#' -> Tile.OBJECT
                else -> error("Unknown tile: $char")
            }
        }
    }

    val startingPosition = grid.mapIndexed { y, row ->
        val x = row.indexOfFirst { it == Tile.START }
        if (x != -1) Position(y, x) else null
    }.first { it != null } ?: error("No starting position found")

    val possibleObstaclePositions = grid.flatMapIndexed { y, row ->
        row.mapIndexed { x, tile ->
            if (tile == Tile.EMPTY) Position(y, x) else null
        }.filterNotNull()
    }

    val startingList = listOf((startingPosition to Direction.UP))

    return possibleObstaclePositions
        .mapIndexed { index, position ->
                if (index % 100 == 0) println("Processing $index")
                doesItLoop(startingList, position, grid)
        }
        .count { it }
        .toString()
}
