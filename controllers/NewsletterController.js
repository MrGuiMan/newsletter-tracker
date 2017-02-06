const Newsletter = require('../models/Newsletter');
const tools = require('../tools');

module.exports = {
	getNewsletters(options) {
		return new Promise((resolve,reject) => {
			// Get Newsletters, filtering by data sent by the client
			Newsletter.find(tools.getQueryFilters(options), { '_id': 0 }, function(err, newsletters) {
				if(err) reject(err);
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
	// Return mongoose documents with newsletters parsed from the CSV
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
	},
	// Get Distinct dates from the newsletter collection
	getDistinctMonths() {
		return new Promise((resolve, reject) => {
			const mapReduceOptions = {
				map: function() {
					const monthLabels = [
						'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
						'Juillet', 'Aout', 'Septembre', 'Octobre', 'Décembre'
					];

					const month = this.date.getMonth();
					const year = this.date.getFullYear();
					const monthID = year + '_' + month;

					// Map document into a built monthID, and associated value
					emit(monthID, { month: month, monthLabel: monthLabels[month], year: year});
				},
				reduce: function(key, values) {
					// No need to aggregate fixed data, just return one of the values
					return values[0];
				}
			}
			Newsletter.mapReduce(mapReduceOptions, (err, results) => {
				if(err) reject(err);
				resolve(results);
			});
		})
	}
}
