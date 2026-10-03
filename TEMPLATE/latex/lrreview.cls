%% ============================================================================
%% lrreview.cls  --  LITERATURE REVIEW, master LaTeX template
%%
%% LaTeX counterpart of TEMPLATE/template.css (the WeasyPrint stylesheet).
%% One class for every review. Do not fork it per report: if a report needs a
%% new rule, add the rule here so every future report inherits it.
%%
%% Engine : XeLaTeX or LuaLaTeX (fontspec + unicode-math). Not pdfLaTeX.
%% Fonts  : EB Garamond, Source Serif 4, Inter, bundled in ./fonts
%% Page   : A4, ivory background over the full page, margins 26/22/20/20 mm.
%% Identity: Old Money + Institutional Research + European Financial Journal.
%% ============================================================================
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{lrreview}[2026/10/03 Literature Review master template]

\LoadClass[10pt,a4paper]{article}

%% ---- Packages --------------------------------------------------------------
\RequirePackage{etoolbox}
\RequirePackage{xcolor}
\RequirePackage{fontspec}
\RequirePackage{amsmath}
\RequirePackage{unicode-math}
\RequirePackage{geometry}
\RequirePackage{fancyhdr}
\RequirePackage{titlesec}
\RequirePackage{enumitem}
\RequirePackage{graphicx}
\RequirePackage{array}
\RequirePackage{colortbl}
\RequirePackage{tabularx}
\RequirePackage{xltabular}
\RequirePackage{booktabs}
\RequirePackage{needspace}
\RequirePackage{lastpage}
\RequirePackage{microtype}
\RequirePackage[skins]{tcolorbox}
\RequirePackage{calc}

%% ---- Palette (CLAUDE.md section 30) -----------------------------------------
\definecolor{ivory}{HTML}{F5F1E8}
\definecolor{navy}{HTML}{172A3A}
\definecolor{tweed}{HTML}{6B5744}
\definecolor{olive}{HTML}{3F4A32}
\definecolor{camel}{HTML}{C8AE82}
\definecolor{hairline}{HTML}{C9BCA1}

\pagecolor{ivory}
\color{navy}

%% ---- Fonts -----------------------------------------------------------------
\defaultfontfeatures{Ligatures=TeX}

\setmainfont{SourceSerif4}[
  Path=fonts/,
  Extension=.ttf,
  UprightFont=*-Regular,
  ItalicFont=*-Italic,
  BoldFont=*-SemiBold,
  BoldItalicFont=*-Italic,
  Ligatures=TeX]

\newfontfamily\lrserif{EBGaramond}[
  Path=fonts/,
  Extension=.ttf,
  UprightFont=*-Regular,
  ItalicFont=*-Italic,
  BoldFont=*-SemiBold,
  BoldItalicFont=*-SemiBoldItalic]

\newfontfamily\lrserifsb{EBGaramond-SemiBold}[
  Path=fonts/,
  Extension=.ttf,
  UprightFont=*,
  ItalicFont=EBGaramond-SemiBoldItalic]

\newfontfamily\lrsans{Inter}[
  Path=fonts/,
  Extension=.ttf,
  UprightFont=*-Regular,
  BoldFont=*-SemiBold,
  ItalicFont=*-Regular]

\newfontfamily\lrsansmd{Inter-Medium}[Path=fonts/,Extension=.ttf]
\newfontfamily\lrsanssb{Inter-SemiBold}[Path=fonts/,Extension=.ttf]
\newfontfamily\lrsansbd{Inter-Bold}[Path=fonts/,Extension=.ttf]
\newfontfamily\lrsansbdsp{Inter-Bold}[Path=fonts/,Extension=.ttf,LetterSpace=6]
\newfontfamily\lrsanssbsp{Inter-SemiBold}[Path=fonts/,Extension=.ttf,LetterSpace=3]
\newfontfamily\lrsanssbtag{Inter-SemiBold}[Path=fonts/,Extension=.ttf,LetterSpace=8]
\newfontfamily\lrsanssp{Inter-Regular}[Path=fonts/,Extension=.ttf,LetterSpace=16]
\newfontfamily\lrsansrunning{Inter-Regular}[Path=fonts/,Extension=.ttf,LetterSpace=3]
\newfontfamily\lrsanslabel{Inter-Regular}[Path=fonts/,Extension=.ttf,LetterSpace=6]
\newfontfamily\lrsansabs{Inter-Regular}[Path=fonts/,Extension=.ttf,LetterSpace=14]

