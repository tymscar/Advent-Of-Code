package com.tymscar.day12.part1


private data class Position(val x: Int, val y: Int)
private data class Region(val type: Char, val plots: Set<Position>)
private typealias Map = List<List<Pair<Position, Char>>>

private fun getRegionPerimeter(region: Region, map: Map): Int = region
    .plots
    .sumOf { plot ->
        4 - listOfNotNull(
            map.getOrElse(plot.x - 1) { emptyList() }.getOrNull(plot.y),
            map.getOrElse(plot.x + 1) { emptyList() }.getOrNull(plot.y),
            map.getOrElse(plot.x) { emptyList() }.getOrNull(plot.y - 1),
            map.getOrElse(plot.x) { emptyList() }.getOrNull(plot.y + 1)
        ).filter { it.second == region.type }.size
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
        val neighbours = listOfNotNull(
            map.getOrElse(current.x - 1) { emptyList() }.getOrNull(current.y),
            map.getOrElse(current.x + 1) { emptyList() }.getOrNull(current.y),
            map.getOrElse(current.x) { emptyList() }.getOrNull(current.y - 1),
            map.getOrElse(current.x) { emptyList() }.getOrNull(current.y + 1)
        ).filter { it.second == typeToFind && it.first !in visited }

        neighbours.forEach {
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
            it.plots.size * getRegionPerimeter(it, map)
        }.toString()
}
