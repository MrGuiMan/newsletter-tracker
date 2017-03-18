import { h, render, Component } from 'preact';
import './Newsletter.scss';

export default class Newsletter extends Component {
	render() {
		const { newsletter } = this.props;
		const imgLink = newsletter.screenshotLink;
		return (
			<li className="newsletter-wrapper">
				<div className="newsletter">
					<a className="capture" href={imgLink} style={"background-image: url(" + imgLink + ")"}></a>
					<div className="info">
						<p className="brand">{this.props.getBrandLabel(newsletter.brand)}</p>
						<p className="details">
							<span>{(new Date(newsletter.date)).toLocaleDateString()}</span>
							<span class="category">{this.props.getCategoryLabel(newsletter.category)}</span>
						</p>
						<p className="subject">{newsletter.subject}</p>
						<a className="goto" href={newsletter.onlineVersionLink}></a>
					</div>
				</div>
			</li>
		)
	}
}
