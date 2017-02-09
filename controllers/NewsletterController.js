const Newsletter = require('../models/newsletter');
const NewsletterDate = require('../models/newsletterDate');
const tools = require('../tools');

const NEWS_PER_PAGE = 10;

module.exports = {
	getNewslettersAndCount(requestBody) {
		// Client sends separated date / month, turn it into a queryable date filter
		const data = this.convertBodyToFilters(requestBody);
		const filters = tools.getQueryFilters(data.filters);

		return Promise.all([
			this.getNewsletters(filters, data.page),
			this.getPageCount(filters)
		])
		.then(values => {
			return {
				newsletters: values[0],
				pageCount: values[1]
			}
		})
		return ;
	},
	getNewsletters(filters, page) {
		return new Promise((resolve,reject) => {
			// Get Newsletters, filtering by data sent by the client
			Newsletter.find(filters, { '_id': 0 })
				.sort({ id: -1 })
				.skip((page - 1) * NEWS_PER_PAGE)
				.limit(NEWS_PER_PAGE)
				.exec(function(err, newsletters) {
					if(err) reject(err);
					resolve(newsletters);
				})
		});
	},
	getNewsletterDates(options) {
		return new Promise((resolve,reject) => {
			// Get Newsletters, filtering by data sent by the client
			NewsletterDate.find({}, { '_id': 0 }, (err, dates) => {
				if(err) reject(err);
				resolve(dates);
			})
		});
	},
	getPageCount(filters) {
		return new Promise((resolve, reject) => {
			Newsletter.count(filters, (err, count) => {
				if(err) reject(err);
				// Return number of newsletters with provided filters
				resolve(Math.ceil(count / NEWS_PER_PAGE));
			})
		})
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
	convertBodyToFilters(body) {
		let filters = {};

		// Convert month and year options to date filter
		if(body.month && body.year) {
			// First day of provided month
			// First day of next month is the end date bound (and is not included)
			filters.date = {
				$gte: new Date(body.year, body.month, 1),
				$lt: new Date(body.year, body.month + 1, 1)
			};
		}

		filters.category = body.category;
		filters.brand = body.brand;
		filters.theme = body.theme;

		return {
			filters: filters,
			page: parseInt(body.page) || 1
		};
	}
}
