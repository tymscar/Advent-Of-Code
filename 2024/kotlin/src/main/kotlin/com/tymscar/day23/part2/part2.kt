package com.tymscar.day23.part2


fun getAllCliques(
    graph: Map<String, List<String>>,
    currentClique: Set<String>,
    remainingNodes: MutableSet<String>,
    visitedNodes: MutableSet<String>
): List<Set<String>> {
    if (remainingNodes.isEmpty() && visitedNodes.isEmpty()) return listOf(currentClique)
    val results = mutableListOf<Set<String>>()

    remainingNodes.toList().forEach { v ->
        val neighbours = graph[v]?.toSet() ?: emptySet()
        results.addAll(getAllCliques(
            graph,
            currentClique + v,
            remainingNodes.intersect(neighbours).toMutableSet(),
            visitedNodes.intersect(neighbours).toMutableSet()
        ))
        remainingNodes.remove(v)
        visitedNodes.add(v)
    }
    return results
}

fun solve(input: String): String {
    val map = input
        .lines()
        .flatMap {
            val (from, towards) = it.split("-")
            listOf(from to towards, towards to from)
        }.groupBy ({ it.first }, { it.second })

    return getAllCliques(map, emptySet(), map.keys as MutableSet<String>, mutableSetOf())
        .maxBy { it.count() }
        .sorted()
        .joinToString(",")
}
