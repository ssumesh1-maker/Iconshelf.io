# Third-party software and artwork

Icon Shelf includes Iconify collection data, whose licenses differ by collection. The generated `data/meta.json` records license titles, URLs and authors; complete collection files retain their source metadata. Users must follow the applicable collection terms, including attribution requirements. No ownership of icon artwork or brand trademarks is claimed.

- Iconify catalog (`@iconify/json` 2.2.552): https://github.com/iconify/icon-sets
- Iconify utilities (MIT): https://github.com/iconify/iconify
- Nunito Sans (SIL Open Font License): https://github.com/googlefonts/nunito-sans
- jsPDF (MIT): https://github.com/parallax/jsPDF
- svg2pdf.js (MIT): https://github.com/yWorks/svg2pdf.js
- ghostscript-wasm (`@jspawn/ghostscript-wasm` 0.0.2, AGPL-3.0): https://github.com/jsscheller/ghostscript-wasm
- Ghostscript source and license: https://www.ghostscript.com/releases/gsdnld.html

The Ghostscript WebAssembly binary and loader are distributed unmodified in the generated `vendor/` directory, alongside the package's full license. The JavaScript wrapper used by this website is in `public/eps-worker.js` in this repository. The package registry distributes the matching loader and binary at https://registry.npmjs.org/@jspawn/ghostscript-wasm/-/ghostscript-wasm-0.0.2.tgz; the upstream repository contains its build sources and instructions. These components retain their original licenses.
