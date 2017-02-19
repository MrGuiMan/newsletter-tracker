import { h, render, Component } from 'preact';

export default class Newsletter extends Component {
	render() {
		const { newsletter } = this.props;
		const imgLink = newsletter.screenshotLink;
		return (
			<li class="newsletter-wrapper">
				<div class="newsletter">
					<a class="capture" href={imgLink} style={"background-image: url(" + imgLink + ")"}></a>
					<div class="info">
						<p class="brand">{this.props.getBrandLabel(newsletter.brand)}</p>
						<p class="details">
							<span>{(new Date(newsletter.date)).toLocaleDateString()}</span>
							<span class="category">{this.props.getCategoryLabel(newsletter.category)}</span>
						</p>
						<p class="subject">{newsletter.subject}</p>
						<a class="goto" href={newsletter.onlineVersionLink}></a>
					</div>
				</div>
			</li>
		)
	}
}
