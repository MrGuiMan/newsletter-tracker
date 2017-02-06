const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer  = require('multer');
const upload = multer({ dest: 'upload/' });
const tools = require('./tools');

// Controllers
const NewsletterController = require('./controllers/NewsletterController');
const CategoryController = require('./controllers/CategoryController');
const BrandController = require('./controllers/BrandController');

// Initialize Server
const app = new express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static('public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

// Connect to DB
mongoose.connect('mongodb://mongo:27017/tao-nl-tracker');

// Root Path
app.get('/', (req, res) => {
	// Get data and return home page
	Promise.all([BrandController.getBrands(), CategoryController.getCategories()])
		.then(values => {
			res.render('pages/index', {
				brands: values[0],
				categories: values[1]
			});
		})
		.catch(err => {
			console.log(err);
			res.sendStatus(500);
		});
});

app.post('/newsletters', (req, res) => {
	NewsletterController.getNewsletters(req.body)
		.then(newsletters => res.json(newsletters));
})
app.post('/upload', upload.single('nlfile'), (req, res) => {
	const filePath = path.join(__dirname, req.file.path);

	// Parse file
	// then store content in db
	// then delete file
	tools.parseCSV(filePath)
		.then(newsletters => storeNewData(newsletters))
		.then(() => fs.unlink(filePath))
		.then(() => res.redirect('/'))
		.catch(err => { console.log(err); res.sendStatus(500); });
});

// Start Server
app.listen(app.get('port'), (req, res) => {
	console.log(`Server running on port ${app.get('port')}`);
})

function storeNewData(fileData) {
	let newsletters = [];
	let brands = [];
	let categories = [];

	// Loop on each provided line to create related documents
	fileData.forEach(newsletter => {
		brands.push(BrandController.createDocumentFromNewsletterJSON(newsletter));
		categories.push(CategoryController.createDocumentFromNewsletterJSON(newsletter));
		newsletters.push(NewsletterController.createDocumentFromNewsletterJSON(newsletter));
	});

	// Insert documents to DB
	NewsletterController.insertNewsletters(newsletters);
	CategoryController.insertCategories(categories);
	BrandController.insertBrands(brands);
}
