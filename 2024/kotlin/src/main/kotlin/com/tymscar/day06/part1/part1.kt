package com.tymscar.day06.part1

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
    fun getNextValidPosition(direction: Direction, grid: List<List<Tile>>): Pair<Position, Direction> {
        val (forward, right, backward, left) = direction.getAllDirectionsFrom()
        val nextForward = getNextPosition(forward)
        val nextRight = getNextPosition(right)
        val nextBackward = getNextPosition(backward)
        val nextLeft = getNextPosition(left)
        return when {
            nextForward.isValidPosition(grid) -> nextForward to forward
            nextRight.isValidPosition(grid) -> nextRight to right
            nextBackward.isValidPosition(grid) -> nextBackward to backward
            nextLeft.isValidPosition(grid) -> nextLeft to left
            else -> error("No valid position found")
        }
    }

    fun isOutsideGrid(grid: List<List<Tile>>): Boolean {
        return x < 0 || y < 0 || x >= grid[0].size || y >= grid.size
    }

    private fun isValidPosition(grid: List<List<Tile>>): Boolean {
        return isOutsideGrid(grid) || listOf(Tile.EMPTY, Tile.START).contains(grid[y][x])
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

private tailrec fun getWholePath(
    currentPath: List<Position>,
    currentDir: Direction,
    grid: List<List<Tile>>,
): List<Position> {
    val currentPosition = currentPath.last()
    val (nextPosition, nextDir) = currentPosition.getNextValidPosition(currentDir, grid)
    return when {
        nextPosition.isOutsideGrid(grid) -> currentPath
        else -> getWholePath(currentPath + nextPosition, nextDir, grid)
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

    val wholePath = getWholePath(listOf(startingPosition), Direction.UP, grid)

    return wholePath.toSet().count().toString()
}
