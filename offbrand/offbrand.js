// offbrand: generative advertising. Public-domain museum art and invented
// brands, recast as a new campaign every week, for a product that never appears.
// One brand, one palette, one picture, and one line of copy run across three
// standard web ad sizes, so the set looks like a real campaign. The brand name
// is an Ortho word, and the copy hints at a product without ever naming it.
//
// The ingredients below are the defaults, curated by hand. A site can replace
// any of them with configure({ headlines: [...], palettes: [...] }).
import { Ortho } from "../ortho/index.js";

// Palettes: background, ink, accent.
var PALETTES = [
	["#f4efe6", "#1d1d1b", "#c8553d"],
	["#101820", "#f2f2f2", "#fee715"],
	["#e8f0ee", "#123c3a", "#2a9d8f"],
	["#fdf0f4", "#3b1f2b", "#d1495b"],
	["#eeeeee", "#111111", "#3a5bd9"],
	["#1f1a17", "#efe6da", "#d4a373"]
];

// Headlines: {B} is the brand. Suggestive, never saying what is for sale.
var HEADLINES = [
	"You already know.",
	"Finally, {B}.",
	"Ask for it by name.",
	"Not for everyone.",
	"Some things you just feel.",
	"Made for the part of you that waits.",
	"Everyone's talking. Quietly.",
	"You deserve the good one.",
	"It changes everything. Slightly.",
	"Once you know, you know."
];
var LINES = [
	"Available wherever you are.",
	"Now in a new shape.",
	"Limited time. Unlimited you.",
	"Try it. Tell no one.",
	"Results may vary. Yours won't.",
	"The one they don't advertise.",
	"Better than yesterday's.",
	"As seen in your dreams."
];
var CALLS = ["Find yours", "Learn more", "Get it now", "See why", "Start today"];

// Pictures come from one of these each week, so campaigns stay
// consistently inconsistent:
//   "shape"  a drawn product shape in the campaign colours
//   "aic"    a public-domain work from the Art Institute of Chicago
//   "met"    a public-domain work from The Met's Open Access collection
//   "local"  one of your own images below, if any
// Local images: web-sized copies you host yourself, each with a credit, e.g.
//   { src: "assets/img/ads/vase.jpg", credit: "The Met, CC0" }
var IMAGES = [];
var SOURCES = ["shape", "aic", "met", "aic", "met"];
var SHAPES = ["bottle", "orb", "box", "tube"];
var LAYOUTS = ["split", "split", "overlay"];
var DECOS = ["none", "none", "frame", "double", "corners"];
// 1 shows the whole picture (filling the space); higher values show a detail.
var ZOOMS = [1, 1, 1.5, 2, 2.5, 3];
// Font pairings from Google Fonts: [headline, small text, fallback style].
// Only the week's pair is downloaded.
var FONTS = [
	["Playfair Display", "Inter", "serif"],
	["Bebas Neue", "Work Sans", "sans-serif"],
	["DM Serif Display", "DM Sans", "serif"],
	["Abril Fatface", "Lato", "serif"],
	["Archivo Black", "Archivo", "sans-serif"],
	["Cormorant Garamond", "Montserrat", "serif"],
	["Fraunces", "Karla", "serif"],
	["Space Grotesk", "Space Grotesk", "sans-serif"]
];

// Search words for the museum sources: things you could imagine selling.
var SUBJECTS = ["vase", "bottle", "jar", "mirror", "chair", "glove", "shoe", "hat", "cup",
	"perfume", "clock", "lamp", "fan", "comb", "ring", "box", "teapot", "bowl", "mask", "fruit"];

// All the ingredient lists, under their setting names.
export var defaults = {
	palettes: PALETTES,
	headlines: HEADLINES,
	lines: LINES,
	calls: CALLS,
	images: IMAGES,
	sources: SOURCES,
	shapes: SHAPES,
	subjects: SUBJECTS,
	layouts: LAYOUTS,
	decos: DECOS,
	zooms: ZOOMS,
	fonts: FONTS
};
var settings = Object.assign({}, defaults);

// Replace any ingredient lists, e.g. configure({ headlines: ["Yours."] }).
export function configure(options) {
	Object.assign(settings, options);
}

