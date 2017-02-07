const mongoose = require('mongoose');

const NewsletterDate = new mongoose.Schema({
	id: {
		type: String,
		index: { unique: true }
	},
	month: Number,
	year: Number,
	monthLabel: String,
});

module.exports = mongoose.model('NewsletterDate', NewsletterDate);
