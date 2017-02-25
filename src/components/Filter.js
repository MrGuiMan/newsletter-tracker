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
		return (
			<select class="filter" id={id} onChange={(e) => { this.onChange(e.target)} }>
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
	onChange(target) {
		this.props.onChange(this.props.elements[target.selectedIndex - 1]);
	}
}
