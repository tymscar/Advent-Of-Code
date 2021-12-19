class Scanner {
	constructor() {
		this.detected = [];
		this.id = 0;
		this.pos = [0,0,0];
	}

	getCombinationsOfDetected () {
		return [
			this.detected.map(pos => [pos[0], pos[1], pos[2]]), //x 0
			this.detected.map(pos => [pos[0],-pos[2],pos[1]]), //x 90
			this.detected.map(pos => [pos[0], -pos[1], -pos[2]]), //x 180
			this.detected.map(pos => [pos[0], pos[2], -pos[1]]), //x 270
			this.detected.map(pos => [-pos[0], -pos[1], pos[2]]), // -x 0
			this.detected.map(pos => [-pos[0], pos[2], pos[1]]), // -x 90
			this.detected.map(pos => [-pos[0], pos[1], -pos[2]]), // -x 180
			this.detected.map(pos => [-pos[0], -pos[2], -pos[1]]), // -x 270

			this.detected.map(pos => [-pos[1], pos[0], pos[2]]), // y 0
			this.detected.map(pos => [pos[2], pos[0], pos[1]]), // y 90
			this.detected.map(pos => [pos[1], pos[0], -pos[2]]), // y 180
			this.detected.map(pos => [-pos[2], pos[0], -pos[1]]), // y 270
			this.detected.map(pos => [pos[1], -pos[0], pos[2]]), // -y 0
			this.detected.map(pos => [-pos[2], -pos[0], pos[1]]), // -y 90
			this.detected.map(pos => [-pos[1], -pos[0], -pos[2]]), // -y 180
			this.detected.map(pos => [pos[2], -pos[0], -pos[1]]), // -y 270

			this.detected.map(pos => [-pos[2], pos[1], pos[0]]), // z 0
			this.detected.map(pos => [-pos[1], -pos[2], pos[0]]), // z 90
			this.detected.map(pos => [pos[2], -pos[1], pos[0]]), // z 180
			this.detected.map(pos => [pos[1], pos[2], pos[0]]), // z 270
			this.detected.map(pos => [pos[2], pos[1], -pos[0]]), // -z 0
			this.detected.map(pos => [pos[1], -pos[2], -pos[0]]), // -z 90
			this.detected.map(pos => [-pos[2], -pos[1], -pos[0]]), // -z 180
			this.detected.map(pos => [-pos[1], pos[2], -pos[0]]) // -z 270
		];
	}

	getBeaconsIfCommonWith(alreadyKnownBeacons){
		let ans = [];

		this.getCombinationsOfDetected().forEach(currBeacons => {
			alreadyKnownBeacons.forEach(savedBeaconOffset => {
				currBeacons.forEach(currBeaconOffset => {
					let inCommon = 0;
					alreadyKnownBeacons.forEach(savedBeacon => {
						currBeacons.forEach(currBeacon => {
							if((currBeacon[0] - currBeaconOffset[0]) === (savedBeacon[0] - savedBeaconOffset[0]) &&
								(currBeacon[1] - currBeaconOffset[1]) === (savedBeacon[1] - savedBeaconOffset[1]) &&
								(currBeacon[2] - currBeaconOffset[2]) === (savedBeacon[2] - savedBeaconOffset[2])){
								inCommon++;

								if(inCommon >= 12) {
									this.pos = [savedBeacon[0] - currBeacon[0], savedBeacon[1] - currBeacon[1], savedBeacon[2] - currBeacon[2]];
								}
							}
						});
					});
					if(inCommon >= 12) {
						ans = currBeacons.map(loc => [loc[0] - currBeaconOffset[0] + savedBeaconOffset[0], loc[1] - currBeaconOffset[1] + savedBeaconOffset[1], loc[2] - currBeaconOffset[2] + savedBeaconOffset[2]]);
					}
				});
			});
		});


		return ans;
	}
}

exports.Scanner = Scanner;
