# Icon Shelf

A personal, account-free icon website using the full installed Iconify catalog. Search, filter, browse collections, preview colors, save favorites locally, and download SVG, PNG, JPEG, EPS, or Illustrator-compatible AI files.

## Catalog

The build uses `@iconify/json` version **2.2.552**: **506,483 searchable entries including aliases, across 276 collections**. It is a pinned snapshot, not a continuously synchronized live API. Update the package and rebuild to refresh it. Transformed aliases are resolved with Iconify utilities.

All catalog files are included in the generated website. Only the search index and collections needed for the current results are loaded in the browser. Search and classification run in a Web Worker. The site makes no external API or font requests, needs no account or keys, and works on GitHub Pages.

## Local development

Requires Node.js 24.

```sh
npm ci
npm run build
npm start
```

`PORT` defaults to 3000. The static server also supports the GitHub project prefix `/Iconshelf.io/` for local deployment testing. `dist/` is generated and deliberately excluded from Git; it is approximately 633 MB, within the 1 GB GitHub Pages site limit.

```sh
npm test
node tests/pages-browser.mjs
```

The browser check requires Chromium at `/usr/bin/chromium`. It verifies the full catalog, project subpath, search/filtering, saved favorites, pack browsing, responsive behavior, and the actual content of all five downloaded formats. Start the website before running it. `node tests/library-browser.mjs` additionally checks folder creation, folder selection when favoriting, moving/unfiling icons, legacy favorite migration, mobile layout, and storage failure handling.

The original Node API is retained in `server.js` and has its own eight tests; the deployed website does not use that API.

## GitHub Pages deployment

The repository includes `.github/workflows/pages.yml`, which builds the complete catalog and publishes the static site on every push to `main`.

1. In the repository on GitHub, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open **Actions → Publish Icon Shelf to GitHub Pages**, and run the workflow on `main` (or rerun a failed deployment after enabling Pages).
4. The deployment job reports the real live website URL once publication succeeds.

For this repository, the expected project URL is `https://ssumesh1-maker.github.io/Iconshelf.io/`. This address is not evidence of a live deployment; check that the workflow succeeded and that the URL opens before sharing it.

GitHub Pages availability for private repositories depends on the owner's GitHub plan. The site itself is public when published; it stores no personal favorites on the server. Favorites remain local to each browser and origin.

## Typography

Nunito Sans is applied through shared semantic tokens for headings, body copy, controls, labels and metadata. Body sizes are 14/15/16/18 px across phone/tablet/desktop/large viewports, with fluid headings and 16 px phone/tablet form fields. See [DESIGN.md](DESIGN.md) for token mappings, line heights, weights, contrast measurements and component decisions. Run `npm run test:typography` to check the computed system.

## Responsive layout and tag browsing

The toolbar, icon grid, pack cards, library folders and popups adapt to the available viewport. Tablet and phone filters use the Filters button. Compact and wide views remain available, and short or landscape screens can scroll popup content while keeping its close control reachable.

In the icon popup, click the collection tag to browse its pack, or a style tag to browse icons matching that visual style. Function and metaphor tags also open filtered results. These are real links with shareable query URLs; browser Back restores the previous filters. Classification remains inferred from collection metadata and icon names.

`npm run test:responsive` checks 24 portrait and landscape viewport combinations from 280 to 2560 CSS pixels wide, both grid densities, popup controls, filter panels, pack cards, library folders, touch mode and tag navigation.

## Formats

- **SVG:** original vector shapes and chosen color.
- **PNG:** transparent raster image at the selected size.
- **JPEG:** raster image on white at the selected size.
- **EPS:** PDF-to-EPS vector conversion in a browser worker using Ghostscript WebAssembly. PostScript can flatten transparency.
- **AI:** PDF-based vector artwork saved with an `.ai` extension, readable by Illustrator; not a native Illustrator document. Re-save in Illustrator if native AI editing is required.

Multi-color icons keep their original palette. The color control changes shapes that use `currentColor`. Very complex artwork can take longer to convert; a failure is reported rather than returning an incorrectly labeled file.

## Classification and storage

Function, metaphor, and visual-style tags are inferred from icon names and collection metadata, not manually reviewed official Iconify classifications. Unsupported styles display an empty result. App and favicon categories suggest candidates, without generating application bundles or ICO files. Technology and brand packs can be found through text search and collection browsing.

Open **My library** to see your favorites and create folders with **New folder**. No folder controls are shown until you create your first folder. Once folders exist, saving a new favorite opens a folder picker; choose a folder or leave it unfiled. Use **Move** on a saved icon, or **Change folder** in its detail popup, to organize existing favorites. Existing favorites from earlier versions are preserved as unfiled icons.

Favorites, folders, and folder assignments use browser local storage; clearing site storage removes them. They are personal to this browser and do not sync across devices. A failed storage write leaves the previous library unchanged. Filters and search are represented in the URL. Results are paginated at 60 entries per page.

## Licenses and sources

Icon artwork remains subject to each collection's individual license and attribution requirements, displayed in the detail panel and included in the generated metadata and collection JSON. Brand trademarks remain with their owners. Nunito Sans is served locally under the SIL Open Font License.

The standalone EPS conversion worker uses `@jspawn/ghostscript-wasm` 0.0.2 (AGPL-3.0). Its license is included at `vendor/LICENSE` in the generated site, and `SOURCE.txt` provides source references. See `THIRD_PARTY_NOTICES.md` for details.
