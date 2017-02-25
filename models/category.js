const mongoose = require('mongoose');

const Category = new mongoose.Schema({
	id: {
		type: String,
		unique: true
	},
	name: String
});
Category.pre('save', next => {
	this.id = name.toLowerCase().replace(/ /g, '');
	next();
})

module.exports = mongoose.model('Category', Category)
