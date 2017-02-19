import { h, render } from 'preact';
import FilterList from './components/FilterList';


(function() {
	render(<FilterList />, document.getElementById('filters-wrapper'));

	// Bind filter dropdowns
	// const filters = document.getElementsByClassName('filter');
	// for(var i = 0; i < filters.length; i++) {
	// 	filters[i].addEventListener('change', function() { updateNewsletters(true); });
	// }
	//
	// // Bind input button
	// document.getElementById('file-input').addEventListener('change', function(e) {
	// 	document.getElementById('file-upload-form').submit();
	// });
	//
	// // Bind Paging
	// const paging = document.getElementById('paging');
	// paging.addEventListener('click', function(e) {
	// 	if(e.target.tagName === 'LI' && e.target.className.indexOf('active') === -1) {
	// 		const newPage = parseInt(e.target.attributes['page'].value);
	// 		// Fetch newsletters
	// 		window.data.page = newPage;
	// 		updateNewsletters();
	// 	}
	// })

	// Get newsletters the first time
	//updateNewsletters();
})()


function updateNewsletters(resetPaging) {
	if(resetPaging) {
		window.data.page = 1;
	}

	// Call the Web Service and provide the filters and paging
	const selectedDate = getSelectedDate();
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/newsletters");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify({
		category: document.getElementById('filter-category').value,
		brand: document.getElementById('filter-brand').value,
		theme: document.getElementById('filter-theme').value,
		month: selectedDate.month,
		year: selectedDate.year,
		page: window.data.page
	}));
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			const responseObject = JSON.parse(xhr.responseText);

			// Render newsletter and paging
			renderNewsletters(responseObject.newsletters);

			renderPaging(responseObject.pageCount);
		}
	}
}

function renderPaging(pageCount) {
	const pagingList = document.getElementById('paging').getElementsByTagName('ul')[0];
	pagingList.innerHTML = '';
	for(var i = 1; i < pageCount; i++) {
		const className = i === window.data.page ? 'active' : '';
		pagingList.innerHTML += `
			<li class="` + className + `" page="` + i + `">` + i + `</li>
		`
	}
}

function renderNewsletters(newsletters) {
	document.getElementById('newsletter-list').innerHTML = '';
	newsletters.forEach(function(newsletter) {
		let imgLink = newsletter.screenshotLink;
		let nlDOM = `
			<li class="newsletter-wrapper">
				<div class="newsletter">
					<a class="capture" href="` + imgLink +`" style="background-image: url(` + imgLink +`)"></a>
					<div class="info">
						<p class="brand">` + getBrandLabel(newsletter.brand) +`</p>
						<p class="details">
							<span>` + (new Date(newsletter.date)).toLocaleDateString() +`</span>
							<span class="category">` + getCategoryLabel(newsletter.category) +`</span>
						<p class="subject">` + newsletter.subject +`</p>
						<a class="goto" href="` + newsletter.onlineVersionLink +`"></a>
					</div>
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
