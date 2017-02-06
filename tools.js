module.exports = {
	getDateFromFRFormat(dateString) {
		const dateSplit = dateString.split('/');
		return new Date(dateSplit[2], parseInt(dateSplit[1]) - 1, dateSplit[0]);
	},

	parseCSV(filePath) {
		return new Promise((resolve,reject) => {
			let newsletters = [];
			const csv = require('csvtojson');
			csv().fromFile(filePath)
				.on('json', rowToJson => {
					newsletters.push(rowToJson);
				})
				.on('error', err => {
					reject(err);
				})
				.on('done', () => {
					resolve(newsletters);
				});
		});
	},
	getQueryFilters(object) {
		let result = {};
		for (let prop in object) {
			if(object.hasOwnProperty(prop)) {
				const val = object[prop]
				if(val != undefined && val != null && val != "") {
					result[prop] = val;
				}
			}
		}
		return result;
	}

}
