# Kyle Shropshire — Personal Site

A site styled as a mid-century modern architectural drawing set. The Projects
section is a walnut bookcase: hover (or tap) a book for a preview card, then
click through to the project page.

No build step and no dependencies beyond Google Fonts.

## Folder structure

```
index.html                  <- the one and only homepage (must stay at the root)
mise-timer.html             <- project pages live at the root, one per project
spice-rack.html
cmth-ruler.html
README.md
assets/
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── mise-timer/         <- images (and videos) grouped by project
│   ├── spice-rack/         <- includes robots-favorite-spice-rack.mp4
│   └── cmth-ruler/
```

## Adding a new project

1. Copy an existing project page (for example `cmth-ruler.html`) and rename it.
2. Create `assets/images/<project-name>/` and put its pictures and videos there.
3. Point the page's `<img src>` paths at `assets/images/<project-name>/...`.
4. In `index.html`, copy one `<div class="slot">` book block into a shelf, change
   the title, blurb, color class, `--h` / `--w` size, and set its `href` to the new page.

## File naming

Use lowercase letters, numbers, and hyphens only (no spaces). GitHub Pages is
case-sensitive, so `Empty.jpg` and `empty.jpg` are different files.

## Publish on GitHub Pages

1. Push the whole folder to the root of your repository.
2. In **Settings → Pages**, set the source to the `main` branch and `/ (root)`.
