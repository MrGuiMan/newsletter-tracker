const Brand = require('../models/brand');

module.exports = {
	getBrands() {
		return new Promise((resolve,reject) => {
			Brand.find({}, { '_id': 0 },function(err, brands) {
				if(err) {
					console.log(err)
					reject(err);
				};

				resolve(brands);
			})
		});
	},
	insertBrands(brandDocs) {
		Brand.collection.insert(brandDocs, { ordered: false }, (err, docs) => {
			if(err && err.code != 11000)
				console.log(err);
			else if (docs)
				console.log(`Stored ${docs.insertedCount} new brands`);
		});
	},
	createDocumentFromNewsletterJSON(newsletter) {
		return new Brand({
			id: newsletter.MARQUE.toLowerCase().replace(/ /g, ''),
			name: newsletter.MARQUE
		})
	}
}
