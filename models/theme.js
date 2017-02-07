const mongoose = require('mongoose');

const Theme = new mongoose.Schema({
	id: {
		type: String,
		index: { unique: true }
	},
	name: String
});
Theme.pre('save', next => {
	this.id = name.toLowerCase().replace(/ /g, '');
	next();
})

module.exports = mongoose.model('Theme', Theme);
