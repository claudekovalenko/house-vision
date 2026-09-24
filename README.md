# Our Home

A small, installable web app (PWA) that holds a living vision for the house we want to build together.

It's a single static page with no build step: open `index.html` on any web server and it works. Once it's served over HTTPS it can be installed to a phone's home screen and it keeps working offline.

## What's in it

- **The rooms.** The prayer room (padded, soundproof, its own air conditioning, good speakers), the study and office (a shared desk, with her own desk off to the side), the bedroom (Song of Solomon under the glass of each nightstand), and the sauna (a random thought, but a good one). Each room has a priority you can change; it's saved on the device.
- **The nightstands.** The full text for both sides: his side carries the verses about her, her side carries the verses about him, with Song of Solomon 8:6-7 over the bed. Quotations are ESV.
- **Things to decide together.** Open questions from the rooms, answered with a tap.
- **Ideas.** A running list of thoughts, each tied to a room and a priority. Export to a file and import on the other phone to share.

Everything is stored in the browser's local storage. Nothing leaves the device unless you export it.

## Run it locally

Any static server works. For example:

```sh
npx serve .
# or
python3 -m http.server 8080
```

Then open the printed URL. Service workers need `localhost` or HTTPS, so opening the file directly with `file://` will show the page but won't install.

## Deploy

The included GitHub Actions workflow (`.github/workflows/pages.yml`) publishes the repository root to GitHub Pages on every push to the default branch. Turn on Pages in the repository settings with **Source: GitHub Actions** and the site will be available at `https://<user>.github.io/house-vision/`. All paths are relative, so it also works from any subfolder or a custom domain.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The page: hero, rooms, nightstands, decisions, ideas |
| `styles.css` | Light and dark themes, layout, components |
| `app.js` | Room data, decisions, ideas, theme toggle, install prompt |
| `sw.js` | Service worker: precaches the app shell for offline use |
| `manifest.webmanifest` | Install metadata and icons |
| `icons/` | App icons (`icon.svg` is the source; PNGs are rendered from it) |
| `images/` | Room renders. `<room>.jpg` is the card art; `<room>-spec.jpg` is the annotated sheet shown full size |

## Updating the vision

Room content and open questions live at the top of `app.js` in the `ROOMS` and `DECISIONS` arrays. Edit the text, bump `VERSION` in `sw.js` so installed copies pick up the change, and push.

## Adding a room render

Drop two files in `images/`: `<room>.jpg` for the card and `<room>-spec.jpg` for the annotated version that opens when you tap it. Then add a `photo` block to that room in `app.js` with `src`, `spec`, an `alt` description, and an optional `position` to steer the crop. Add both files to `SHELL` in `sw.js` and bump `VERSION` so installed copies pick them up.

Renders are AI-generated concepts, so the app labels them as such. Keep that label if you swap in new ones.

## If the app won't open

Open the site with `?reset` on the end of the URL, for example `https://<user>.github.io/house-vision/?reset`. That unregisters the service worker and clears its caches, then reloads clean. Saved ideas, decisions, and priorities are kept, because they live in local storage and are not touched.

For an installed copy that still misbehaves, remove it from the home screen, open the URL in the browser once, and install it again.
