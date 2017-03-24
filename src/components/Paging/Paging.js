import { h, render, Component } from 'preact';
import "./Paging.scss";

export default class Paging extends Component {
	constructor(props) {
		super(props);
		this.state.lastValidInputPage = this.props.activePage;
		this.onInputChange = this.onInputChange.bind(this);
		this.goToPreviousPage = this.goToPreviousPage.bind(this);
		this.goToNextPage = this.goToNextPage.bind(this);
	}
	render() {
		if(this.props.pagecount > 1) {
			return (
				<div id="paging">
					<ul>
						{this.props.activePage > 1 &&
							<li><button type="button" onClick={this.goToPreviousPage}>&#60;</button></li>
						}
						{this.getPages()}
						{this.props.activePage < this.props.pagecount &&
							<li><button type="button" onClick={this.goToNextPage}>&#62;</button></li>
						}
					</ul>
				</div>
			)
		}
	}
	// Get Pages to display (display surrounding x pages)
	getPages() {
		let pages = [];
		const surroundingPagesCount = 4;
		const firstPage = Math.min(this.props.pagecount - surroundingPagesCount, Math.max(1, this.props.activePage - Math.floor(surroundingPagesCount / 2)));

		let countdown = surroundingPagesCount + 1;
		for(var i = firstPage; countdown > 0; i++) {
			const className = i === this.props.activePage ? 'active' : '';
			pages.push(
				<li className={className} page={i} onClick={this.props.onPageChange.bind(null, { page: i })}>{i}</li>
			);
			--countdown;
		}
		return pages
	}
	onInputChange(event) {
		try {
			// Make sure we're able to parse the new value
			let newPage = parseInt(event.target.value);
			// And that the value is in the range of available page
			if(newPage <= 0 || newPage > this.props.pagecount) {
				throw "Invalid Page"
			}

			// If we got there, update the page
			this.setState({ lastValidInputPage: newPage });
			this.props.onPageChange({ page: newPage });
		} catch(e) {
			event.target.value = this.state.lastValidInputPage;
		}
		// Make sure to stop propagation to avoid preact issue (see https://github.com/developit/preact/issues/470)
		event.stopPropagation();
	}
	goToPreviousPage(e) {
		const newPage = this.props.activePage - 1
		this.props.onPageChange({ page: newPage });
		// Make sure to stop propagation to avoid preact issue (see https://github.com/developit/preact/issues/470)
		e.stopPropagation();
	}
	goToNextPage(e) {
		const newPage = this.props.activePage + 1;
		this.props.onPageChange({ page: newPage });
		// Make sure to stop propagation to avoid preact issue (see https://github.com/developit/preact/issues/470)
		e.stopPropagation();

	}
}
