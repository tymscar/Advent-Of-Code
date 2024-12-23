package com.tymscar.day23.part1


private fun getAllConnected(from: String, map: Map<String, List<String>>, groupCount: Int): List<String> {
    var groups = listOf(listOf(from))

    while (groups.first().count() < groupCount) {
        groups = groups.flatMap { group ->
            map[group.last()]!!
                .filter { !group.contains(it) }
                .map { group + it }
        }
    }

    return groups
        .filter { group ->
            group.all { computer ->
                group.all { peer ->
                    map[computer]!!.contains(peer) || computer == peer
                }
            }
        }.map { it.sorted().joinToString(",") }
}

fun solve(input: String): String {
    val map = input
        .lines()
        .flatMap {
            val (from, towards) = it.split("-")
            listOf(from to towards, towards to from)
        }.groupBy({ it.first }, { it.second })

    return map.keys.filter { it[0] == 't' }
        .flatMap { getAllConnected(it, map, 3) }
        .toSet()
        .count()
        .toString()
}
