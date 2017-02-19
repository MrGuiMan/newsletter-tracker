import { h, render, Component } from 'preact';
import Filter from './Filter';

export default class FilterList extends Component {
	constructor() {
		super();
		this.state.filtersData = {
			months: [],
			brands: [],
			categories: [],
			themes: []
		};
	}
	componentWillMount() {
		this.fetchFilters();
	}
	render() {
		const monthLabel = (data) => {
			return data.monthLabel + ' ' + data.year;
		}
		return (
			<div id="filters">
				<Filter identifier="date" elements={this.state.filtersData.months}
							ellabel={monthLabel} elid="id" placeholder="Date"></Filter>
				<Filter identifier="brand" elements={this.state.filtersData.brands}
							ellabel="name" elid="id" placeholder="Marque"></Filter>
				<Filter identifier="category" elements={this.state.filtersData.categories}
							ellabel="name" elid="id" placeholder="Categorie"></Filter>
				<Filter identifier="theme" elements={this.state.filtersData.themes}
							ellabel="name" elid="id" placeholder="Thème"></Filter>
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
					filtersData: responseObject
				});
			}
		}
	}
}
