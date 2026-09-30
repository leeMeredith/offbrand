// offbrand as web components: drop a tag into any page, no other code needed.
//
//   <script type="module" src="offbrand/offbrand-ad.js"></script>
//
//   <offbrand-ad size="rectangle" every="3d" href="about.html"></offbrand-ad>
//     size   leaderboard (728 x 90), rectangle (300 x 250, default), skyscraper (160 x 600)
//     every  week (default), 3d, or 12h: how often the campaign changes
//     href   optional: makes the ad a link
//
//   <offbrand-campaign></offbrand-campaign>
//     this week's campaign in all three sizes, with buttons to browse other weeks
//
// Each tag keeps its styles inside its own shadow root, so the page's CSS
// can't reach in and offbrand's can't leak out. Changing an attribute redraws.
import { placeAd, mount } from "./offbrand.js";

var STYLES = new URL("./offbrand.css", import.meta.url).href;

function shell(host) {
	var root = host.shadowRoot || host.attachShadow({ mode: "open" });
	root.innerHTML =
		'<link rel="stylesheet" href="' + STYLES + '">' +
		'<style>:host { display: inline-block; max-width: 100%; } :host([size="leaderboard"]) { display: block; }</style>' +
		'<div part="ad"></div>';
	return root.querySelector("div");
}

class OffbrandAd extends HTMLElement {
	static get observedAttributes() { return ["size", "every", "href"]; }
	connectedCallback() { this.draw(); }
	attributeChangedCallback() { if (this.isConnected) this.draw(); }
	draw() {
		var size = this.getAttribute("size") || "rectangle";
		if (["leaderboard", "rectangle", "skyscraper"].indexOf(size) < 0) size = "rectangle";
		placeAd(shell(this), size, this.getAttribute("href") || undefined, this.getAttribute("every") || undefined);
	}
}

class OffbrandCampaign extends HTMLElement {
	connectedCallback() {
		if (this.shadowRoot) return;
		var box = shell(this);
		this.shadowRoot.querySelector("style").textContent +=
			" :host { display: block; } button { font: inherit; padding: 2px 10px; cursor: pointer; }" +
			" .offbrand-credit a { color: inherit; }";
		mount(box);
	}
}

if (!customElements.get("offbrand-ad")) customElements.define("offbrand-ad", OffbrandAd);
if (!customElements.get("offbrand-campaign")) customElements.define("offbrand-campaign", OffbrandCampaign);
