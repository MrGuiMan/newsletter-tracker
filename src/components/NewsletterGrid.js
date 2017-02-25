import { h, render, Component } from 'preact';
import Newsletter from './Newsletter';

export default class NewsletterGrid extends Component {
	render() {
		return (
			<ul id="newsletter-list">
				{this.props.newsletters.map((newsletter) => {
					return <Newsletter newsletter={newsletter}
								getBrandLabel={this.getBrandLabel.bind(this)}
								getCategoryLabel={this.getCategoryLabel.bind(this)}
							/>
				})}
			</ul>
		)
	}
 	getBrandLabel(id) {
		if(this.props.brands) {
			return this.props.brands
							.filter(function(brand) { return brand.id === id })
							.map(function(brand) { return brand.name })[0]
		} else {
			return ""
		}
	}
	getCategoryLabel(id) {
		if(this.props.categories) {
			return this.props.categories
							.filter(function(cat) { return cat.id === id })
							.map(function(cat) { return cat.name })[0]
		} else {
			return ""
		}
	}
}
