const fs = require('fs');

const hex2bin = hex => {
	const binaryArray = [];
	hex.split('').forEach(char =>{
		binaryArray.push(parseInt(char, 16).toString(2).padStart(4, '0'));
	});
	return binaryArray.join('');
};

const input = hex2bin(fs.readFileSync('input.txt', 'utf8'));

const getPackets = bin => {
	const packets = [];
	let index = 0;
	while (bin.length - index >= 11) {

		const packet = {};
		packet.version = parseInt(bin.substr(0 + index, 3), 2);
		packet.type = parseInt(bin.substr(3 + index, 3), 2);
		if (packet.type === 4) {
			const bitsRead = [];
			let readPos = 6 + index;
			let infoBit = '0';
			do {
				infoBit = bin.substr(readPos, 1);
				bitsRead.push(bin.substr(readPos + 1, 4));
				readPos += 5;
			} while (readPos + 5 <= bin.length && infoBit !== '0');
			packet.data = parseInt(bitsRead.join(''), 2);
			index = readPos;
		} else {

			if (bin.substr(6 + index, 1) === '0') {

				const lengthSubPackets = parseInt(bin.substr(7 + index, 15), 2);
				const subPacketString = bin.substr(22 + index, lengthSubPackets);
				const subPackets = getPackets(subPacketString);

				subPackets.forEach(subPack => packets.push(subPack));
				index = 22 +index + lengthSubPackets;
			} else {

				const howManySubPackets = parseInt(bin.substr(7 + index, 11), 2);
				let subPacketStringLength = bin.length - (18 + index);
				let subPackets = [];
				while (subPackets.length < howManySubPackets){
					subPackets = getPackets(bin.substr(18 + index, subPacketStringLength));
				}

				subPackets.forEach(subPack => packets.push(subPack));
				index = 18 +index+ subPacketStringLength;
			}
		}

		packets.push(packet);
	}

	return packets;
};

const versionSum = getPackets(input).reduce((total, curr) => total + curr.version, 0);

console.log(versionSum);
