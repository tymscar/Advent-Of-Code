package com.tymscar.day17.part2

import kotlin.math.pow

private data class Register(val value: Long)
private enum class Opcode { ADV, BXL, BST, JNZ, BXC, OUT, BDV, CDV }
private data class Operand(val id: Int) {
    val literal: Long = id.toLong()
    fun getComboValue(state: State): Long = when (id) {
        0, 1, 2, 3 -> this.literal
        4 -> state.registerA
        5 -> state.registerB
        6 -> state.registerC
        7 -> throw IllegalArgumentException("Reserved operand")
        else -> throw IllegalArgumentException("Invalid operand")
    }
}

private data class Instruction(val opcode: Opcode, val operand: Operand) {
    companion object {
        fun fromPair(instruction: Pair<Int, Int>): Instruction {
            val operand = Operand(instruction.second)
            return when (instruction.first) {
                0 -> Instruction(opcode = Opcode.ADV, operand = operand)
                1 -> Instruction(opcode = Opcode.BXL, operand = operand)
                2 -> Instruction(opcode = Opcode.BST, operand = operand)
                3 -> Instruction(opcode = Opcode.JNZ, operand = operand)
                4 -> Instruction(opcode = Opcode.BXC, operand = operand)
                5 -> Instruction(opcode = Opcode.OUT, operand = operand)
                6 -> Instruction(opcode = Opcode.BDV, operand = operand)
                7 -> Instruction(opcode = Opcode.CDV, operand = operand)
                else -> throw IllegalArgumentException("Invalid opcode")
            }
        }
    }
}

private data class State(
    val initialRegisters: List<Register>,
    var registerA: Long,
    var registerB: Long,
    var registerC: Long,
    val instructions: List<Instruction>,
    var instructionPointer: Long = 0,
    var output: List<Long> = emptyList(),
    var cyclesSincePrint: Int = 0,
    var halted: Boolean = false
) {
    constructor(registers: List<Register>, instructions: List<Instruction>) : this(
        initialRegisters = registers,
        registerA = registers[0].value,
        registerB = registers[1].value,
        registerC = registers[2].value,
        instructions = instructions,
    )

    fun reset() {
        this.registerA = initialRegisters[0].value
        this.registerB = initialRegisters[1].value
        this.registerC = initialRegisters[2].value
        this.instructionPointer = 0
        this.output = emptyList()
        this.cyclesSincePrint = 0
        this.halted = false
    }

    fun getFirstOutputFor(registerA: Long): Long? {
        reset()
        this.registerA = registerA
        while (!halted) clockTick()
        return output.first()
    }

    fun clockTick() {
        if (instructionPointer >= instructions.size.toLong() || cyclesSincePrint >= instructions.size.toLong()) {
            halted = true
            return
        }
        cyclesSincePrint++
        val instruction = instructions[instructionPointer.toInt()]
        when (instruction.opcode) {
            Opcode.ADV -> {
                val numerator = registerA.toDouble()
                val denominator = 2.0.pow(instruction.operand.getComboValue(this).toDouble())
                this.registerA = (numerator / denominator).toLong()
            }

            Opcode.BXL -> {
                this.registerB = registerB xor instruction.operand.literal
            }

            Opcode.BST -> {
                this.registerB = instruction.operand.getComboValue(this) % 8
            }

            Opcode.JNZ -> {
                if (registerA != 0L) {
                    this.instructionPointer = instruction.operand.literal
                    return
                }
            }

            Opcode.BXC -> {
                this.registerB = registerB xor registerC
            }

            Opcode.OUT -> {
                this.output += instruction.operand.getComboValue(this) % 8
                this.cyclesSincePrint = 0
            }

            Opcode.BDV -> {
                val numerator = registerA.toDouble()
                val denominator = 2.0.pow(instruction.operand.getComboValue(this).toDouble())
                this.registerB = (numerator / denominator).toLong()
            }

            Opcode.CDV -> {
                val numerator = registerA.toDouble()
                val denominator = 2.0.pow(instruction.operand.getComboValue(this).toDouble())
                this.registerC = (numerator / denominator).toLong()
            }
        }
        this.instructionPointer += 2
    }
}

private fun parseRegisters(input: String): List<Register> = Regex("""(\d+)""")
    .findAll(input)
    .map { Register(it.value.toLong()) }
    .toList()

private fun parseInstructions(input: String): List<Instruction> = Regex("""(\d+)""")
    .findAll(input)
    .windowed(2)
    .map { Instruction.fromPair(it[0].value.toInt() to it[1].value.toInt()) }
    .toList()

private fun getReversedProgram(input: String): List<Long> = Regex("""(\d+)""")
    .findAll(input)
    .map { it.value.toLong() }
    .toList()
    .reversed()


private fun findPossibleStarting(registerA: Long, expectedOutput: Long, state: State): List<Long> {
    val possibleRegisterA = mutableListOf<Long>()
    for (contender in 0L..7L) {
        val contenderRegisterA = (registerA shl 3) or contender
        if (state.getFirstOutputFor(contenderRegisterA) == expectedOutput) {
            possibleRegisterA.add(contenderRegisterA)
        }
    }
    return possibleRegisterA
}

fun solve(input: String): String {
    val inputChunks = input.split("\n\n")
    val registers = parseRegisters(inputChunks[0])
    val instructions = parseInstructions(inputChunks[1])
    val reversedProgram = getReversedProgram(inputChunks[1])
    val state = State(registers, instructions)

    var possibleStartingValues = listOf(0L)

    reversedProgram
        .forEach { instruction ->
            possibleStartingValues = possibleStartingValues
                .flatMap { value ->
                    findPossibleStarting(value, instruction, state)
                }
        }

    return possibleStartingValues
        .min()
        .toString()
}
