package com.tymscar.day24.part1


private enum class Gate { AND, OR, XOR, INPUT }
private data class Wire(val name: String, val value: Boolean?, val gate: Gate, val input1: String?, val input2: String?)
private typealias Circuit = MutableMap<String, Wire>
private fun Circuit.run() = this.keys
    .filter { Regex("""z\d+""").matches(it) }
    .sortedDescending()
    .map { if (getWireValue(this, it)) 1 else 0 }
    .joinToString("")
    .toLong(2)
    .toString()

private fun getCircuit(input: String): Circuit {
    val circuit = Regex("""(\w+): (\d)""").findAll(input).map {
        val (name, value) = it.destructured
        name to Wire(name, value == "1", Gate.INPUT, null, null)
    }.toMap().toMutableMap()

    Regex("""(\w+) (AND|OR|XOR) (\w+) -> (\w+)""").findAll(input).forEach {
        val (input1, gate, input2, output) = it.destructured
        circuit[output] = Wire(output, null, Gate.valueOf(gate), input1, input2)
    }

    return circuit
}

private fun getWireValue(circuit: Circuit, wire: String): Boolean {
    val wireValue = circuit[wire]?.value
    if (wireValue != null) return wireValue

    val wire = circuit[wire]!!
    val value = when (wire.gate) {
        Gate.INPUT -> wire.value!!
        Gate.AND -> getWireValue(circuit, wire.input1!!) and getWireValue(circuit, wire.input2!!)
        Gate.OR -> getWireValue(circuit, wire.input1!!) or getWireValue(circuit, wire.input2!!)
        Gate.XOR -> getWireValue(circuit, wire.input1!!) xor getWireValue(circuit, wire.input2!!)
    }

    circuit[wire.name] = Wire(wire.name, value, wire.gate, wire.input1, wire.input2)
    return value
}

fun solve(input: String) = getCircuit(input).run()
