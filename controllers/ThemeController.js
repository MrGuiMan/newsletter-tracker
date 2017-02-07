const Theme = require('../models/theme');

module.exports = {
	getThemes() {
		return new Promise((resolve,reject) => {
			Theme.find({}, { '_id': 0 }, function(err, themes) {
				if(err) reject(err);
				resolve(themes);
			})
		});
	},
	insertThemes(themeDocs) {
		Theme.collection.insert(themeDocs, { ordered: false }, (err, docs) => {
			if(err && err.code != 11000)
				console.log(err);
			else if (docs)
				console.log(`Stored ${docs.insertedCount} new themes`);
		});
	},
	createDocumentFromNewsletterJSON(newsletter) {
		return new Theme({
			id: newsletter.THEME.toLowerCase().replace(/ /g, ''),
			name: newsletter.THEME
		})
	}
}