function loadFonts(pair) {
	var href = "https://fonts.googleapis.com/css2?family=" +
		pair.slice(0, 2).map(function (f) { return f.replace(/ /g, "+") + ":wght@400;700"; }).join("&family=") +
		"&display=swap";
	if (document.querySelector('link[href="' + href + '"]')) return;
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = href;
	document.head.appendChild(link);
}

function isoWeek(d) {
	var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	var day = t.getUTCDay() || 7;
	t.setUTCDate(t.getUTCDate() + 4 - day);
	var start = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
	return { year: t.getUTCFullYear(), week: Math.ceil(((t - start) / 86400000 + 1) / 7) };
}

function pick(o, list) { return list[o.rng.below(list.length)]; }

export function campaign(year, week) {
	var o = new Ortho(year * 100 + week);
	var brand = o.word(5 + o.rng.below(3), { contractions: false });
	brand = brand.charAt(0).toUpperCase() + brand.slice(1);
	return {
		year: year, week: week, brand: brand,
		palette: pick(o, settings.palettes),
		headline: pick(o, settings.headlines).replace("{B}", brand),
		line: pick(o, settings.lines),
		call: pick(o, settings.calls),
		source: pick(o, settings.images.length ? settings.sources.concat(["local", "local"]) : settings.sources),
		subject: pick(o, settings.subjects),
		pickIndex: o.rng.below(1000),
		local: settings.images.length ? pick(o, settings.images) : null,
		shape: pick(o, settings.shapes),
		// Layout choices, so campaigns vary the way real ones do:
		layout: pick(o, settings.layouts),     // picture beside the words, or words on top of it
		flip: o.rng.below(2) === 1,   // picture on the right (or bottom) instead of left (or top)
		deco: pick(o, settings.decos),         // decorative border or corners
		// Crop: how far to zoom into the picture, and where (percent across and down).
		crop: { zoom: pick(o, settings.zooms), x: 20 + o.rng.below(61), y: 20 + o.rng.below(61) },
		fonts: pick(o, settings.fonts)         // headline typeface and small-text typeface
	};
}

export function thisWeek() {
	var w = isoWeek(new Date());
	return campaign(w.year, w.week);
}

// Find the week's picture: { src, credit } or null (then the shape shows).
// Results are remembered per campaign, so each week asks the museum once.
function getJSON(url) {
	var ctl = new AbortController();
	var timer = setTimeout(function () { ctl.abort(); }, 6000);
	return fetch(url, { signal: ctl.signal }).then(function (r) {
		clearTimeout(timer);
		if (!r.ok) throw new Error(r.status);
		return r.json();
	});
}

function fromAIC(c) {
	var url = "https://api.artic.edu/api/v1/artworks/search?q=" + encodeURIComponent(c.subject) +
		"&query[term][is_public_domain]=true&fields=id,title,artist_title,image_id&limit=30";
	return getJSON(url).then(function (res) {
		var works = (res.data || []).filter(function (w) { return w.image_id; });
		if (!works.length) return null;
		var w = works[c.pickIndex % works.length];
		return {
			src: "https://www.artic.edu/iiif/2/" + w.image_id + "/full/600,/0/default.jpg",
			credit: w.title + (w.artist_title ? ", " + w.artist_title : "") + ". Art Institute of Chicago, CC0",
			href: "https://www.artic.edu/artworks/" + w.id
		};
	});
}

function fromMet(c) {
	var base = "https://collectionapi.metmuseum.org/public/collection/v1/";
	return getJSON(base + "search?hasImages=true&q=" + encodeURIComponent(c.subject)).then(function (res) {
		var ids = res.objectIDs || [];
		if (!ids.length) return null;
		// Try a few objects until one is public domain with an image.
		function attempt(n) {
			if (n >= 4) return null;
			var id = ids[(c.pickIndex + n * 7) % ids.length];
			return getJSON(base + "objects/" + id).then(function (w) {
				if (!w.isPublicDomain || !w.primaryImageSmall) return attempt(n + 1);
				return {
					src: w.primaryImageSmall,
					credit: w.title + (w.artistDisplayName ? ", " + w.artistDisplayName : "") + ". The Met, CC0",
					href: w.objectURL
				};
			});
		}
		return attempt(0);
	});
}

