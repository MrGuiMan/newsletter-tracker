import { h, render, Component } from 'preact';
import FilterList from './FilterList';
import NewsletterGrid from './NewsletterGrid';
import Paging from './Paging';

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			filters: {
				months: [],
				categories: [],
				brands: [],
				themes: [],
				pageCount: 0
			},
			newsletters: [],
			activeFilters: {
				month: null,
				year: null,
				category: null,
				brand: null,
				theme: null,
				page: 1
			},
		}
	}
	componentWillMount() {
		this.fetchFilters();
		this.fetchNewsletters();
	}
	render() {
		return (
			<div>
				<FilterList filters={this.state.filters} onFilterChange={ this.onFilterChange.bind(this) }/>
				<Paging pagecount={this.state.filters.pageCount} activePage={this.state.activeFilters.page} onPageChange={this.onFilterChange.bind(this)} />

				<div id="main-content">
					<NewsletterGrid newsletters={this.state.newsletters} brands={this.state.filters.brands} categories={this.state.filters.categories}/>
				</div>
			</div>
		)
	}
	fetchFilters() {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", "/filters");
		xhr.send();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				const responseObject = JSON.parse(xhr.responseText);
				console.log(responseObject);
				
				this.setState({
					filters: responseObject
				});
			}
		}
	}
	fetchNewsletters() {
		// Call the Web Service providing filters and paging
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "/newsletters");
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(this.state.activeFilters));
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				const responseObject = JSON.parse(xhr.responseText);

				this.setState({
					newsletters: responseObject.newsletters,
					filters: Object.assign({}, this.state.filters, { pageCount: responseObject.pageCount })
				});
			}
		}
	}
	onFilterChange(filter) {
		this.setState({
			activeFilters: Object.assign({}, this.state.activeFilters, filter)
		});
		this.fetchNewsletters();
	}
}
