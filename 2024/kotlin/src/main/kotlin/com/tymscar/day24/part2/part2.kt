package com.tymscar.day24.part2


private enum class Gate { AND, OR, XOR, INPUT }
private data class Wire(var name: String, var value: Boolean?, val gate: Gate, val input1: String?, val input2: String?)
private typealias Circuit = MutableList<Wire>

private fun Circuit.run() = this
    .filter { Regex("""z\d+""").matches(it.name) }
    .sortedByDescending { it.name }
    .map { if (getWireValue(this, it)) 1 else 0 }
    .joinToString("")
    .toLong(2)

private fun getCircuit(input: String): Circuit {
    val circuit = Regex("""(\w+): (\d)""").findAll(input).map {
        val (name, value) = it.destructured
        Wire(name, value == "1", Gate.INPUT, null, null)
    }.toMutableList()

    Regex("""(\w+) (AND|OR|XOR) (\w+) -> (\w+)""").findAll(input).forEach {
        val (input1, gate, input2, output) = it.destructured
        circuit.add(Wire(output, null, Gate.valueOf(gate), input1, input2))
    }

    return circuit
}

private fun getWireValue(circuit: Circuit, wire: Wire): Boolean {
    if (wire.value != null) return wire.value!!

    val input1 = circuit.find { inputWire -> inputWire.name == wire.input1 }
    val input2 = circuit.find { inputWire -> inputWire.name == wire.input2 }
    val value = when (wire.gate) {
        Gate.INPUT -> wire.value
        Gate.AND -> getWireValue(circuit, input1!!) and getWireValue(circuit, input2!!)
        Gate.OR -> getWireValue(circuit, input1!!) or getWireValue(circuit, input2!!)
        Gate.XOR -> getWireValue(circuit, input1!!) xor getWireValue(circuit, input2!!)
    }

    wire.value = value
    return value!!
}

private fun findFirstOutputFrom(circuit: Circuit, wire: String): String? {
    val parents = circuit.filter { it.input1 == wire || it.input2 == wire }

    val validOutput = parents.find { it.name.first() == 'z' }
    if (validOutput == null) return parents.firstNotNullOfOrNull { findFirstOutputFrom(circuit, it.name) }

    val previousOutputNumber = validOutput.name.drop(1).toInt() - 1
    return "z" + previousOutputNumber.toString().padStart(2, '0')
}

private fun interpretWireAsNumber(start: Char, circuit: Circuit) = circuit
    .filter { it.name.first() == start }
    .sortedByDescending(Wire::name)
    .map { if (it.value!!) '1' else '0' }
    .joinToString("")
    .toLong(2)

fun solve(input: String): String {
    val circuit = getCircuit(input)
    val invalidEndWires = circuit.filter {
        it.name.first() == 'z' && it.name != "z45" && it.gate != Gate.XOR
    }

    val invalidMidWires = circuit.filter {
        it.name.first() != 'z'
                && it.input1?.first() != 'x' && it.input1?.first() != 'y'
                && it.input2?.first() != 'x' && it.input2?.first() != 'y'
                && it.gate == Gate.XOR
    }

    invalidMidWires.forEach { wire ->
        val toSwitch = invalidEndWires.first { it.name == findFirstOutputFrom(circuit, wire.name) }
        val temp = wire.name
        wire.name = toSwitch.name
        toSwitch.name = temp
    }

    val xInput = interpretWireAsNumber('x', circuit)
    val yInput = interpretWireAsNumber('y', circuit)

    val diffFromActual = xInput + yInput xor circuit.run()
    val zeroBits = diffFromActual
        .countTrailingZeroBits()
        .toString()
        .padStart(2, '0')

    val invalidCarryWires = circuit.filter {
        it.input1?.endsWith(zeroBits.toString()) == true
                && it.input2?.endsWith(zeroBits.toString()) == true
    }

    return (invalidEndWires + invalidMidWires + invalidCarryWires)
        .map { it.name }
        .sorted()
        .joinToString(",")
}
