package com.tymscar.day09.part1

private sealed class Block {
    data class File(val id: Long) : Block()
    class Space : Block()
}

fun solve(input: String): String {
    val memory = input
        .withIndex()
        .fold((0L to listOf<Block>())) { (currId, currList), value ->
            when (value.index % 2) {
                0 -> (currId + 1 to (currList + List(value.value.digitToInt()) { Block.File(currId) }))
                else -> (currId to (currList + List(value.value.digitToInt()) { Block.Space() }))
            }
        }.second

    val fragmented = memory
        .fold((0 to memory.count() - 1) to listOf<Block.File>()) { (indices, currList), value ->
            var (indexLeft, indexRight) = indices
            while (memory[indexRight] is Block.Space) indexRight--
            if (indexLeft > indexRight) {
                return@fold (indices to currList)
            }

            when (value) {
                is Block.File -> ((indexLeft + 1 to indexRight) to (currList + memory[indexLeft] as Block.File))
                is Block.Space -> ((indexLeft + 1 to indexRight - 1) to (currList + memory[indexRight] as Block.File))
            }
        }.second

    return fragmented
        .withIndex()
        .sumOf { it.value.id * it.index }
        .toString()
}
