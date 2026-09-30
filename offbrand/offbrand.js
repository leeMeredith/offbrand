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
//   "cma"    a public-domain work from the Cleveland Museum of Art
//   "smk"    a public-domain work from SMK, the National Gallery of Denmark
//   "local"  one of your own images below, if any
// Local images: web-sized copies you host yourself, each with a credit, e.g.
//   { src: "assets/img/ads/vase.jpg", credit: "The Met, CC0" }
var IMAGES = [];
var SOURCES = ["shape", "shape", "aic", "met", "cma", "smk", "aic", "met", "cma", "smk"];
var SHAPES = ["bottle", "orb", "box", "tube", "jar", "flask", "can", "cone", "pyramid"];
// Behind a drawn shape: a plain tint, a horizon line, or a soft fade.
var BACKDROPS = ["tint", "tint", "horizon", "horizon", "fade"];
// Corner ornaments, drawn in the accent colour, and which corners get them.
var ORNAMENTS = ["none", "none", "none", "vignette", "marginalia", "arabesque", "scrollwork", "acanthus", "english-scroll"];
var PLACEMENTS = ["top", "bottom", "diagonal", "antidiagonal", "all"];
// The disclosure label shown just outside each ad, as real sites do.
var LABELS = ["Advertisement", "Advertisement", "Sponsored", "Ad", "Promoted", "Paid content"];
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
	fonts: FONTS,
	backdrops: BACKDROPS,
	ornaments: ORNAMENTS,
	placements: PLACEMENTS,
	labels: LABELS
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
		fonts: pick(o, settings.fonts),        // headline typeface and small-text typeface
		backdrop: pick(o, settings.backdrops), // behind a drawn shape
		horizon: 45 + o.rng.below(31),        // horizon height, percent from the top
		sky: o.rng.below(2),                  // which of two sky colours
		ornament: pick(o, settings.ornaments),
		placement: pick(o, settings.placements),
		label: pick(o, settings.labels),      // the small disclosure line above each ad
		labelSide: o.rng.below(2) ? "right" : "left"
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

function fromCMA(c) {
	var url = "https://openaccess-api.clevelandart.org/api/artworks/?q=" + encodeURIComponent(c.subject) +
		"&cc0=1&has_image=1&limit=30";
	return getJSON(url).then(function (res) {
		var works = (res.data || []).filter(function (w) { return w.images && w.images.web; });
		if (!works.length) return null;
		var w = works[c.pickIndex % works.length];
		var who = w.creators && w.creators[0] ? w.creators[0].description : "";
		return {
			src: w.images.web.url,
			credit: w.title + (who ? ", " + who : "") + ". Cleveland Museum of Art, CC0",
			href: w.url
		};
	});
}

