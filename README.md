# Kyle Shropshire — Personal Site

A single-page site styled as a mid-century modern architectural drawing set:
a hand-drawn elevation of a butterfly-roof house doubles as the main nav
(click a numbered callout to jump to a section), breeze-block screens divide
the "rooms," and career milestones are laid out along a drafting scale.

No build step, no dependencies beyond Google Fonts — just three files:

```
index.html
style.css
script.js
```

## Publish it on GitHub Pages

1. Create a new repository on GitHub (or use an existing one). If you want
   it at `https://<your-username>.github.io`, the repo must be named exactly
   `<your-username>.github.io`. Any other name works too — it'll just live
   at `https://<your-username>.github.io/<repo-name>/`.
2. Add these three files to the repo root and push:
   ```bash
   git init
   git add index.html style.css script.js README.md
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch,"
   pick the **main** branch and the **/ (root)** folder, then **Save**.
5. GitHub will give you a URL (usually live within a minute or two) — that's
   your site.

## Editing content

Everything text-based lives directly in `index.html`, organized by section
(`<!-- ABOUT -->`, `<!-- CAREER -->`, `<!-- PROJECTS -->`, etc.). The colors,
type, and spacing all live in `style.css` as CSS custom properties at the
top of the file (`:root { --paper: ...; --brick: ...; }`) if you want to
retune the palette.

## Things worth double-checking before you publish

- The career timeline and company names were assembled from public sources
  (your LinkedIn profile and an interview you gave) — please check the
  dates and titles against your own record and adjust anything that's off.
- Swap in your GitHub profile/repo links wherever you'd like them to
  appear — none are included yet since I didn't have that username.
- The contact email (`kyle@drawnav.com`) was pulled from your own public
  Drawing Navigator site — replace it if you'd rather use something else.
