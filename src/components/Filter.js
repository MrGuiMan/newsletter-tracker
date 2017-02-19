import { h, render, Component } from 'preact';

export default class Filter extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const id = `filter-${this.props.identifier}`;
		const getLabel = typeof this.props.ellabel === 'function' ? this.props.ellabel : (el) => {
			return el[this.props.ellabel];
		}
		const getElId = typeof this.props.elid === 'function' ? this.props.elid : (el) => {
			return el[this.props.elid]
		}
		// data-month="<%= month.month %>" data-year="<%= month.year %>" value="<%= month.id %>"
		// month.monthLabel + ' ' + month.year
		return (
			<select class="filter" id={id}>
				<option>{this.props.placeholder || ""}</option>
					{this.props.elements.map(function(el) {
						return (
							<option value={getElId(el)}>
								{getLabel(el)}
							</option>
						)
					})}
			</select>
		)
	}
}
