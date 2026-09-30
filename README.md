# offbrand

Generative advertising. Public-domain museum art and invented brands, recast as a new campaign every week, for a product that never appears.

Each ISO week seeds one campaign: an invented brand name from [Ortho](https://github.com/leeMeredith/ortho), a palette, a font pairing, a picture, a crop, a layout, a decoration, corner ornaments (vignette, marginalia, arabesque, American scrollwork, acanthus, or English scroll, placed on the top, bottom, diagonal, or all corners), and suggestive copy from curated lists. The campaign runs across three standard web ad sizes (728 × 90, 300 × 250, 160 × 600), so the set reads as one campaign.

Pictures are a drawn, shaded product shape (bottle, jar, perfume flask, can, tube, box, sphere, cone, or pyramid) on a tint, horizon, or fade, or a public-domain work found by the browser in the Art Institute of Chicago or The Met collections, with a credit. Fonts come from Google Fonts. No keys, accounts, or build step are needed.

## Try it

Open `index.html` through a web server; browsers don't run modules from a double-clicked file. For example, run `python3 -m http.server 8000` in this folder and visit `http://127.0.0.1:8000/`. Turning on GitHub Pages for this repository serves the same demo publicly.

## Files

- `offbrand/offbrand.js`: the generator, as an ES module with no build step.
- `offbrand/offbrand.css`: the ad styles. Class names start with `offbrand-`, and colours and fonts are `--ob-*` variables, so they won't clash with the page around them.
- `ortho/`: a copy of [Ortho](https://github.com/leeMeredith/ortho), which invents the brand names. Keep it next to the `offbrand/` folder.
- `index.html`: the demo.

To use offbrand on your own site, copy the `offbrand/` and `ortho/` folders side by side and load `offbrand/offbrand.css`.

## Use

```js
import { placeAd, mount, configure } from "./offbrand/offbrand.js";

placeAd(element, "rectangle", "campaign.html"); // one ad; also "leaderboard" or "skyscraper"
mount(element);                                  // this week's full set, with buttons
configure({ headlines: ["You already know."] }); // replace any ingredient list
```

The ingredient lists you can replace are `palettes`, `headlines`, `lines`, `calls`, `images`, `sources`, `shapes`, `backdrops`, `subjects`, `layouts`, `decos`, `ornaments`, `placements`, `zooms` and `fonts`. The defaults and what each one means are at the top of `offbrand/offbrand.js`.

## Credits

Museum pictures are public-domain (CC0) works from the [Art Institute of Chicago](https://www.artic.edu/open-access/public-api) and [The Metropolitan Museum of Art](https://metmuseum.github.io/) open-access APIs, credited under each campaign. offbrand runs on [Lee Meredith's site](https://github.com/leeMeredith/personal-site) as *Weekly Campaign*.

MIT licence.
