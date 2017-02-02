const mongoose = require('mongoose');

const Newsletter = new mongoose.Schema({
	id: {
		type: Number,
		index: { unique: true }
	},
	date: String,
	brand: String,
	category: String,
	subject: String,
	screenshotLink: String,
	onlineVersionLink: String
});

module.exports = mongoose.model('Newsletter', Newsletter)
