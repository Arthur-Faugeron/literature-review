# Literature Review template

One LaTeX template for every review.

| File | Role |
|---|---|
| `lrreview.cls` | The style: page, fonts, colours, headings, tables, figures, callouts, bibliography |
| `template.tex` | Skeleton of a review, with every section and element of CLAUDE.md |
| `template.pdf` | Compiled skeleton, for visual comparison |
| `fonts/` | EB Garamond, Source Serif 4, Inter (the class loads them from here) |

## Use

1. Copy `template.tex`, `lrreview.cls` and `fonts/` to a scratch folder, rename `template.tex`.
2. Replace the bracketed placeholders. Add figures as PNG files beside the `.tex`.
3. Build with XeLaTeX, twice: `xelatex review.tex` (or `latexmk -xelatex review.tex`).
4. Save the PDF as `SERIES/<Series>/<DDMMYYYY_author>.pdf` and append one line to `list.jsonl`.

## Rules

- Change style only in `lrreview.cls`, never inside a report.
- No manual page breaks, no em dashes, no hash signs, no asterisks, no hyperlinks.
- A cell or list item that starts with a bracket needs `\relax` before it.
