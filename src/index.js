'use strict';

(function() {
	document.getElementById('filter-list-style').addEventListener('change', function(e) {
		document.getElementById('newsletter-list').className = this.value;
	});
})()