%% Body: 10.3 pt on 15.66 pt (line-height 1.52), as in the CSS.
\renewcommand\normalsize{\@setfontsize\normalsize{10.3}{15.66}}
\normalsize
\setlength{\parindent}{0pt}
\setlength{\parskip}{3mm}
\setlength{\emergencystretch}{3em}
\raggedbottom
\frenchspacing
\widowpenalty=10000
\clubpenalty=10000
\hyphenpenalty=10000
\exhyphenpenalty=10000

%% Math: Latin Modern Math supplies operators and symbols, while the italic
%% Latin and Greek letters are taken from EB Garamond Italic, as in the CSS
%% equation style.
\setmathfont{latinmodern-math.otf}
\setmathfont[range=\mathup,Path=fonts/,Extension=.ttf]{EBGaramond-Regular}
\setmathfont[range=\mathit,Path=fonts/,Extension=.ttf]{EBGaramond-Italic}

%% ---- Page geometry (single source of truth; never override per report) -----
\geometry{a4paper,top=26mm,bottom=22mm,left=20mm,right=20mm,
  headheight=10pt,headsep=7mm,footskip=11mm}

%% ---- Running header and footer ----------------------------------------------
\newcommand{\lr@title}{}
\newcommand{\lr@runtitle}{}
\newcommand{\lr@series}{}
\newcommand{\lr@authors}{}
\newcommand{\lr@year}{}
\newcommand{\lr@journal}{}
\newcommand{\lr@doi}{}
\newcommand{\lr@area}{}
\newcommand{\lr@type}{}
\newcommand{\lr@reviewer}{Arthur Faugeron}
\newcommand{\lr@date}{}

