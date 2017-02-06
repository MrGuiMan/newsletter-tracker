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
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/newsletters");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify({
		category: document.getElementById('filter-category').value,
		brand: document.getElementById('filter-brand').value,
	}));
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			const response = JSON.parse(xhr.responseText);
			if (xhr.status === 200) {
				renderNewsletters(response)
			}
		}
	}
}

function renderNewsletters(newsletters) {
	let newslettersHTML = '';

	newsletters.forEach(function(newsletter) {
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
			newslettersHTML += nlDOM;
	});

	document.getElementById('newsletter-list').innerHTML = newslettersHTML;
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
