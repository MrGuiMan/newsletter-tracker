'use strict';

(function() {
	document.getElementById('filter-list-style').addEventListener('change', function(e) {
		document.getElementById('newsletter-list').className = this.value;
	});
	const filters = document.getElementsByClassName('filter');
	for(var i = 0; i < filters.length; i++) {
		filters[i].addEventListener('change', updateNewsletters);
	}
	document.getElementById('file-input').addEventListener('change', function(e) {
		document.getElementById('file-upload-form').submit();
	});

	updateNewsletters();
})()


function updateNewsletters() {
	const selectedDate = getSelectedDate()
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/newsletters");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify({
		category: document.getElementById('filter-category').value,
		brand: document.getElementById('filter-brand').value,
		month: selectedDate.month,
		year: selectedDate.year
	}));
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			window.data.newsletters = JSON.parse(xhr.responseText);
			renderNewsletters();
		}
	}
}

function renderNewsletters() {
	document.getElementById('newsletter-list').innerHTML = '';
	window.data.newsletters.forEach(function(newsletter) {
		let imgLink = newsletter.screenshotLink;
		let nlDOM = `
			<li class="newsletter">
					<a class="capture" href="` + imgLink +`"><span style="background-image: url(` + imgLink +`)"></span></a>
					<div class="info">
						<p class="name">` + getBrandLabel(newsletter.brand) +`</p>
						<p class="details"><span>` + newsletter.date +`</span> - <span>` + getCategoryLabel(newsletter.category) +`</span>
						<p class="subject">` + newsletter.subject +`</p>
						<p class="link"><a href="` + newsletter.onlineVersionLink +`">Voir la version en ligne >></a></p>
					</div>
			</li>`
			document.getElementById('newsletter-list').innerHTML += nlDOM;
	});
}

function getBrandLabel(id) {
	if(window.data.brands) {
		return window.data.brands
						.filter(function(brand) { return brand.id === id })
						.map(function(brand) { return brand.name })[0]
	} else {
		return ""
	}
}
function getCategoryLabel(id) {
	if(window.data.categories) {
		return window.data.categories
						.filter(function(cat) { return cat.id === id })
						.map(function(cat) { return cat.name })[0]
	} else {
		return ""
	}
}
function getSelectedDate() {
	const dateFilter = document.getElementById('filter-date');
	const selectedOption = dateFilter.options[dateFilter.selectedIndex];
	
	return {
		month: selectedOption.attributes['data-month'].value,
		year: selectedOption.attributes['data-year'].value
	}
}
