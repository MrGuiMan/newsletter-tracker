const mongoose = require('mongoose');

const Brand = new mongoose.Schema({
	id: {
		type: String,
		index: { unique: true }
	},
	name: String
});
Brand.pre('save', next => {
	this.id = name.toLowerCase().replace(/ /g, '');
	next();
})

module.exports = mongoose.model('Brand', Brand)
