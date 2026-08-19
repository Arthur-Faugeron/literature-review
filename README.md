# Literature Review

A private, cumulative library of academic papers in finance, economics and quantitative
research. Published via GitHub Pages.

## Adding a new paper

1. Create the paper's folder under the matching series in `SERIES/`, named:

   ```
   DDMMYYYY_author
   ```

   Example: `SERIES/Macro-Finance/16082026_gilchristzakrajsek/`, containing:

   ```
   review.pdf        (required - the review)
   paper.pdf          (only if the original paper is legally available to store)
   ```

2. Append one line to `list.jsonl` (the paper's metadata) - see `CLAUDE.md` for the
   exact fields and philosophy.

3. Commit and push:

   ```
   git add SERIES list.jsonl
   git commit -m "Add SERIES review for AUTHOR"
   git push
   ```

That's the entire workflow. There is no page to hand-edit. A GitHub Action
(`.github/workflows/deploy.yml`) picks up the push, cross-checks `list.jsonl` against
the files actually present under `SERIES/`, and republishes the site - the latest
addition and the searchable archive - usually within a minute or two.

## Series

Series names in `list.jsonl` must match exactly (spelling and punctuation) one of:

Asset Pricing, Portfolio Management, Quantitative Finance, Financial Econometrics,
Macro-Finance, Macroeconomics, Monetary Economics, International Finance, Corporate
Finance, Banking, Financial Intermediation, Financial Markets, Market Microstructure,
Behavioral Finance, Risk Management, Derivatives, Fixed Income, Equity Markets,
Commodities, Foreign Exchange, Alternative Investments, Investment Management,
Financial Technology, Machine Learning & AI, Data Science, Economics, Econometrics,
Statistics, Mathematics, Optimization, Time Series

A series with no papers yet simply appears as "No Reviews Yet" in the archive. There is
nothing to pre-create.

## Why JSON Lines, not a JSON array

`list.jsonl` is **JSON Lines**: one complete JSON object per line, not one big
`[ ... ]` array. This is deliberate - adding a paper is a pure append (one new line at
the end of the file), never a read-the-whole-file-parse-it-add-one-entry-rewrite-the-
whole-file operation. As the library grows past dozens or hundreds of papers, that
difference is what keeps adding a paper cheap and safe instead of getting slower and
riskier over time. **Existing lines are never edited or reordered.**

Unlike a typical generated-content site, this file is the real content database -
committed to git, growing over time, hand (or AI-)curated per `CLAUDE.md`.
`scripts/build.js` reads it, verifies the referenced files actually exist under
`SERIES/`, computes the download/view links, and writes a single `library.json` - a
build artifact, not committed - that both `index.html` (latest addition) and
`archive.html` (search) fetch at runtime.

## Site structure

```
index.html                     home page - masthead, latest addition
archive.html                   full series index with a search box
assets/css/style.css           shared styling (same system as the OCAD site)
assets/js/site.js              fetches library.json, renders the archive and latest card
scripts/build.js               builds library.json from list.jsonl + SERIES/
.github/workflows/deploy.yml   builds and deploys to GitHub Pages on every push to main
list.jsonl                     paper metadata, one JSON object per line - the content database
SERIES/<Series>/DDMMYYYY_author/   each paper's review and (optionally) the paper itself
```

To preview locally before pushing:

```
node scripts/build.js
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publishing

GitHub Pages is configured with its build/deploy source set to "GitHub Actions" (not a
branch). The workflow builds a clean `_site/` folder (site files, data, and PDFs
only - no git internals) and deploys it via the official `actions/deploy-pages` action.
