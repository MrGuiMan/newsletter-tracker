import { h, render } from 'preact';
import App from './components/App';

function renderApp() {
	render(<App />, document.getElementById('app'));
}
(function() {
	renderApp();
	// Bind upload button
	document.getElementById('file-input').addEventListener('change', function(e) {
		document.getElementById('file-upload-form').submit();
	});
})();

// Set up HMR re-rendering.
if (module.hot) {
  module.hot.accept();
  module.hot.accept('./components/App.js', renderApp);
}
