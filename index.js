const fs = require('fs');
const path = require('path');
const express = require('express');
const csv = require('csvtojson');

// Initialize Server
const app = new express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

// Root Path
app.get('/', function(req, res) {
	parseCSV()
		.then(newsletters => {
			res.render('pages/index', {
				newsletters: newsletters,
				brands: getBrands(newsletters)
			});
		})
		.catch(err => {
			res.sendStatus(500);
		});
});

// Start Server
app.listen(app.get('port'), (req, res) => {
	console.log(`Server running on port ${app.get('port')}`);
})

function parseCSV() {
	return new Promise((resolve,reject) => {
		let newsletters = [];
		csv().fromFile(path.join(__dirname, './tao_veille.csv'))
			.on('json', rowToJson => {
				newsletters.push(rowToJson);
			})
			.on('error', err => {
				console.log(err);
				reject(err)
			})
			.on('done', () => {
				resolve(newsletters);
			});
	});
}

function getBrands(newsletters) {
	let brands = [];
	newsletters.map(function(newsletter) {
		return newsletter.MARQUE;
	})
	.sort()
	.forEach(function(brand) {
		const previousBrand = brands[brands.length - 1];

		if(!previousBrand || previousBrand.toLowerCase() != brand.toLowerCase()) {
			brands.push(brand);
		}
	});

	return brands
}
