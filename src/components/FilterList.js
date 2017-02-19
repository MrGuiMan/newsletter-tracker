import { h, render, Component } from 'preact';
import Filter from './Filter';
import Paging from './Paging';

export default class FilterList extends Component {
	render() {
		const { months, brands, categories, themes } = this.props.filters;
		const monthLabel = (data) => {
			return data.monthLabel + ' ' + data.year;
		}
		return (
			<div id="filters-wrapper">
				<div id="filters">
					<Filter identifier="date" elements={months} onChange={this.onDateChange.bind(this)}
								ellabel={monthLabel} elid="id" placeholder="Date"></Filter>
					<Filter identifier="brand" elements={brands} onChange={this.onFilterChange.bind(this, 'brand')}
								ellabel="name" elid="id" placeholder="Marque"></Filter>
					<Filter identifier="category" elements={categories} onChange={this.onFilterChange.bind(this, 'category')}
								ellabel="name" elid="id" placeholder="Categorie"></Filter>
					<Filter identifier="theme" elements={themes} onChange={this.onFilterChange.bind(this, 'theme')}
								ellabel="name" elid="id" placeholder="Thème"></Filter>
				</div>
			</div>
		)
	}
	onDateChange(elData) {
		this.props.onFilterChange({
			month: elData.month,
			year: elData.year
		})
	}
	onFilterChange(key, elData) {
		const newFilter = {};
		newFilter[key] = elData.id;
		this.props.onFilterChange(newFilter);
	}
}
