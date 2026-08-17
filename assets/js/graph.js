(function () {
  "use strict";

  // Six restrained, desaturated tones in the same family as the palette -
  // a "leather library" set, not a bright categorical rainbow. Indexed by
  // each paper's meta-group (see scripts/build.js SERIES_GROUPS order).
  const GROUP_COLORS = ["#172A3A", "#3F4A32", "#6B5744", "#8B6B3D", "#3E5266", "#5C3232"];

  const LINK_DASH = {
    conceptual: null,
    methodological: "5,3",
    empirical: "1,3",
  };

  function colorForGroup(index) {
    return GROUP_COLORS[(index || 0) % GROUP_COLORS.length];
  }

  function dashForType(type) {
    return LINK_DASH[type] || null;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function truncate(s, n) {
    if (!s || s.length <= n) return s || "";
    return s.slice(0, n - 3).trim() + "...";
  }

  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.25).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
  }

  function renderDetail(detailEl, node) {
    if (!node) {
      detailEl.className = "graph-detail graph-detail--empty";
      detailEl.innerHTML = "<p>Hover or click a paper to see its details and connections.</p>";
      return;
    }
    detailEl.className = "graph-detail";
    const byline = [node.authorsLabel, node.year].filter(Boolean).join(" · ");
    const links = [];
    if (node.reviewHref) links.push(`<a href="${node.reviewHref}" target="_blank" rel="noopener noreferrer">Read Review</a>`);
    if (node.notebookGithubHref) links.push(`<a href="${node.notebookGithubHref}" target="_blank" rel="noopener noreferrer">View Notebook</a>`);

    detailEl.innerHTML = [
      `<p class="graph-detail-series">${escapeHtml(node.series || "")}</p>`,
      `<h3 class="graph-detail-title">${escapeHtml(node.title || "")}</h3>`,
      byline ? `<p class="graph-detail-byline">${escapeHtml(byline)}</p>` : "",
      node.mainFinding ? `<p class="graph-detail-finding">${escapeHtml(node.mainFinding)}</p>` : "",
      links.length ? `<p class="graph-detail-links">${links.join(' <span class="meta-sep">&middot;</span> ')}</p>` : "",
    ].join("");
  }

  function renderLegend(legendEl, nodes, groupLegend) {
    if (!legendEl) return;
    const used = Array.from(new Set(nodes.map((n) => n.groupIndex || 0))).sort((a, b) => a - b);
    if (used.length < 2) {
      legendEl.innerHTML = "";
      return;
    }
    legendEl.innerHTML = used
      .map((i) => {
        const name = (groupLegend && groupLegend[i]) || "Other";
        return [
          '<span class="graph-legend-item">',
          `<span class="graph-legend-swatch" style="background:${colorForGroup(i)}"></span>`,
          escapeHtml(name),
          "</span>",
        ].join("");
      })
      .join("");
  }

  function renderGraph(container, detailEl, legendEl, graphData) {
    const nodes = (graphData.nodes || []).map((d) => Object.assign({}, d));
    const links = (graphData.links || []).map((d) => Object.assign({}, d));

    if (nodes.length === 0) {
      container.innerHTML = '<p class="graph-empty">Your library graph will take shape as reviews are added.</p>';
      if (legendEl) legendEl.innerHTML = "";
      return;
    }

    renderLegend(legendEl, nodes, graphData.groupLegend);

    container.innerHTML = "";

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const degree = new Map();
    nodes.forEach((n) => degree.set(n.id, 0));
    links.forEach((l) => {
      degree.set(l.source, (degree.get(l.source) || 0) + 1);
      degree.set(l.target, (degree.get(l.target) || 0) + 1);
    });
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const adjacency = new Map(nodes.map((n) => [n.id, new Set()]));
    links.forEach((l) => {
      adjacency.get(l.source).add(l.target);
      adjacency.get(l.target).add(l.source);
    });

    const svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    const g = svg.append("g");

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.6, 3])
        .on("zoom", (event) => g.attr("transform", event.transform))
    );

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => 190 - (d.strength || 1) * 9)
          .strength(0.35)
      )
      .force("charge", d3.forceManyBody().strength(-320))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(32))
      .on("tick", ticked);

    const linkSel = g
      .append("g")
      .attr("class", "graph-links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "graph-link")
      .attr("stroke-width", (d) => 0.6 + (d.strength || 1) * 0.35)
      .attr("stroke-dasharray", (d) => dashForType(d.type));

    const nodeSel = g
      .append("g")
      .attr("class", "graph-nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "graph-node")
      .call(drag(simulation));

    function radiusFor(d) {
      return 6 + Math.min(degree.get(d.id) || 0, 10) * 1.9;
    }

    nodeSel
      .append("circle")
      .attr("r", radiusFor)
      .style("fill", (d) => colorForGroup(d.groupIndex));

    nodeSel
      .append("text")
      .attr("x", (d) => radiusFor(d) + 4)
      .attr("y", "0.32em")
      .text((d) => truncate(d.title, 38));

    function setActive(id) {
      const neighbors = adjacency.get(id) || new Set();
      nodeSel.classed("is-active", (d) => d.id === id).classed("is-dim", (d) => d.id !== id && !neighbors.has(d.id));
      linkSel
        .classed("is-active", (d) => d.source.id === id || d.target.id === id)
        .classed("is-dim", (d) => d.source.id !== id && d.target.id !== id);
      renderDetail(detailEl, nodeById.get(id));
    }

    function clearActive() {
      nodeSel.classed("is-active", false).classed("is-dim", false);
      linkSel.classed("is-active", false).classed("is-dim", false);
      renderDetail(detailEl, null);
    }

    nodeSel
      .on("mouseenter", (event, d) => setActive(d.id))
      .on("mouseleave", clearActive)
      .on("click", (event, d) => {
        event.stopPropagation();
        const node = nodeById.get(d.id);
        if (node && node.reviewHref) {
          window.open(node.reviewHref, "_blank", "noopener,noreferrer");
        }
      });

    renderDetail(detailEl, null);

    function ticked() {
      linkSel
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      nodeSel.attr("transform", (d) => `translate(${d.x},${d.y})`);
    }
  }

  function initGraph() {
    const container = document.getElementById("graph-container");
    if (!container) return;
    const detailEl = document.getElementById("graph-detail");
    const legendEl = document.getElementById("graph-legend");

    fetch("library.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`library.json: HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => renderGraph(container, detailEl, legendEl, data.graph || { nodes: [], links: [] }))
      .catch((err) => {
        container.innerHTML = '<p class="graph-empty">Unable to load the graph right now.</p>';
        console.error(err);
      });
  }

  document.addEventListener("DOMContentLoaded", initGraph);
})();
