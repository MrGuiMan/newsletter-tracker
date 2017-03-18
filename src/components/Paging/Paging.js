import { h, render, Component } from 'preact';
import './Paging.scss';

export default class Paging extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div id="paging">
				<ul>{this.getPages()}</ul>
			</div>
		)
	}
	getPages() {
		let pages = [];
		for(var i = 1; i <= this.props.pagecount; i++) {
			const className = i === this.props.activePage ? 'active' : '';
			pages.push(
				<li className={className} page={i} onClick={this.props.onPageChange.bind(null, { page: i })}>{i}</li>
			);
		}
		return pages
	}
}
