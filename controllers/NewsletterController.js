const Newsletter = require('../models/newsletter');
const NewsletterDate = require('../models/newsletterDate');
const tools = require('../tools');

module.exports = {
	getNewsletters(options) {
		// Client sends separated date / month, turn it into a queryable date filter
		options = this.convertToQueriableDateFilters(options);

		return new Promise((resolve,reject) => {
			// Get Newsletters, filtering by data sent by the client
			Newsletter.find(tools.getQueryFilters(options), { '_id': 0 }, function(err, newsletters) {
				if(err) reject(err);
				resolve(newsletters);
			})
		});
	},
	getNewsletterDates(options) {
		return new Promise((resolve,reject) => {
			// Get Newsletters, filtering by data sent by the client
			NewsletterDate.find({}, { '_id': 0 }, function(err, dates) {
				if(err) reject(err);
				resolve(dates);
			})
		});
	},
	insertNewsletters: function(newsletterDocs) {
		// Insert documents in db, ordered: false will make sure insertion continue if there's any duplicates
		Newsletter.collection.insert(newsletterDocs, { ordered: false }, (err, docs) => {
			if(err && err.code != 11000)
				console.log(err);
			else if (docs)
				console.log(`Stored ${docs.insertedCount} new newsletters`);
		});
	},
	insertNewsletterDates: function(newsletterDatesDocs) {
		// Insert documents in db, ordered: false will make sure insertion continue if there's any duplicates
		NewsletterDate.collection.insert(newsletterDatesDocs, { ordered: false }, (err, docs) => {
			if(err && err.code != 11000)
				console.log(err);
			else if (docs)
				console.log(`Stored ${docs.insertedCount} new distinct dates`);
		});
	},
	// Return mongoose documents with newsletters parsed from the CSV
	createNewsletterFromNewsletterJSON(newsletter) {
		return new Newsletter({
			id: newsletter.ID,
			date: tools.getDateFromFRFormat(newsletter.DATE),
			brand: newsletter.MARQUE.toLowerCase().replace(/ /g, ''),
			category: newsletter.CATEGORIE.toLowerCase().replace(/ /g, ''),
			theme: newsletter.THEME.toLowerCase().replace(/ /g, ''),
			subject: newsletter.OBJET,
			screenshotLink: newsletter.CREA_CAPTURE,
			onlineVersionLink: newsletter.VERSION_ENLIGNE
		})
	},
	// Return mongoose documents with newsletter dates data from the CSV
	createNewsletterDateFromNewsletterJSON(newsletter) {
		const date = tools.getDateFromFRFormat(newsletter.DATE);
		const monthLabels = [
			'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
			'Juillet', 'Aout', 'Septembre', 'Octobre', 'Décembre'
		];

		return new NewsletterDate({
			id: date.getFullYear() + '_' + date.getMonth(),
			month: date.getMonth(),
			year: date.getFullYear(),
			monthLabel: monthLabels[date.getMonth()]
		})
	},
	// Convert month and year parameters inside the options object into
	// a mongodb filter on date
	convertToQueriableDateFilters(options) {
		if(options.month && options.year) {
			// First day of provided month
			const startDate = new Date(options.year, options.month, 1);
			// First day of next month is the end date bound (and is not included)
			const endDate = new Date(options.year, options.month + 1, 1);

			options.date = { $gte: startDate, $lt: endDate };
			delete options.month;
			delete options.year;
		}

		return options;
	}
}
