#!/usr/bin/env node
"use strict";

/*
 * Reads list.json + graph.json (the actual content database - hand/AI
 * curated, committed to git) and cross-checks them against the real
 * files under SERIES/, then writes library.json: a single merged file
 * both index.html (graph) and archive.html (search) fetch at runtime.
 *
 * Runs automatically on every push via .github/workflows/deploy.yml.
 * You do not need to run this by hand - it's here mainly so you can
 * preview locally before pushing.
 *
 * No dependencies beyond Node's built-in fs/path modules, on purpose,
 * so this keeps working with no maintenance for years.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SERIES_ROOT = path.join(ROOT, "SERIES");

const GITHUB_REPO = "Arthur-Faugeron/literature-review";
const GITHUB_BRANCH = "main";

// Canonical series list, exact spelling as used in CLAUDE.md.
const SERIES_GROUPS = [
  {
    name: "Asset Pricing & Investment",
    series: ["Asset Pricing", "Portfolio Management", "Investment Management", "Alternative Investments", "Equity Markets"],
  },
  {
    name: "Macro & Monetary",
    series: ["Macro-Finance", "Macroeconomics", "Monetary Economics", "International Finance"],
  },
  {
    name: "Corporate & Intermediation",
    series: ["Corporate Finance", "Banking", "Financial Intermediation", "Financial Markets", "Market Microstructure"],
  },
  {
    name: "Risk & Derivatives",
    series: ["Risk Management", "Derivatives", "Fixed Income", "Commodities", "Foreign Exchange"],
  },
  {
    name: "Quant, Econometrics & Data",
    series: [
      "Quantitative Finance",
      "Financial Econometrics",
      "Econometrics",
      "Statistics",
      "Mathematics",
      "Optimization",
      "Time Series",
      "Data Science",
      "Machine Learning & AI",
      "Financial Technology",
    ],
  },
  {
    name: "Behavioral & Economics",
    series: ["Behavioral Finance", "Economics"],
  },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function normalize(s) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatDate(d) {
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function encodePath(segments) {
  return segments.map(encodeURIComponent).join("/");
}

function parseDateFromId(id) {
  const match = String(id).match(/^(\d{2})(\d{2})(\d{4})_/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const d = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  return Number.isNaN(d.getTime()) ? null : d;
}

// list.jsonl / graph.jsonl are JSON Lines: one JSON object per line, so that
// adding a paper is a pure append (no read-modify-rewrite of a growing array).
function readJsonl(file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        throw new Error(`${file}:${i + 1}: invalid JSON line - ${err.message}`);
      }
    });
}

const list = readJsonl("list.jsonl");
const graph = readJsonl("graph.jsonl");

const connectionsById = new Map();
for (const entry of graph) {
  connectionsById.set(entry.paper, Array.isArray(entry.connections) ? entry.connections : []);
}

const dirByNormalizedSeries = new Map();
if (fs.existsSync(SERIES_ROOT)) {
  const entries = fs.readdirSync(SERIES_ROOT, { withFileTypes: true }).filter((e) => e.isDirectory());
  for (const entry of entries) {
    dirByNormalizedSeries.set(normalize(entry.name), entry.name);
  }
}

function buildPaper(entry) {
  const actualSeriesDir = dirByNormalizedSeries.get(normalize(entry.series));
  const folder = actualSeriesDir ? path.join(SERIES_ROOT, actualSeriesDir, entry.id) : null;

  const reviewPath = folder ? path.join(folder, "review.pdf") : null;
  const notebookPath = folder ? path.join(folder, "notebook.ipynb") : null;
  const paperPath = folder ? path.join(folder, "paper.pdf") : null;

  const reviewExists = !!reviewPath && fs.existsSync(reviewPath);
  const notebookExists = !!notebookPath && fs.existsSync(notebookPath);
  const paperExists = !!paperPath && fs.existsSync(paperPath);

  if (!reviewExists) {
    console.warn(`Warning: review.pdf not found for "${entry.id}" (expected under SERIES/${entry.series}/${entry.id}/)`);
  }

  const seriesSegment = actualSeriesDir || entry.series;
  const dateAdded = parseDateFromId(entry.id);
  const repoPathPrefix = ["SERIES", seriesSegment, entry.id];

  return {
    id: entry.id,
    title: entry.title,
    authors: entry.authors || [],
    authorsLabel: (entry.authors || []).join(", "),
    year: entry.year || null,
    series: entry.series,
    field: entry.field || null,
    subfield: entry.subfield || null,
    keywords: entry.keywords || [],
    methods: entry.methods || [],
    datasets: entry.datasets || [],
    researchQuestion: entry.research_question || null,
    mainFinding: entry.main_finding || null,
    researchGaps: entry.research_gaps || [],
    researchIdeas: entry.research_ideas || [],
    dateAddedIso: dateAdded ? dateAdded.toISOString().slice(0, 10) : null,
    dateAddedLabel: dateAdded ? formatDate(dateAdded) : "Undated",
    reviewHref: reviewExists ? encodePath([...repoPathPrefix, "review.pdf"]) : null,
    notebookHref: notebookExists ? encodePath([...repoPathPrefix, "notebook.ipynb"]) : null,
    notebookGithubHref: notebookExists
      ? `https://github.com/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${encodePath([...repoPathPrefix, "notebook.ipynb"])}`
      : null,
    paperHref: paperExists ? encodePath([...repoPathPrefix, "paper.pdf"]) : null,
    connections: (connectionsById.get(entry.id) || []).filter((c) => list.some((p) => p.id === c.target)),
  };
}

const papers = list.map(buildPaper);
const paperById = new Map(papers.map((p) => [p.id, p]));

const groupBySeries = new Map();
for (const group of SERIES_GROUPS) {
  for (const seriesName of group.series) groupBySeries.set(normalize(seriesName), group.name);
}
const groupIndex = new Map(SERIES_GROUPS.map((g, i) => [g.name, i]));

const groups = SERIES_GROUPS.map((group) => ({
  name: group.name,
  series: group.series.map((seriesName) => ({
    name: seriesName,
    papers: papers
      .filter((p) => normalize(p.series) === normalize(seriesName))
      .sort((a, b) => (b.dateAddedIso || "").localeCompare(a.dateAddedIso || "")),
  })),
}));

const allSeriesFlat = groups.flatMap((g) => g.series);
const seriesActiveCount = allSeriesFlat.filter((s) => s.papers.length > 0).length;

let latest = null;
for (const p of papers) {
  if (p.dateAddedIso && (!latest || p.dateAddedIso > latest.dateAddedIso)) {
    latest = p;
  }
}

// Graph edges: dedupe unordered pairs (A->B and B->A both listed is common).
const seenPairs = new Set();
const links = [];
for (const p of papers) {
  for (const c of p.connections) {
    if (!paperById.has(c.target)) continue;
    const pairKey = [p.id, c.target].sort().join("::");
    if (seenPairs.has(pairKey)) continue;
    seenPairs.add(pairKey);
    links.push({ source: p.id, target: c.target, type: c.type || null, keywords: c.keywords || [], strength: c.strength || 1 });
  }
}

const nodes = papers.map((p) => ({
  id: p.id,
  title: p.title,
  series: p.series,
  group: groupBySeries.get(normalize(p.series)) || null,
  groupIndex: groupIndex.get(groupBySeries.get(normalize(p.series))) ?? 0,
  year: p.year,
  authorsLabel: p.authorsLabel,
  mainFinding: p.mainFinding,
  reviewHref: p.reviewHref,
  notebookGithubHref: p.notebookGithubHref,
}));

const library = {
  generatedAt: new Date().toISOString(),
  totalPapers: papers.length,
  seriesActive: seriesActiveCount,
  seriesTotal: allSeriesFlat.length,
  lastUpdatedLabel: latest ? latest.dateAddedLabel : "No reviews on file",
  latest,
  groups,
  graph: { nodes, links, groupLegend: SERIES_GROUPS.map((g) => g.name) },
};

fs.writeFileSync(path.join(ROOT, "library.json"), JSON.stringify(library, null, 2), "utf8");

console.log(`Built library.json: ${papers.length} paper(s), ${links.length} connection(s), across ${seriesActiveCount} of ${allSeriesFlat.length} series.`);
