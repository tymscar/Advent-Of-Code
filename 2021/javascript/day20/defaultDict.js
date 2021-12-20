class defaultDict {
	constructor(value) {
		return new Proxy([], {
			get(defaultDict, key) {
				if (!defaultDict.hasOwnProperty(key)) {
					defaultDict[key] = value;
				}
				return defaultDict[key];
			}
		});
	}


}

exports.defaultDict = defaultDict;
