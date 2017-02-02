const fs = require('fs');
const path = require('path');
const express = require('express');
const csv = require('csvtojson');
const mongoose = require('mongoose');
const multer  = require('multer');
const upload = multer({ dest: 'upload/' });

// Models
const Newsletter = require('./models/newsletter');
const Category = require('./models/category');
const Brand = require('./models/brand');


// Initialize Server
const app = new express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

// Connect to DB
mongoose.connect('mongodb://mongo:27017/tao-nl-tracker');

// Root Path
app.get('/', (req, res) => {
	// Get data and return home page
	Promise.all([getNewsletters(), getBrands(), getCategories()])
		.then(values => {
			res.render('pages/index', {
				newsletters: values[0],
				brands: values[1],
				categories: values[2]
			});
		})
		.catch(err => {
			console.log(err);
			res.sendStatus(500);
		});
});

app.post('/upload', upload.single('nlfile'), (req, res) => {
	const filePath = path.join(__dirname, req.file.path);

	// Parse file
	// then store content in db
	// then delete file
	parseCSV(filePath)
		.then(newsletters => storeNewData(newsletters))
		.then(() => fs.unlink(filePath))
		.then(() => res.redirect('/'))
		.catch(err => { console.log(err); res.sendStatus(500); });
});

// Start Server
app.listen(app.get('port'), (req, res) => {
	console.log(`Server running on port ${app.get('port')}`);
})

function parseCSV(filePath) {
	return new Promise((resolve,reject) => {
		let newsletters = [];
		csv().fromFile(filePath)
			.on('json', rowToJson => {
				newsletters.push(rowToJson);
			})
			.on('error', err => {
				reject(err)
			})
			.on('done', () => {
				resolve(newsletters);
			});
	});
}

function getNewsletters() {
	return new Promise((resolve,reject) => {
		Newsletter.find(function(err, newsletters) {
			if(err) {
				console.log(err)
				reject(err);
			};

			resolve(newsletters);
		})
	});
}
function getBrands() {
	return new Promise((resolve,reject) => {
		Brand.find(function(err, brands) {
			if(err) {
				console.log(err)
				reject(err);
			};

			resolve(brands);
		})
	});
}
function getCategories() {
	return new Promise((resolve,reject) => {
		Category.find(function(err, categories) {
			if(err) {
				console.log(err)
				reject(err);
			};

			resolve(categories);
		})
	});
}
function storeNewData(fileData) {
	const documents = createDBDocuments(fileData);
	const insertCallback = function(err, docs, doctype) {
		if(err && err.code != 11000)
			console.log(err);
		else if (docs)
			console.log(`Stored ${docs.insertedCount} new ${doctype}`);
	}

	// Insert documents in db
	Newsletter.collection.insert(documents.newsletters, { ordered: false }, (err, docs) => insertCallback(err, docs, 'newsletters'));
	Brand.collection.insert(documents.brands, { ordered: false }, (err, docs) => insertCallback(err, docs, 'brands'));
	Category.collection.insert(documents.categories, { ordered: false }, (err, docs) => insertCallback(err, docs, 'categories'));
}

function createDBDocuments(fileData) {
	let newsletters = [];
	let brands = [];
	let categories = [];

	// Loop on each provided line
	fileData.forEach(newsletter => {
		// Create newsletter documents
		newsletters.push(new Newsletter({
			id: newsletter.ID,
			date: newsletter.DATE,
			brand: newsletter.MARQUE,
			category: newsletter.CATEGORIE,
			subject: newsletter.OBJET,
			screenshotLink: newsletter.CREA_CAPTURE,
			onlineVersionLink: newsletter.VERSION_ENLIGNE
		}));

		// Create Brand Documents
		brands.push(new Brand({
			id: newsletter.MARQUE.toLowerCase().replace(/ /g, ''),
			name: newsletter.MARQUE
		}));

		// Create Category Documents
		categories.push(new Brand({
			id: newsletter.CATEGORIE.toLowerCase().replace(/ /g, ''),
			name: newsletter.CATEGORIE
		}));

	});

	return {
		newsletters: newsletters,
		brands: brands,
		categories: categories
	}
}
