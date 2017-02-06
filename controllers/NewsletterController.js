const Newsletter = require('../models/Newsletter');
const tools = require('../tools');

module.exports = {
	getNewsletters(options) {
		return new Promise((resolve,reject) => {

			Newsletter.find(tools.getQueryFilters(options), { '_id': 0 }, function(err, newsletters) {
				if(err) {
					console.log(err)
					reject(err);
				};

				resolve(newsletters);
			})
		});
	},
	insertNewsletters: function(newsletterDocs) {
		// Insert documents in db
		Newsletter.collection.insert(newsletterDocs, { ordered: false }, (err, docs) => {
			if(err && err.code != 11000)
				console.log(err);
			else if (docs)
				console.log(`Stored ${docs.insertedCount} new newsletters`);
		});
	},
	createDocumentFromNewsletterJSON(newsletter) {
		return new Newsletter({
			id: newsletter.ID,
			date: tools.getDateFromFRFormat(newsletter.DATE),
			brand: newsletter.MARQUE.toLowerCase().replace(/ /g, ''),
			category: newsletter.CATEGORIE.toLowerCase().replace(/ /g, ''),
			subject: newsletter.OBJET,
			screenshotLink: newsletter.CREA_CAPTURE,
			onlineVersionLink: newsletter.VERSION_ENLIGNE
		})
	}
}
