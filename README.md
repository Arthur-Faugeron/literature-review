# Literature Review

A private, cumulative library of academic papers in finance, economics and quantitative
research. Published via GitHub Pages, with a live graph of how the papers connect.

## Adding a new paper

1. Create the paper's folder under the matching series in `SERIES/`, named:

   ```
   DDMMYYYY_author
   ```

   Example: `SERIES/Macro-Finance/16082026_gilchristzakrajsek/`, containing:

   ```
   review.pdf        (required - the review)
   notebook.ipynb     (whenever computational analysis is part of the review)
   paper.pdf          (only if the original paper is legally available to store)
   ```

2. Add an entry to `list.json` (the paper's metadata) and, where meaningful, a
   connections entry in `graph.json` (its links to other papers already in the
   library) - see `CLAUDE.md` for the exact fields and philosophy.

3. Commit and push:

   ```
   git add SERIES list.json graph.json
   git commit -m "Add SERIES review for AUTHOR"
   git push
   ```

That's the entire workflow. There is no page to hand-edit. A GitHub Action
(`.github/workflows/deploy.yml`) picks up the push, cross-checks `list.json` and
`graph.json` against the files actually present under `SERIES/`, and republishes the
site - home page graph, latest addition, and the searchable archive - usually within a
minute or two.

## Series

Series names in `list.json` must match exactly (spelling and punctuation) one of:

Asset Pricing, Portfolio Management, Quantitative Finance, Financial Econometrics,
Macro-Finance, Macroeconomics, Monetary Economics, International Finance, Corporate
Finance, Banking, Financial Intermediation, Financial Markets, Market Microstructure,
Behavioral Finance, Risk Management, Derivatives, Fixed Income, Equity Markets,
Commodities, Foreign Exchange, Alternative Investments, Investment Management,
Financial Technology, Machine Learning & AI, Data Science, Economics, Econometrics,
Statistics, Mathematics, Optimization, Time Series

A series with no papers yet simply appears as "No Reviews Yet" in the archive. There is
nothing to pre-create.

## How list.json and graph.json become the site

Unlike a typical generated-content site, `list.json` and `graph.json` are the real
content database here - they are committed to git and grow over time, hand (or
AI-)curated per `CLAUDE.md`. `scripts/build.js` reads both, verifies the referenced
files actually exist under `SERIES/`, computes the download/view links (the notebook
links to its rendered view on github.com, since GitHub Pages serves `.ipynb` as raw
JSON rather than rendering it), and writes a single `library.json` - a build artifact,
not committed - that both `index.html` (the graph) and `archive.html` (search) fetch at
runtime.

## Site structure

```
index.html                     home page - masthead, library graph, latest addition
archive.html                   full series index with a search box
assets/css/style.css           shared styling (same system as the OCAD site)
assets/js/site.js              fetches library.json, renders the archive and latest card
assets/js/graph.js             D3 force-directed graph of paper connections
scripts/build.js               builds library.json from list.json + graph.json + SERIES/
.github/workflows/deploy.yml   builds and deploys to GitHub Pages on every push to main
list.json                      paper metadata - the content database
graph.json                     paper-to-paper connections - the content database
SERIES/<Series>/DDMMYYYY_author/   each paper's review, notebook, and (optionally) the paper itself
```

To preview locally before pushing:

```
node scripts/build.js
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publishing

GitHub Pages is configured with its build/deploy source set to "GitHub Actions" (not a
branch). The workflow builds a clean `_site/` folder (site files, data, and PDFs/notebooks
only - no git internals) and deploys it via the official `actions/deploy-pages` action.
