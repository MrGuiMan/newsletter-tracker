import { h, render } from 'preact';
import App from './components/App';


(function() {
	render(<App />, document.getElementById('app'));
	// Bind upload button
	document.getElementById('file-input').addEventListener('change', function(e) {
		document.getElementById('file-upload-form').submit();
	});
})()
