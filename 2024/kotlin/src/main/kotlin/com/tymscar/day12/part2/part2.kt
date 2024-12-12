package com.tymscar.day12.part2


private data class Position(val x: Int, val y: Int) {
    fun getNeighbours(map: Map) = listOfNotNull(
        map.getOrElse(this.x - 1) { emptyList() }.getOrNull(this.y),
        map.getOrElse(this.x + 1) { emptyList() }.getOrNull(this.y),
        map.getOrElse(this.x) { emptyList() }.getOrNull(this.y - 1),
        map.getOrElse(this.x) { emptyList() }.getOrNull(this.y + 1)
    )

    fun isAboveType(map: Map, type: Char): Boolean {
        val aboveNeighbour = map.getOrElse(this.x - 1) { emptyList() }.getOrNull(this.y)
        if (aboveNeighbour == null) return false
        return aboveNeighbour.second == type
    }

    fun isBelowType(map: Map, type: Char): Boolean {
        val belowNeighbour = map.getOrElse(this.x + 1) { emptyList() }.getOrNull(this.y)
        if (belowNeighbour == null) return false
        return belowNeighbour.second == type
    }

    fun isLeftType(map: Map, type: Char): Boolean {
        val leftNeighbour = map.getOrElse(this.x) { emptyList() }.getOrNull(this.y - 1)
        if (leftNeighbour == null) return false
        return leftNeighbour.second == type
    }

    fun isRightType(map: Map, type: Char): Boolean {
        val rightNeighbour = map.getOrElse(this.x) { emptyList() }.getOrNull(this.y + 1)
        if (rightNeighbour == null) return false
        return rightNeighbour.second == type
    }
}

private data class Region(val type: Char, val plots: Set<Position>)
private typealias Map = List<List<Pair<Position, Char>>>

private fun getNumberOfSides(region: Region, map: Map): Int {
    var horizontalSides = 0
    var verticalSides = 0

    fun countSides(isCorrectType: Boolean, tracker: Boolean, increment: () -> Unit) =
        if (!isCorrectType) {
            if (!tracker) increment()
            true
        } else false


    map.forEach { row ->
        var aboveCorrectType = false
        var belowCorrectType = false
        row.forEach { plot ->
            if (!region.plots.contains(plot.first)) {
                aboveCorrectType = false
                belowCorrectType = false
                return@forEach
            }
            aboveCorrectType = countSides(plot.first.isAboveType(map, region.type), aboveCorrectType) {
                horizontalSides++
            }
            belowCorrectType = countSides(plot.first.isBelowType(map, region.type), belowCorrectType) {
                horizontalSides++
            }
        }
    }

    for (col in map[0].indices) {
        var leftCorrectType = false
        var rightCorrectType = false
        for (row in map.indices) {
            val plot = map[row][col]
            if (!region.plots.contains(plot.first)) {
                leftCorrectType = false
                rightCorrectType = false
                continue
            }
            leftCorrectType = countSides(plot.first.isLeftType(map, region.type), leftCorrectType) {
                verticalSides++
            }
            rightCorrectType = countSides(plot.first.isRightType(map, region.type), rightCorrectType) {
                verticalSides++
            }
        }
    }

    return horizontalSides + verticalSides
}

private fun getAllConnected(fromPos: Position, map: Map): Set<Position> {
    val typeToFind = map[fromPos.x][fromPos.y].second
    val toVisit = mutableListOf<Position>()
    val visited = mutableSetOf<Position>()
    val connected = mutableSetOf<Position>()

    toVisit.add(fromPos)
    visited.add(fromPos)

    while (toVisit.isNotEmpty()) {
        val current = toVisit.removeFirst()
        connected.add(current)
        current
            .getNeighbours(map)
            .filter { it.second == typeToFind && it.first !in visited }
            .forEach {
                toVisit.add(it.first)
                visited.add(it.first)
            }
    }

    return connected
}

private fun getRegions(map: Map): List<Region> {
    val regions = mutableListOf<Region>()
    val visited = map.flatten().associate { it.first to false } as MutableMap<Position, Boolean>

    while (visited.values.contains(false)) {
        val currentPos = visited.entries.first { it.value == false }.key
        val currentType = map[currentPos.x][currentPos.y].second

        val connected = getAllConnected(currentPos, map)
        connected.forEach { visited[it] = true }
        regions.add(Region(currentType, connected))
    }

    return regions
}

fun solve(input: String): String {
    val map = input
        .lines()
        .mapIndexed { i, line -> line.mapIndexed { j, c -> Pair(Position(i, j), c) } }

    return getRegions(map)
        .sumOf {
            it.plots.size * getNumberOfSides(it, map)
        }.toString()
}