\newcommand{\lrtitle}[1]{\renewcommand{\lr@title}{#1}\ifdefempty{\lr@runtitle}{\renewcommand{\lr@runtitle}{#1}}{}}
\newcommand{\lrrunningtitle}[1]{\renewcommand{\lr@runtitle}{#1}}
\newcommand{\lrauthors}[1]{\renewcommand{\lr@authors}{#1}}
\newcommand{\lryear}[1]{\renewcommand{\lr@year}{#1}}
\newcommand{\lrjournal}[1]{\renewcommand{\lr@journal}{#1}}
\newcommand{\lrdoi}[1]{\renewcommand{\lr@doi}{#1}}
\newcommand{\lrarea}[1]{\renewcommand{\lr@area}{#1}}
\newcommand{\lrseries}[1]{\renewcommand{\lr@series}{#1}}
\newcommand{\lrpapertype}[1]{\renewcommand{\lr@type}{#1}}
\newcommand{\lrreviewer}[1]{\renewcommand{\lr@reviewer}{#1}}
\newcommand{\lrdatereviewed}[1]{\renewcommand{\lr@date}{#1}}

\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\fancyhead[L]{{\lrsansrunning\fontsize{7.6}{9}\selectfont\color{tweed}\MakeUppercase{\lr@runtitle}}}
\fancyhead[R]{{\lrsansrunning\fontsize{7.6}{9}\selectfont\color{tweed}\MakeUppercase{\lr@series}}}
\fancyfoot[L]{{\lrsansrunning\fontsize{7.6}{9}\selectfont\color{tweed}Literature Review\,\textemdash\,\lr@reviewer}}
\fancyfoot[R]{{\lrsans\fontsize{7.6}{9}\selectfont\color{tweed}\thepage\ /\ \pageref{LastPage}}}

%% ---- Sections ---------------------------------------------------------------
\setcounter{secnumdepth}{2}

\titleformat{\section}
  {\lrserifsb\fontsize{15}{18}\selectfont\color{navy}}
  {\color{tweed}\textmd{\thesection}\hspace{2mm}}
  {0pt}
  {}
  [{\vspace{2.4mm}\color{navy}\titlerule[1pt]}]
\titlespacing*{\section}{0pt}{9mm}{5mm}

\titleformat{\subsection}
  {\lrserifsb\fontsize{12.2}{15}\selectfont\color{navy}}
  {\thesubsection}{2mm}{}
\titlespacing*{\subsection}{0pt}{6mm}{3mm}

\titleformat{\subsubsection}
  {\lrsanssbsp\fontsize{9.6}{12}\selectfont\color{tweed}\MakeUppercase}
  {}{0pt}{}
\titlespacing*{\subsubsection}{0pt}{4.5mm}{2.4mm}

%% Keep headings with the text that follows (no forced page breaks anywhere,
%% except after the front page).
\preto\section{\Needspace{8\baselineskip}}
\preto\subsection{\Needspace{5\baselineskip}}
\preto\subsubsection{\Needspace{4\baselineskip}}

%% ---- Inline tags (PAPER, EVIDENCE, CRITIQUE, INFERENCE, EXTENSION) ----------
\newcommand{\lrtag}[1]{{\lrsanssbtag\fontsize{7.4}{9}\selectfont\color{olive}\MakeUppercase{#1}}}

%% ---- Lists: en dash marker, no bullets --------------------------------------
\setlist[itemize]{label={\color{tweed}\textendash},leftmargin=5mm,labelsep=1.6mm,
  itemsep=1.6mm,parsep=0pt,topsep=0pt,partopsep=0pt}
\setlist[enumerate]{leftmargin=5mm,labelsep=1.6mm,itemsep=1.6mm,parsep=0pt,topsep=0pt}

%% ---- Equations --------------------------------------------------------------
\renewcommand{\tagform@}[1]{\maketag@@@{{\fontspec[Path=fonts/,Extension=.ttf]{SourceSerif4-Regular}\fontsize{9.5}{11}\selectfont\color{tweed}(\ignorespaces#1\unskip)}}}
\setlength{\abovedisplayskip}{5mm}
\setlength{\belowdisplayskip}{5mm}
\setlength{\abovedisplayshortskip}{5mm}
\setlength{\belowdisplayshortskip}{5mm}
\everydisplay\expandafter{\the\everydisplay\fontsize{12.5}{15}\selectfont}

%% Definition rows under an equation: \lrdef{symbol}{description}
\newenvironment{lrdefs}
  {\par\vspace{2mm}\begingroup\fontsize{9.6}{14}\selectfont\setlength{\parskip}{1.2mm}}
  {\par\endgroup\vspace{2mm}}
\newcommand{\lrdef}[2]{%
  \par\noindent\hangindent=16mm\hangafter=1
  \makebox[16mm][l]{\lrserif\itshape #1}#2\par}

%% ---- Tables -----------------------------------------------------------------
\setlength{\tabcolsep}{2.4mm}
\renewcommand{\arraystretch}{1.28}
\newcolumntype{L}{>{\raggedright\arraybackslash}X}
\newcolumntype{R}{>{\raggedleft\arraybackslash}X}

\newcommand{\lrtoprule}{\arrayrulecolor{navy}\specialrule{1pt}{0pt}{0pt}}
\newcommand{\lrheadrule}{\arrayrulecolor{navy}\specialrule{0.75pt}{0pt}{0pt}}
\newcommand{\lrrowrule}{\arrayrulecolor{hairline}\specialrule{0.4pt}{0pt}{0pt}}
\newcommand{\lrbottomrule}{\arrayrulecolor{navy}\specialrule{1pt}{0pt}{0pt}}
\newcommand{\lrth}[1]{{\lrsanssb\bfseries #1}}

%% \begin{lrtable}{Caption text}  ... tabularx ... \end{lrtable}
%% Tables are numbered automatically ("Table 1.").
\newcounter{lrtable}
\newenvironment{lrtable}[1]
  {\par\Needspace{8\baselineskip}\refstepcounter{lrtable}%
   \vspace{4mm}\noindent{\lrsanssb\fontsize{8}{10}\selectfont
   {\color{tweed}Table \thelrtable.}\hspace{1.5mm}#1}\par\vspace{2mm}%
   \begingroup\lrsans\fontsize{8.4}{10.5}\selectfont\noindent}
  {\endgroup\par}
\newcommand{\lrsource}[1]{\par\vspace{1.6mm}{\lrsans\fontsize{7.4}{9.6}\selectfont\color{tweed}\raggedright #1\par}\vspace{1mm}}

%% ---- Figures ----------------------------------------------------------------
%% \lrfigure{file}{Caption}{Source and notes}
\newcounter{lrfigure}
\newcommand{\lrfigure}[3]{%
  \par\vspace{4mm}\noindent\begin{minipage}{\linewidth}\refstepcounter{lrfigure}%
  {\lrsanssb\fontsize{8}{10}\selectfont
  {\color{tweed}Figure \thelrfigure.}\hspace{1.5mm}#2}\par\vspace{2mm}%
  \noindent\includegraphics[width=\linewidth]{#1}\par
  \vspace{1.6mm}{\lrsans\fontsize{7.4}{9.6}\selectfont\color{tweed}\raggedright #3\par}\end{minipage}\par\vspace{2mm}}

%% ---- Callout blocks (Established / Not Established ...) ---------------------
\newtcolorbox{lrfinding}[1]{%
  enhanced,blank,
  borderline west={1.6pt}{0pt}{camel},
  left=4mm,right=0pt,top=3mm,bottom=3mm,
  before skip=3mm,after skip=3mm,
  before upper={\setlength{\parskip}{2mm}%
    \noindent{\lrsansbdsp\fontsize{7.8}{10}\selectfont\color{olive}\MakeUppercase{#1}}\par\vspace{1mm}}}

%% ---- Research idea blocks ---------------------------------------------------
\newenvironment{lridea}[1]
  {\par\Needspace{10\baselineskip}\vspace{4mm}\begin{minipage}{\linewidth}
   {\lrserifsb\fontsize{11.2}{14}\selectfont #1}\par\vspace{1.6mm}\setlength{\parskip}{1mm}}
  {\end{minipage}\par\vspace{5mm}}
\newcommand{\lrfield}[2]{\par\noindent{\lrsansbd\fontsize{7.6}{10}\selectfont\color{tweed}\MakeUppercase{#1.}}\ #2\par}

%% ---- Bibliography: hanging indent, no numbers, no hyperlinks ----------------
\newenvironment{lrbibliography}
  {\begingroup\fontsize{9.6}{14.6}\selectfont\raggedright\setlength{\parskip}{2.6mm}}
  {\par\endgroup}
\newcommand{\lrref}[1]{\par\noindent\hangindent=8mm\hangafter=1 #1\par}

%% ---- Front page -------------------------------------------------------------
%% Normal block flow, never a fixed-height box, so overflow reaches a second
%% page instead of being clipped. The one forced break sits after this page.
\newcommand{\lrmetarow}[2]{%
  {\lrsanslabel\fontsize{7.6}{10}\selectfont\color{tweed}\MakeUppercase{#1}} &
  {\lrsansmd\fontsize{8.4}{11}\selectfont\color{navy}#2}\\
  \arrayrulecolor{hairline}\specialrule{0.5pt}{0pt}{0pt}}

\newcommand{\lrfrontpage}[1]{%
  \newgeometry{margin=20mm}%
  \thispagestyle{empty}%
  \begin{center}
    {\lrsanssp\fontsize{8}{10}\selectfont\color{tweed}\MakeUppercase{Literature Review}}\par
    \vspace{16mm}
    {\lrserifsb\fontsize{24}{30.2}\selectfont\color{navy}\lr@title\par}
    \vspace{7mm}
    {\lrserif\itshape\fontsize{12.5}{16}\selectfont\color{tweed}\lr@authors\par}
    \vspace{8mm}
    {\color{camel}\rule{34mm}{0.9pt}}\par
    \vspace{8mm}
  \end{center}
  \begingroup\setlength{\parskip}{0pt}\fontsize{8.4}{11}\selectfont\renewcommand{\arraystretch}{1.0}\setlength{\extrarowheight}{2.4pt}\setlength{\tabcolsep}{0pt}%
  \noindent\begin{tabular}{@{}p{44mm}p{\dimexpr\linewidth-44mm\relax}@{}}
  \arrayrulecolor{hairline}\specialrule{0.5pt}{0pt}{0pt}
  \lrmetarow{Publication Year}{\lr@year}
  \lrmetarow{Journal / Working Paper}{\lr@journal}
  \lrmetarow{DOI}{\lr@doi}
  \lrmetarow{Research Area}{\lr@area}
  \lrmetarow{Series}{\lr@series}
  \lrmetarow{Paper Type}{\lr@type}
  \lrmetarow{Reviewed by}{\lr@reviewer}
  \lrmetarow{Date Reviewed}{\lr@date}
  \end{tabular}\par
  \endgroup
  \vspace{7mm}
  {\lrsansabs\fontsize{7.6}{10}\selectfont\color{tweed}\MakeUppercase{Analytical abstract}}\par
  \vspace{2mm}
  {\fontsize{9.6}{15.36}\selectfont\color{navy}#1\par}
  \clearpage
  \restoregeometry
  \pagecolor{ivory}}

%% ---- Document end hook: PDF metadata ----------------------------------------
\AtBeginDocument{\color{navy}}
