(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function countLabel(n, singular, plural) {
    return `${n} ${n === 1 ? singular : plural}`;
  }

  function byline(p) {
    return [p.authorsLabel, p.year ? String(p.year) : null].filter(Boolean).join(" · ");
  }

  function downloadName(p, kind, ext) {
    return `${p.title} - ${kind}.${ext}`.replace(/\s+/g, " ");
  }

  function loadLibrary() {
    return fetch("library.json", { cache: "no-store" }).then((res) => {
      if (!res.ok) throw new Error(`library.json: HTTP ${res.status}`);
      return res.json();
    });
  }

  function renderLatestBlock(data) {
    if (!data.latest) {
      return '<div class="latest-card latest-card--empty"><p>No reviews on file yet.</p></div>';
    }
    const p = data.latest;
    return [
      '<div class="latest-card">',
      `<p class="latest-series">${escapeHtml(p.series)}</p>`,
      `<h2 class="latest-title"><a href="${p.reviewHref}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.title)}</a></h2>`,
      '<p class="latest-date">',
      escapeHtml(byline(p)),
      ' <span class="meta-sep">&middot;</span> ',
      `Added ${escapeHtml(p.dateAddedLabel)}`,
      "</p>",
      "</div>",
    ].join("");
  }

  function initHome() {
    const metaEl = document.getElementById("masthead-meta");
    const latestEl = document.getElementById("latest-addition");
    if (!metaEl && !latestEl) return;

    loadLibrary()
      .then((data) => {
        if (metaEl) {
          metaEl.innerHTML = [
            `<span>Last Updated: ${escapeHtml(data.lastUpdatedLabel)}</span>`,
            '<span class="meta-sep">&middot;</span>',
            `<span>${countLabel(data.totalPapers, "Paper", "Papers")} on File</span>`,
            '<span class="meta-sep">&middot;</span>',
            `<span>${data.seriesActive} of ${data.seriesTotal} Series Active</span>`,
          ].join("");
        }
        if (latestEl) {
          latestEl.innerHTML = renderLatestBlock(data);
        }
      })
      .catch((err) => {
        if (latestEl) latestEl.innerHTML = '<div class="latest-card latest-card--empty"><p>Unable to load the library right now.</p></div>';
        console.error(err);
      });
  }

  function renderPaperLinks(p) {
    const links = [];
    if (p.reviewHref) {
      links.push(`<a href="${p.reviewHref}" target="_blank" rel="noopener noreferrer">Review</a>`);
      links.push(`<a class="download-link" href="${p.reviewHref}" download="${escapeHtml(downloadName(p, "Review", "pdf"))}">Download</a>`);
    }
    if (p.paperHref) {
      links.push(`<a href="${p.paperHref}" target="_blank" rel="noopener noreferrer">Original Paper</a>`);
    }
    return links.join(' <span class="meta-sep">&middot;</span> ');
  }

  function renderPaperRow(p) {
    return [
      "<li>",
      `<a class="paper-title" href="${p.reviewHref || "#"}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.title)}</a>`,
      `<p class="paper-byline">${escapeHtml(byline(p))}</p>`,
      `<p class="paper-links">${renderPaperLinks(p)}</p>`,
      "</li>",
    ].join("");
  }

  function renderSeriesEntry(s) {
    const hasPapers = s.papers.length > 0;
    const countText = hasPapers ? countLabel(s.papers.length, "Paper", "Papers") : "No Reviews Yet";

    if (!hasPapers) {
      return [
        `<div class="series-entry series-entry--empty" data-series="${escapeHtml(s.name.toLowerCase())}">`,
        `<span class="series-name">${escapeHtml(s.name)}</span>`,
        '<span class="series-fill" aria-hidden="true"></span>',
        `<span class="series-count">${countText}</span>`,
        "</div>",
      ].join("");
    }

    const searchBlob = escapeHtml(
      [s.name, ...s.papers.flatMap((p) => [p.title, p.authorsLabel, ...(p.keywords || []), ...(p.methods || [])])]
        .join(" ")
        .toLowerCase()
    );

    return [
      `<details class="series-entry" data-series="${escapeHtml(s.name.toLowerCase())}" data-search="${searchBlob}">`,
      "<summary>",
      `<span class="series-name">${escapeHtml(s.name)}</span>`,
      '<span class="series-fill" aria-hidden="true"></span>',
      `<span class="series-count">${countText}</span>`,
      "</summary>",
      '<ul class="paper-list">',
      s.papers.map(renderPaperRow).join(""),
      "</ul>",
      "</details>",
    ].join("");
  }

  function renderGroups(groups) {
    return groups
      .map((group) => {
        return [
          '<div class="category">',
          `<h3 class="category-title">${escapeHtml(group.name)}</h3>`,
          group.series.map(renderSeriesEntry).join(""),
          "</div>",
        ].join("");
      })
      .join("");
  }

  function initArchive() {
    const container = document.getElementById("archive-groups");
    if (!container) return;

    const searchInput = document.getElementById("archive-search");
    const emptyState = document.getElementById("archive-empty");

    loadLibrary()
      .then((data) => {
        container.innerHTML = renderGroups(data.groups);
        if (searchInput) {
          searchInput.disabled = false;
          searchInput.addEventListener("input", () => applyFilter(container, emptyState, searchInput.value));
        }
      })
      .catch((err) => {
        container.innerHTML = "<p>Unable to load the archive right now. Please try again shortly.</p>";
        console.error(err);
      });
  }

  function applyFilter(container, emptyState, rawQuery) {
    const query = rawQuery.trim().toLowerCase();
    let anyVisible = false;

    container.querySelectorAll(".category").forEach((category) => {
      let categoryHasVisible = false;

      category.querySelectorAll(".series-entry").forEach((entry) => {
        let visible = true;
        if (query) {
          const haystack = entry.dataset.search || entry.dataset.series || "";
          visible = haystack.includes(query);
        }
        entry.style.display = visible ? "" : "none";
        if (visible) categoryHasVisible = true;
        if (visible && query && entry.tagName === "DETAILS") {
          entry.open = true;
        } else if (!query && entry.tagName === "DETAILS") {
          entry.open = false;
        }
      });

      category.style.display = categoryHasVisible ? "" : "none";
      if (categoryHasVisible) anyVisible = true;
    });

    if (emptyState) emptyState.hidden = anyVisible || !query;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHome();
    initArchive();
  });
})();
