# Our Home

A single-page installable web app (PWA) holding a vision for a future house. No build step, no framework. Plain HTML, CSS, and JavaScript served as static files.

## Scripture

**Always use the ESV. Never use the World English Bible, and do not substitute another translation without being asked.** This applies to every verse in this project and to any new verse added later.

When publishing ESV text, include Crossway's required notice:

> Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.

Crossway permits quoting up to 500 verses without written permission, provided the verses are not a majority of the work and the notice above appears. This project is far under that.

Set the divine name as printed Bibles do, using `<span class="sc">Lord</span>`, which renders with small capitals.

Verse text written from memory must be flagged as needing a proofread against a printed ESV. Anything destined to be physically printed, framed, or set under glass has to be checked against a real Bible first.

## Conventions

- Room content and open questions live in the `ROOMS` and `DECISIONS` arrays at the top of `app.js`.
- Bump `VERSION` in `sw.js` whenever a cached file changes, or installed copies keep serving the old one.
- Only the five core shell files belong in `CORE` in `sw.js`. Images and icons go in `OPTIONAL`, so a missing file can never fail the install.
- Room renders are AI-generated concepts. Always label them as such in the UI; never present one as a photograph or a construction drawing.
- Deploys go to GitHub Pages automatically on every push to the default branch.
