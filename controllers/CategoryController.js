const Category = require('../models/category');

module.exports = {
	getCategories() {
		return new Promise((resolve,reject) => {
			Category.find({}, { '_id': 0 }, function(err, categories) {
				if(err) {
					console.log(err);
					reject(err);
				};
				resolve(categories);
			})
		});
	},
	insertCategories(categoryDocs) {
		Category.collection.insert(categoryDocs, { ordered: false }, (err, docs) => {
			if(err && err.code != 11000)
				console.log(err);
			else if (docs)
				console.log(`Stored ${docs.insertedCount} new categories`);
		});
	},
	createDocumentFromNewsletterJSON(newsletter) {
		return new Category({
			id: newsletter.CATEGORIE.toLowerCase().replace(/ /g, ''),
			name: newsletter.CATEGORIE
		})
	}
}