export function findPicture(c) {
	if (c.source === "shape") return Promise.resolve(null);
	if (c.source === "local") return Promise.resolve(c.local);
	var key = "offbrand-picture-" + c.year + "-" + c.week;
	try {
		var saved = localStorage.getItem(key);
		if (saved) return Promise.resolve(JSON.parse(saved));
	} catch (e) {}
	var find = c.source === "aic" ? fromAIC : fromMet;
	return find(c).then(function (pic) {
		try { localStorage.setItem(key, JSON.stringify(pic)); } catch (e) {}
		return pic;
	}).catch(function () { return null; });
}

function shapeSVG(kind, accent, ink) {
	var body = {
		bottle: '<rect x="38" y="10" width="24" height="16" rx="3" fill="' + ink + '"/><rect x="26" y="24" width="48" height="70" rx="12" fill="' + accent + '"/><rect x="34" y="48" width="32" height="18" rx="2" fill="#fff" opacity=".8"/>',
		orb: '<circle cx="50" cy="52" r="38" fill="' + accent + '"/><ellipse cx="38" cy="38" rx="12" ry="8" fill="#fff" opacity=".45"/>',
		box: '<path d="M18 34 50 18 82 34 82 76 50 92 18 76Z" fill="' + accent + '"/><path d="M18 34 50 50 82 34M50 50V92" stroke="' + ink + '" stroke-width="2" fill="none" opacity=".5"/>',
		tube: '<rect x="30" y="8" width="40" height="72" rx="6" fill="' + accent + '"/><rect x="40" y="80" width="20" height="12" rx="2" fill="' + ink + '"/><rect x="36" y="22" width="28" height="30" rx="2" fill="#fff" opacity=".8"/>'
	}[kind];
	return '<svg viewBox="0 0 100 100" role="img" aria-label="Product">' + body + '</svg>';
}

function adHTML(c, size, href) {
	var bg = c.palette[0], ink = c.palette[1], accent = c.palette[2];
	var picture = shapeSVG(c.shape, accent, ink);
	var tag = href ? 'a href="' + href + '"' : "div";
	// Words go on top only of real pictures; a drawn shape keeps them beside it.
	var layout = c.source === "shape" ? "split" : c.layout;
	var classes = "offbrand offbrand-" + size + " offbrand-" + layout + (c.flip ? " offbrand-flip" : "") + " offbrand-deco-" + c.deco;
	// Until a picture arrives, the shape sits on a tint of the background.
	var tone = luminance(bg) > 0.5 ? "dark" : "light";
	var corners = c.deco === "corners"
		? '<span class="offbrand-corner tl"></span><span class="offbrand-corner tr"></span><span class="offbrand-corner bl"></span><span class="offbrand-corner br"></span>'
		: "";
	loadFonts(c.fonts);
	var fonts = ";--ob-head-font:'" + c.fonts[0] + "'," + c.fonts[2] + ";--ob-body-font:'" + c.fonts[1] + "',sans-serif";
	return '<' + tag + ' class="' + classes + '" data-tone="' + tone + '" style="--ob-bg:' + bg + ';--ob-ink:' + ink + ';--ob-accent:' + accent + fonts + '">' + corners +
		'<div class="offbrand-pic">' + picture + '</div>' +
		'<div class="offbrand-copy"><strong class="offbrand-brand">' + c.brand + '</strong>' +
		'<span class="offbrand-head">' + c.headline + '</span>' +
		'<span class="offbrand-line">' + c.line + '</span>' +
		'<span class="offbrand-call">' + c.call + ' ›</span></div>' +
		'<span class="offbrand-mark">Ad</span></' + (href ? "a" : "div") + '>';
}

function luminance(hex) {
	var n = parseInt(hex.slice(1), 16);
	return (0.2126 * (n >> 16 & 255) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255)) / 255;
}

