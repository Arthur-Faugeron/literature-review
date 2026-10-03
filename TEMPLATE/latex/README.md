# Literature Review: LaTeX master template

LaTeX counterpart of `TEMPLATE/template.css`. One class (`lrreview.cls`) for every review, same identity as the WeasyPrint reports: ivory page, Oxford Navy / Tweed Brown / Deep Olive / Camel Beige palette, EB Garamond titles, Source Serif 4 body, Inter for tables, tags, captions and running headers.

## Files

- `lrreview.cls`  the template (page geometry, fonts, headings, tables, figures, callouts, bibliography)
- `main.tex`      MOCK review that exercises every element; copy it to start a real review
- `assets/`       mock images (`mkimg.py` regenerates them)
- `fonts/`        bundled fonts (EB Garamond, Source Serif 4, Inter; open licences, Latin and Greek)
- `main.pdf`      sample output, for comparison

## Build

Engine: XeLaTeX (tested). LuaLaTeX is untested; do not use pdfLaTeX. Run from this folder:

    latexmk -xelatex main.tex

or `xelatex main.tex` twice (the second pass fixes page counts and references). Needs a standard TeX Live or MiKTeX install with the packages fontspec, unicode-math, tcolorbox, xltabular, titlesec, fancyhdr, enumitem, needspace, lastpage, microtype, booktabs, colortbl. On Overleaf choose the XeLaTeX compiler.

## Writing a review

Set the metadata at the top of `main.tex` (`\lrtitle`, `\lrauthors`, `\lryear`, `\lrjournal`, `\lrdoi`, `\lrarea`, `\lrseries`, `\lrpapertype`, `\lrdatereviewed`), then `\lrfrontpage{abstract paragraph}`. Building blocks:

| Element | Command or environment |
|---|---|
| Sections | `\section`, `\subsection`, `\subsubsection` (numbered; the front page is not) |
| Inline label | `\lrtag{Paper}` `\lrtag{Evidence}` `\lrtag{Critique}` `\lrtag{Inference}` `\lrtag{Extension}` |
| Equation | `equation` with `\label`; define symbols with `lrdefs` and `\lrdef{symbol}{meaning}` |
| Table | `lrtable{Caption}` around a `tabularx`; rules `\lrtoprule \lrheadrule \lrrowrule \lrbottomrule`; header cells `\lrth{}`; source line `\lrsource{}`; add `\label{tab:x}` inside |
| Long table | `xltabular` inside `lrtable` (header row repeats across pages), see the robustness table |
| Figure | `\lrfigure{file}{Caption}{Source and notes}` |
| Callout | `lrfinding{Established}` (also Supported but conditional, Suggestive, Not established) |
| Research idea | `lridea{Title}` with `\lrfield{Label}{text}` |
| Bibliography | `lrbibliography` with `\lrref{...}`; unnumbered, hanging indent, no hyperlinks |

## Rules carried over from CLAUDE.md

- Only the margins and spacing defined in the class are used. Do not add report-specific lengths; add a rule to the class instead.
- No manual page breaks. The only forced break is after the front page.
- Front page is normal block flow, so a long abstract runs onto page two instead of being clipped.
- Keep the abstract to one paragraph of about 150 to 220 words.
- No numbered or hyperlinked references; author-year citations in the text.

## Known differences from the CSS template

- Math operators come from Latin Modern Math; Latin and Greek math letters use EB Garamond Italic.
- Line breaking is TeX's (paragraph optimiser), so page breaks will not match the WeasyPrint output line for line.
- The footer text reproduces the CSS footer, including its em dash.