function fromSMK(c) {
	var url = "https://api.smk.dk/api/v1/art/search/?keys=" + encodeURIComponent(c.subject) +
		"&filters=%5Bhas_image:true%5D,%5Bpublic_domain:true%5D&offset=0&rows=30&lang=en";
	return getJSON(url).then(function (res) {
		var works = (res.items || []).filter(function (w) { return w.image_thumbnail; });
		if (!works.length) return null;
		var w = works[c.pickIndex % works.length];
		var title = w.titles && w.titles[0] ? w.titles[0].title : "Untitled";
		var who = w.production && w.production[0] ? w.production[0].creator : "";
		return {
			src: w.image_thumbnail,
			credit: title + (who ? ", " + who : "") + ". SMK, National Gallery of Denmark, public domain",
			href: w.frontend_url || ("https://open.smk.dk/artwork/image/" + w.object_number)
		};
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
	var find = { aic: fromAIC, met: fromMet, cma: fromCMA, smk: fromSMK }[c.source] || fromAIC;
	return find(c).then(function (pic) {
		try { localStorage.setItem(key, JSON.stringify(pic)); } catch (e) {}
		return pic;
	}).catch(function () { return null; });
}

// Colour helpers for shading: mix two #rrggbb colours, t from 0 (a) to 1 (b).
function mix(a, b, t) {
	var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
	var c = [16, 8, 0].map(function (sh) {
		var u = x >> sh & 255, v = y >> sh & 255;
		return Math.round(u + (v - u) * t);
	});
	return "#" + ((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1);
}

var uid = 0;

// Product shapes with light from the upper left, so they read as objects.
function shapeSVG(kind, accent, ink) {
	var id = "ob" + (++uid);
	var light = mix(accent, "#ffffff", 0.45), dark = mix(accent, "#000000", 0.35);
	var defs = '<defs>' +
		'<linearGradient id="' + id + 'h" x1="0" x2="1"><stop offset="0" stop-color="' + light + '"/><stop offset=".45" stop-color="' + accent + '"/><stop offset="1" stop-color="' + dark + '"/></linearGradient>' +
		'<radialGradient id="' + id + 'r" cx=".35" cy=".32" r=".7"><stop offset="0" stop-color="' + light + '"/><stop offset=".6" stop-color="' + accent + '"/><stop offset="1" stop-color="' + dark + '"/></radialGradient>' +
		'</defs>';
	var H = 'url(#' + id + 'h)', R = 'url(#' + id + 'r)';
	var cap = mix(ink, "#000000", 0.1), label = '#fff';
	var shadow = '<ellipse cx="50" cy="93" rx="30" ry="4" fill="' + ink + '" opacity=".15"/>';
	var body = {
		bottle: '<path d="M42 8h16v10c0 4 12 8 12 18v50c0 4-3 6-6 6H36c-3 0-6-2-6-6V36c0-10 12-14 12-18Z" fill="' + H + '"/><rect x="41" y="4" width="18" height="9" rx="2" fill="' + cap + '"/><rect x="36" y="50" width="28" height="20" rx="2" fill="' + label + '" opacity=".85"/>',
		orb: '<circle cx="50" cy="52" r="36" fill="' + R + '"/><ellipse cx="38" cy="36" rx="9" ry="6" fill="#fff" opacity=".5"/>',
		box: '<path d="M18 34 50 20 82 34 50 48Z" fill="' + light + '"/><path d="M18 34 50 48V90L18 76Z" fill="' + accent + '"/><path d="M82 34 50 48V90L82 76Z" fill="' + dark + '"/>',
		tube: '<path d="M32 10h36l-4 64H36Z" fill="' + H + '"/><rect x="40" y="74" width="20" height="16" rx="2" fill="' + cap + '"/><rect x="38" y="24" width="24" height="28" rx="2" fill="' + label + '" opacity=".85"/>',
		jar: '<rect x="22" y="30" width="56" height="60" rx="10" fill="' + H + '"/><rect x="26" y="18" width="48" height="14" rx="4" fill="' + cap + '"/><rect x="30" y="48" width="40" height="22" rx="2" fill="' + label + '" opacity=".85"/>',
		flask: '<circle cx="50" cy="12" r="7" fill="' + R + '"/><rect x="45" y="18" width="10" height="10" fill="' + cap + '"/><path d="M30 30h40l8 12v38c0 6-4 10-10 10H32c-6 0-10-4-10-10V42Z" fill="' + H + '"/><path d="M30 30h40l8 12H22Z" fill="#fff" opacity=".25"/>',
		can: '<rect x="28" y="20" width="44" height="66" fill="' + H + '"/><ellipse cx="50" cy="86" rx="22" ry="5" fill="' + dark + '"/><ellipse cx="50" cy="20" rx="22" ry="5" fill="' + light + '"/><rect x="28" y="42" width="44" height="18" fill="' + label + '" opacity=".8"/>',
		cone: '<path d="M50 10 80 86H20Z" fill="' + H + '"/><ellipse cx="50" cy="86" rx="30" ry="6" fill="' + dark + '"/>',
		pyramid: '<path d="M50 12 22 82 50 90Z" fill="' + light + '"/><path d="M50 12 78 82 50 90Z" fill="' + dark + '"/>'
	}[kind] || '';
	return '<svg viewBox="0 0 100 100" role="img" aria-label="Product">' + defs + shadow + body + '</svg>';
}

// Behind a drawn shape: plain tint, a two-colour horizon, or a fade.
function backdropCSS(c) {
	var bg = c.palette[0], ink = c.palette[1], accent = c.palette[2];
	var sky = c.sky ? mix(bg, accent, 0.25) : mix(bg, "#ffffff", 0.5);
	var ground = mix(bg, ink, 0.3);
	if (c.backdrop === "horizon") return "linear-gradient(to bottom," + sky + " 0 " + c.horizon + "%," + ground + " " + c.horizon + "% 100%)";
	if (c.backdrop === "fade") return "linear-gradient(to bottom," + sky + "," + ground + ")";
	return "";
}

// Corner ornaments. Each is drawn once for the top-left corner as one arm
// along the top edge; the second arm is the same drawing flipped across the
// diagonal, and CSS mirrors the whole piece into the other corners.
// Paths use only commands whose numbers come in x,y pairs, so flipping is a swap.
var ORNAMENT_ART = {
	vignette: { w: 1.4, d: [
		"M3 3C18 4 28 10 36 20S44 36 42 46",
		"M20 6c6-2 10 2 8 6c-1 3-5 3-5 0" ], f: [
		"M28 12q8-8 14-2q-8 6-14 2Z",
		"M38 28q10-2 12 6q-10 2-12-6Z",
		"M12 4q4-6 10-3q-4 5-10 3Z" ], dots: [[44, 18, 1.8], [47, 22, 1.4], [36, 42, 1.5]] },
	marginalia: { w: 1.2, d: [
		"M4 6q6-4 12 0t12 0t12 0t10 0",
		"M50 6c4 0 6 4 3 6c-3 2-6-1-4-3",
		"M14 12L14 20M10 16L18 16M11 13L17 19M17 13L11 19" ], f: [], dots: [[26, 14, 1.2], [32, 13, 0.9]] },
	arabesque: { w: 1.6, d: [
		"M3 3C14 3 16 14 26 14C36 14 36 4 46 6C54 8 54 18 48 20C44 21 42 17 45 15" ], f: [
		"M26 14q2 8-4 12q-2-8 4-12Z",
		"M46 6q6-6 12-2q-6 4-12 2Z" ], dots: [[36, 10, 1.3]] },
	scrollwork: { w: 2.4, d: [
		"M3 3C3 16 12 20 20 16C27 12 24 4 18 6C14 8 16 12 19 11",
		"M20 16C30 22 34 30 32 38C30 44 24 43 25 38C26 35 29 36 28 39" ], f: [], dots: [] },
	acanthus: { w: 1, d: [
		"M5 5C14 10 22 18 30 30",
		"M32 14c4-2 8 0 7 4c-1 3-5 2-4-1" ], f: [
		"M3 3C16 2 26 6 32 14C30 12 26 12 24 15C28 15 31 18 32 22C28 20 24 21 22 24C27 25 30 29 30 34C22 28 12 22 6 12Z" ], dots: [] },
	"english-scroll": { w: 0.9, d: [
		"M3 3C10 5 14 3 18 6c3 2 1 6-2 5c-2-1-1-3 1-3",
		"M18 6C24 9 28 6 32 9c3 2 1 6-2 5c-2-1-1-3 1-3",
		"M32 9C38 12 42 9 46 12c3 2 1 6-2 5c-2-1-1-3 1-3",
		"M10 5q2-4 5-3M25 8q2-4 5-3M39 11q2-4 5-3" ], f: [], dots: [[50, 14, 0.9]] }
};

function flipPath(d) {
	var n = 0, prev = null;
	return d.replace(/-?\d*\.?\d+/g, function (num) {
		n++;
		if (n % 2) { prev = num; return "\u0000"; }
		return " " + num + " " + prev;
	}).replace(/\u0000 ?/g, "");
}

function ornamentSVG(name, color) {
	var art = ORNAMENT_ART[name];
	if (!art) return "";
	var out = "";
	[false, true].forEach(function (flip) {
		art.d.forEach(function (d) { out += '<path d="' + (flip ? flipPath(d) : d) + '" fill="none" stroke="' + color + '" stroke-width="' + art.w + '" stroke-linecap="round"/>'; });
		art.f.forEach(function (d) { out += '<path d="' + (flip ? flipPath(d) : d) + '" fill="' + color + '" opacity=".85"/>'; });
		art.dots.forEach(function (p) { out += '<circle cx="' + (flip ? p[1] : p[0]) + '" cy="' + (flip ? p[0] : p[1]) + '" r="' + p[2] + '" fill="' + color + '"/>'; });
	});
	return '<svg viewBox="0 0 64 64" aria-hidden="true">' + out + '</svg>';
}

var CORNERS = { top: ["tl", "tr"], bottom: ["bl", "br"], diagonal: ["tl", "br"], antidiagonal: ["tr", "bl"], all: ["tl", "tr", "bl", "br"] };

function ornamentsHTML(c) {
	if (!c.ornament || c.ornament === "none") return "";
	var art = ornamentSVG(c.ornament, c.palette[2]);
	return (CORNERS[c.placement] || CORNERS.all).map(function (k) {
		return '<span class="offbrand-orn ' + k + '">' + art + '</span>';
	}).join("");
}

function adHTML(c, size, href) {
	return '<div class="offbrand-unit offbrand-unit-' + size + '"><span class="offbrand-mark offbrand-mark-' + (c.labelSide || "left") + '">' + (c.label || "Advertisement") + '</span>' + adBody(c, size, href) + '</div>';
}

function adBody(c, size, href) {
	var bg = c.palette[0], ink = c.palette[1], accent = c.palette[2];
	var picture = shapeSVG(c.shape, accent, ink);
	var tag = href ? 'a href="' + href + '"' : "div";
	// Words go on top only of real pictures; a drawn shape keeps them beside it.
	var layout = c.source === "shape" ? "split" : c.layout;
	var classes = "offbrand offbrand-" + size + " offbrand-" + layout + (c.flip ? " offbrand-flip" : "") + " offbrand-deco-" + c.deco + (c.ornament && c.ornament !== "none" ? " offbrand-has-orn" : "");
	// Until a picture arrives, the shape sits on a tint of the background.
	var tone = luminance(bg) > 0.5 ? "dark" : "light";
	var ornaments = ornamentsHTML(c);
	var corners = c.deco === "corners" && !ornaments
		? '<span class="offbrand-corner tl"></span><span class="offbrand-corner tr"></span><span class="offbrand-corner bl"></span><span class="offbrand-corner br"></span>'
		: "";
	loadFonts(c.fonts);
	var fonts = ";--ob-head-font:'" + c.fonts[0] + "'," + c.fonts[2] + ";--ob-body-font:'" + c.fonts[1] + "',sans-serif";
	return '<' + tag + ' class="' + classes + '" data-tone="' + tone + '" style="--ob-bg:' + bg + ';--ob-ink:' + ink + ';--ob-accent:' + accent + fonts + '">' + corners + ornaments +
		'<div class="offbrand-pic"' + (backdropCSS(c) ? ' style="background:' + backdropCSS(c) + '"' : '') + '>' + picture + '</div>' +
		'<div class="offbrand-copy"><strong class="offbrand-brand">' + c.brand + '</strong>' +
		'<span class="offbrand-head">' + c.headline + '</span>' +
		'<span class="offbrand-line">' + c.line + '</span>' +
		'<span class="offbrand-call">' + c.call + ' ›</span></div>' +
		'</' + (href ? "a" : "div") + '>';
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