// How bright the picture is where the words sit (the lower half, or the upper
// half when flipped), from 0 (black) to 1 (white). Null if the museum doesn't
// allow the picture to be read.
function brightness(img, flip, crop) {
	try {
		var cv = document.createElement("canvas");
		cv.width = 24; cv.height = 24;
		var cx = cv.getContext("2d");
		// Measure only the cropped part that shows.
		var w = img.naturalWidth / crop.zoom, h = img.naturalHeight / crop.zoom;
		var sx = Math.min(Math.max(img.naturalWidth * crop.x / 100 - w / 2, 0), img.naturalWidth - w);
		var sy = Math.min(Math.max(img.naturalHeight * crop.y / 100 - h / 2, 0), img.naturalHeight - h);
		cx.drawImage(img, sx, sy, w, h, 0, 0, 24, 24);
		var d = cx.getImageData(0, flip ? 0 : 12, 24, 12).data;
		var sum = 0;
		for (var i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
		return sum / (d.length / 4) / 255;
	} catch (e) { return null; }
}

// Swap the drawn shape for the week's picture once it arrives. For words on
// top of the picture, pick light or dark text from the picture's brightness.
function applyPicture(root, pic, flip, crop) {
	crop = crop || { zoom: 1, x: 50, y: 50 };
	if (!pic) return;
	function load(readable) {
		var img = new Image();
		if (readable) img.crossOrigin = "anonymous";
		img.alt = "";
		img.onload = function () {
			var b = readable ? brightness(img, flip, crop) : null;
			// Unknown brightness: light text over a dark wash is the safe choice.
			var tone = b !== null && b > 0.55 ? "dark" : "light";
			root.querySelectorAll(".offbrand").forEach(function (ad) {
				ad.setAttribute("data-tone", tone);
				var box = ad.querySelector(".offbrand-pic");
				box.textContent = "";
				var shown = img.cloneNode();
				shown.style.objectPosition = crop.x + "% " + crop.y + "%";
				shown.style.transformOrigin = crop.x + "% " + crop.y + "%";
				shown.style.transform = "scale(" + crop.zoom + ")";
				box.appendChild(shown);
			});
		};
		// Some museums don't allow reading pixels; show the picture anyway.
		img.onerror = function () { if (readable) load(false); };
		img.src = pic.src;
	}
	load(true);
}

// A single ad on one of the site's own pages, e.g. placeAd(el, "rectangle").
// It shows this week's campaign; pass href to make it a link.
export function placeAd(el, size, href) {
	var c = thisWeek();
	el.innerHTML = adHTML(c, size, href);
	findPicture(c).then(function (pic) { applyPicture(el, pic, c.flip, c.crop); });
}

export function mount(el) {
	var now = isoWeek(new Date());
	var shown = { year: now.year, week: now.week };

	el.innerHTML =
		'<p class="offbrand-controls"><span class="offbrand-week"></span> ' +
		'<button type="button" name="other">Another campaign</button> ' +
		'<button type="button" name="now">This week</button></p>' +
		'<div class="offbrand-set" aria-live="polite"></div><p class="offbrand-credit"></p>';
	var set = el.querySelector(".offbrand-set");
	var current = null;

	function show() {
		var c = campaign(shown.year, shown.week);
		current = c;
		el.querySelector(".offbrand-week").textContent = c.brand + " — week " + c.week + ", " + c.year;
		set.innerHTML = adHTML(c, "leaderboard") + adHTML(c, "rectangle") + adHTML(c, "skyscraper");
		var credit = el.querySelector(".offbrand-credit");
		credit.textContent = "";
		findPicture(c).then(function (pic) {
			if (c !== current) return;
			applyPicture(set, pic, c.flip, c.crop);
			if (pic && pic.credit) {
				credit.textContent = "Image: ";
				var a = document.createElement("a");
				a.href = pic.href || pic.src;
				a.rel = "noopener";
				a.textContent = pic.credit;
				credit.appendChild(a);
			}
		});
	}
	el.querySelector('[name="other"]').addEventListener("click", function () {
		shown = { year: 2000 + Math.floor(Math.random() * 40), week: 1 + Math.floor(Math.random() * 52) };
		show();
	});
	el.querySelector('[name="now"]').addEventListener("click", function () {
		shown = { year: now.year, week: now.week };
		show();
	});
	show();
}


