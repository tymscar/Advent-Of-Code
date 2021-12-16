const fs = require('fs');

const hex2bin = hex => {
	const binaryArray = [];
	hex.split('').forEach(char =>{
		binaryArray.push(parseInt(char, 16).toString(2).padStart(4, '0'));
	});
	return binaryArray.join('');
};

const input = hex2bin(fs.readFileSync('input.txt', 'utf8'));

const getPacket = bin => {

	const packet = {};
	packet.version = parseInt(bin.substr(0, 3), 2);
	packet.type = parseInt(bin.substr(3, 3), 2);
	if (packet.type === 4) {
		const bitsRead = [];
		let readPos = 6;
		while ( bin.substr(readPos, 1) !== '0') {
			bitsRead.push(bin.substr(readPos + 1, 4));
			readPos += 5;
		}
		bitsRead.push(bin.substr(readPos + 1, 4));
		readPos += 5;
		packet.data = parseInt(bitsRead.join(''), 2);
		packet.bitAfterLast = readPos;
	} else {
		let subPackets = [];
		let lengthSubPackets;
		let subStart;
		const fifteenBitter = bin.substr(6, 1) === '0';
		if (fifteenBitter) {
			lengthSubPackets = parseInt(bin.substr(7, 15), 2);
			subStart = 22;
		} else {
			lengthSubPackets = parseInt(bin.substr(7, 11), 2);
			subStart = 18;
		}

		while(lengthSubPackets > 0){
			const subPack = getPacket(bin.substr(subStart));
			subStart += subPack.bitAfterLast;
			subPackets.push(subPack);
			if(fifteenBitter){
				lengthSubPackets -= subPack.bitAfterLast;
			} else {
				lengthSubPackets--;
			}
		}
		packet.bitAfterLast = subStart;

		switch(packet.type.toString()) {
		case '0':
			packet.data = subPackets.reduce((total, curr) => total + curr.data, 0);
			break;
		case '1':
			packet.data = subPackets.reduce((total, curr) => total * curr.data, 1);
			break;
		case '2':
			packet.data = Math.min(...subPackets.map(pack => pack.data));
			break;
		case '3':
			packet.data = Math.max(...subPackets.map(pack => pack.data));
			break;
		case '5':
			packet.data = subPackets[0].data > subPackets[1].data ? 1 : 0;
			break;
		case '6':
			packet.data = subPackets[0].data < subPackets[1].data ? 1 : 0;
			break;
		case '7':
			packet.data = subPackets[0].data === subPackets[1].data ? 1 : 0;
			break;
		}
	}

	return packet;
};

console.log(getPacket(input).data);
