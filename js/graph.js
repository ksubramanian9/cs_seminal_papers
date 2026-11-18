/*
 * SVG graph: lanes, era bands, nodes, edges, zoom/pan and selection highlighting.
 * Uses D3 (global `d3`, vendored) for scales-of-zoom and data joins only.
 *
 * Structure inside #canvas:
 *   .era-header   fixed strip with era names + the question each era asked (follows x pan/zoom)
 *   .stage        the zoomable SVG (lanes, bands, edges, nodes) + sticky lane labels
 *   .axis         fixed year axis (follows x pan/zoom)
 */

import { GUTTER, X_SEGMENTS, computeLayout, makeXScale } from './layout.js';
import { buildIndex, ancestors, descendants, rivals } from './traverse.js';
import { EDGE_STYLE, EVIDENCE_STYLE, MARKER_PATH } from './style.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const HEADER_H = 78;
const AXIS_H = 28;
const LABEL_HIDE_BELOW_K = 0.5; // hide node labels when zoomed out further than this

const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
};

function makeMeasurer(font) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = font;
  return (text) => ctx.measureText(text).width;
}

/** Greedy word wrap into at most maxLines lines of at most maxWidth px. */
function wrapText(text, maxWidth, measure, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measure(next) > maxWidth) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  if (lines.length <= maxLines) return lines;
  const out = lines.slice(0, maxLines);
  out[maxLines - 1] = out[maxLines - 1].replace(/[\s,.;:]*$/, '') + '…';
  return out;
}

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createGraph(root, data, { onSelect, animate = !prefersReducedMotion() } = {}) {
  const { papers, edges, eras, lanes: laneDefs } = data;
  const ghosts = data.ghosts || [];
  const paperById = new Map(papers.map((p) => [p.id, p]));
  const ghostById = new Map(ghosts.map((g) => [g.id, g]));

  /* ---------- layout ---------- */
  const measureLabel = makeMeasurer('11px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif');
  const xScale = makeXScale(X_SEGMENTS, GUTTER);
  const layout = computeLayout({
    nodes: [
      ...papers.map((p) => ({
        id: p.id, year: p.year, lane: p.primary_field, label: p.short || p.title,
        impact: p.conceptual_impact_1_3,
      })),
      // Ghost nodes: outside influences. Drawn small and grey; they carry the year in the label.
      ...ghosts.map((g) => ({
        id: g.id, year: g.year, lane: g.lane, label: `${g.title} (${g.year})`, impact: 2, ghost: true,
      })),
    ],
    lanes: laneDefs, xScale, measure: measureLabel,
  });
  const nodeById = new Map(layout.nodes.map((n) => [n.id, n]));
  const W = layout.width, H = layout.height;
  const index = buildIndex(edges);

  /* ---------- DOM scaffold ---------- */
  root.textContent = '';
  const headerSvg = el('svg', { class: 'era-header', height: HEADER_H, 'aria-hidden': 'true' });
  const legendSlot = document.createElement('div');
  legendSlot.className = 'legend-slot';
  const stage = document.createElement('div');
  stage.className = 'stage';
  const svg = el('svg', { class: 'main-svg', role: 'group', 'aria-label': 'Papers by year and field' });
  const axisSvg = el('svg', { class: 'axis', height: AXIS_H, 'aria-hidden': 'true' });
  stage.appendChild(svg);
  root.append(headerSvg, legendSlot, stage, axisSvg);

  const controls = document.createElement('div');
  controls.className = 'zoom-controls';
  for (const [text, label, fn] of [
    ['+', 'Zoom in', () => zoomBy(1.4)],
    ['−', 'Zoom out', () => zoomBy(1 / 1.4)],
    ['Fit', 'Fit the whole timeline', () => fit(true)],
  ]) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.title = label;
    b.setAttribute('aria-label', label);
    b.addEventListener('click', fn);
    controls.appendChild(b);
  }
  stage.appendChild(controls);

  /* ---------- defs (arrowheads) ---------- */
  const defs = el('defs', {}, svg);
  for (const [type, st] of Object.entries(EDGE_STYLE)) {
    if (!st.marker) continue;
    const m = el('marker', {
      id: `arrow-${type}`, viewBox: '0 0 10 10', refX: 9, refY: 5,
      markerWidth: 9, markerHeight: 9, markerUnits: 'userSpaceOnUse', orient: 'auto',
    }, defs);
    el('path', { d: MARKER_PATH[st.marker], fill: st.color, class: `mk mk-${type}` }, m);
  }

  /* ---------- world (zoomable) ---------- */
  const world = el('g', { class: 'world' }, svg);
  const bgRect = el('rect', { class: 'bg', x: 0, y: 0, width: W, height: H, fill: 'transparent' }, world);

  // lane stripes
  const laneG = el('g', { class: 'lanes' }, world);
  layout.lanes.forEach((l, i) => {
    el('rect', {
      class: `lane-stripe ${i % 2 ? 'odd' : 'even'}`, x: 0, y: l.y0, width: W, height: l.h,
    }, laneG);
  });

  // era bands
  const eraBounds = eras.map((e, i) => ({
    ...e,
    x0: i === 0 ? GUTTER : xScale(e.start),
    x1: i === eras.length - 1 ? W : xScale(e.end + 1),
  }));
  const bandG = el('g', { class: 'era-bands' }, world);
  eraBounds.forEach((e, i) => {
    el('rect', { class: `era-band ${i % 2 ? 'odd' : 'even'}`, x: e.x0, y: 0, width: e.x1 - e.x0, height: H }, bandG);
  });

  // decade grid + compression break
  const gridG = el('g', { class: 'grid' }, world);
  for (let y = 1910; y <= 2020; y += 10) {
    el('line', { x1: xScale(y), x2: xScale(y), y1: 0, y2: H, class: 'gridline' }, gridG);
  }
  el('line', { x1: xScale(1930), x2: xScale(1930), y1: 0, y2: H, class: 'gridline break' }, gridG);

  // edges (under nodes)
  const edgeG = el('g', { class: 'edges' }, world);
  const edgeEls = new Map();
  const edgePath = (e) => {
    const a = nodeById.get(e.from), b = nodeById.get(e.to);
    if (!a || !b) return null;
    const gap = b.x - b.r - (a.x + a.r);
    if (gap < 24) {
      // near-simultaneous: connect vertically, from the edge facing the other node
      const down = b.y >= a.y;
      const sy = a.y + (down ? a.r : -a.r), ty = b.y + (down ? -b.r : b.r), my = (sy + ty) / 2;
      return `M${a.x},${sy} C${a.x},${my} ${b.x},${my} ${b.x},${ty}`;
    }
    const x1 = a.x + a.r, x2 = b.x - b.r - 1, dx = Math.max(30, (x2 - x1) * 0.5);
    return `M${x1},${a.y} C${x1 + dx},${a.y} ${x2 - dx},${b.y} ${x2},${b.y}`;
  };
  for (const e of edges) {
    const d = edgePath(e);
    const st = EDGE_STYLE[e.type];
    if (!d || !st) { console.warn('Skipping edge with unknown endpoint or type', e); continue; }
    const ev = EVIDENCE_STYLE[e.evidence] || EVIDENCE_STYLE.interpretive;
    const path = el('path', {
      class: `edge edge-${e.type} ev-${e.evidence}`, d, fill: 'none', stroke: st.color,
      'stroke-width': (st.width * ev.widthFactor).toFixed(2), 'stroke-opacity': ev.opacity,
      'stroke-linecap': 'round',
    }, edgeG);
    if (st.dash) path.setAttribute('stroke-dasharray', st.dash);
    if (st.marker) path.setAttribute('marker-end', `url(#arrow-${e.type})`);
    edgeEls.set(e, path);
  }

  // nodes
  const nodeG = el('g', { class: 'nodes' }, world);
  const nodeEls = new Map();
  for (const n of layout.nodes) {
    if (n.ghost) {
      const gd = ghostById.get(n.id);
      const gg = el('g', {
        class: 'node ghost', transform: `translate(${n.x},${n.y})`, 'data-id': n.id,
        'aria-label': `${gd.title}, ${gd.year}: outside influence`,
      }, nodeG);
      el('circle', { r: n.r - 1 }, gg);
      const gt = el('text', { class: 'label', x: n.r + 3, y: 0, dy: '0.35em' }, gg);
      gt.textContent = n.label;
      const gtitle = el('title', {}, gg);
      gtitle.textContent = `${gd.title} (${gd.year}), outside the list: ${gd.blurb}`;
      nodeEls.set(n.id, gg);
      continue;
    }
    const p = paperById.get(n.id);
    const g = el('g', {
      class: 'node', transform: `translate(${n.x},${n.y})`, tabindex: 0, role: 'button',
      'data-id': n.id, 'aria-label': `${p.title}, ${p.year}`,
    }, nodeG);
    const lane = layout.lanes.find((l) => l.id === n.lane);
    el('circle', { r: n.r, fill: lane.color }, g);
    const t = el('text', { class: 'label', x: n.r + 4, y: 0, dy: '0.35em' }, g);
    t.textContent = n.label;
    const title = el('title', {}, g);
    title.textContent = `${p.title} — ${p.authors}, ${p.year}`;
    g.addEventListener('click', (ev) => { ev.stopPropagation(); select(n.id, { fromUser: true }); });
    g.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(n.id, { fromUser: true }); }
    });
    nodeEls.set(n.id, g);
  }

  // sticky lane labels (screen space, y follows the zoom transform)
  const gutterG = el('g', { class: 'gutter' }, svg);
  const laneLabelEls = layout.lanes.map((l) => {
    const t = el('text', { class: 'lane-label', x: 10, fill: l.color }, gutterG);
    const lines = wrapText(l.label, 96, makeMeasurer('600 11px system-ui, sans-serif'), 3);
    lines.forEach((line, i) => {
      const s = el('tspan', { x: 10, dy: i === 0 ? '0' : '1.15em' }, t);
      s.textContent = line;
    });
    t.dataset.lines = String(lines.length);
    return t;
  });

  /* ---------- zoom / pan ---------- */
  let viewW = 800, viewH = 600;
  let transform = d3.zoomIdentity;
  const zoom = d3.zoom()
    .scaleExtent([0.2, 3])
    .on('zoom', (ev) => { transform = ev.transform; applyTransform(); });
  const svgSel = d3.select(svg);
  svgSel.call(zoom).on('dblclick.zoom', null);

  function fitTransform() {
    const k = Math.min(viewW / W, viewH / H);
    const kk = Math.max(k, 0.2);
    return d3.zoomIdentity.translate(0, Math.max(0, (viewH - H * kk) / 2)).scale(kk);
  }

  /**
   * Clamp a transform so the view never leaves the world. d3's zoom.transform() does not
   * apply translateExtent, so programmatic moves (fit, focus) go through this first.
   * A world smaller than the view is pinned left (x) or centred (y).
   */
  function constrain(t) {
    const clampAxis = (pos, worldPx, view, centre) => {
      if (worldPx <= view) return centre ? (view - worldPx) / 2 : 0;
      return Math.min(0, Math.max(view - worldPx, pos));
    };
    return d3.zoomIdentity
      .translate(clampAxis(t.x, W * t.k, viewW, false), clampAxis(t.y, H * t.k, viewH, true))
      .scale(t.k);
  }

  function updateConstraints() {
    zoom.extent([[0, 0], [viewW, viewH]]).translateExtent([[0, 0], [W, H]]);
    zoom.scaleExtent([Math.min(fitTransform().k, 0.6) * 0.9, 3]);
  }

  function applyTransform() {
    const t = transform;
    world.setAttribute('transform', t.toString());
    svg.classList.toggle('zoomed-out', t.k < LABEL_HIDE_BELOW_K);
    laneLabelEls.forEach((txt, i) => {
      const l = layout.lanes[i];
      const lines = Number(txt.dataset.lines) || 1;
      const cy = t.applyY(l.cy);
      const y = cy - ((lines - 1) * 11 * 1.15) / 2 + 4;
      txt.setAttribute('y', y);
      txt.querySelectorAll('tspan').forEach((s, j) => { if (j === 0) s.setAttribute('y', y); });
      const lh = l.h * t.k;
      txt.style.display = lh < lines * 13 ? 'none' : '';
    });
    renderHeader();
    renderAxis();
  }

  /* ---------- fixed header (eras) and axis (years) ---------- */
  const measureEraTitle = makeMeasurer('600 12px system-ui, sans-serif');
  const measureEraQ = makeMeasurer('11px system-ui, sans-serif');
  function renderHeader() {
    headerSvg.textContent = '';
    const t = transform;
    const defsH = el('defs', {}, headerSvg);
    eraBounds.forEach((e, i) => {
      const x0 = t.applyX(e.x0), x1 = t.applyX(e.x1);
      if (x1 < 0 || x0 > viewW) return;
      const cid = `eraclip-${i}`;
      const cp = el('clipPath', { id: cid }, defsH);
      el('rect', { x: x0, y: 0, width: Math.max(0, x1 - x0), height: HEADER_H }, cp);
      el('rect', { class: `era-band ${i % 2 ? 'odd' : 'even'}`, x: x0, y: 0, width: Math.max(0, x1 - x0), height: HEADER_H }, headerSvg);
      const g = el('g', { 'clip-path': `url(#${cid})` }, headerSvg);
      const tx = Math.min(Math.max(x0, 0) + 8, x1 - 60);
      const wrapW = Math.max(64, Math.min(x1 - Math.max(x0, 0) - 16, 260));
      const tLines = wrapText(`${e.id} · ${e.label}`, wrapW, measureEraTitle, 2);
      const title = el('text', { class: 'era-title', x: tx, y: 16 }, g);
      tLines.forEach((line, j) => {
        const s = el('tspan', { x: tx, dy: j === 0 ? 0 : '1.2em' }, title);
        s.textContent = line;
      });
      const qy = 16 + (tLines.length - 1) * 14.4 + 15;
      const q = wrapText(e.question, wrapW, measureEraQ, 5 - tLines.length);
      const qt = el('text', { class: 'era-q', x: tx, y: qy }, g);
      q.forEach((line, j) => {
        const s = el('tspan', { x: tx, dy: j === 0 ? 0 : '1.25em' }, qt);
        s.textContent = line;
      });
      const tip = el('title', {}, g);
      tip.textContent = `${e.id} · ${e.label} (${e.start}–${e.end}): ${e.question} ${e.summary}`;
      el('line', { class: 'era-divider', x1: x0, x2: x0, y1: 0, y2: HEADER_H }, headerSvg);
    });
    headerSvg.setAttribute('width', viewW);
  }

  function renderAxis() {
    axisSvg.textContent = '';
    axisSvg.setAttribute('width', viewW);
    const t = transform;
    const step = t.k >= 1 ? 5 : 10;
    for (let y = 1910; y <= 2020; y += step) {
      if (y === 1920) continue; // compressed stretch: label only 1910 and 1930
      const x = t.applyX(xScale(y));
      if (x < GUTTER * t.k - 5 && x < 0) continue;
      if (x > viewW) continue;
      el('line', { class: 'tick', x1: x, x2: x, y1: 0, y2: 6 }, axisSvg);
      const tt = el('text', { class: 'tick-label', x, y: 19, 'text-anchor': 'middle' }, axisSvg);
      tt.textContent = String(y);
    }
    // axis break marker where the scale becomes uniform
    const bx = t.applyX(xScale(1930));
    if (bx >= 0 && bx <= viewW) {
      el('path', { class: 'axis-break', d: `M${bx - 4},0 L${bx + 4},6 M${bx - 4},6 L${bx + 4},0` }, axisSvg);
    }
  }

  /* ---------- selection ---------- */
  let selected = null;

  function applySelection(id) {
    selected = id;
    svg.classList.toggle('has-sel', !!id);
    for (const g of nodeEls.values()) g.classList.remove('sel', 'anc', 'desc', 'rival', 'on');
    for (const p of edgeEls.values()) p.classList.remove('on');
    if (!id) return;
    const A = ancestors(index, id);
    const D = descendants(index, id);
    const R = rivals(edges, id);
    nodeEls.get(id)?.classList.add('sel', 'on');
    for (const a of A) nodeEls.get(a)?.classList.add('anc', 'on');
    for (const d of D) nodeEls.get(d)?.classList.add('desc', 'on');
    for (const r of R) nodeEls.get(r)?.classList.add('rival', 'on');
    for (const [e, path] of edgeEls) {
      let on = false;
      if (e.type === 'rival') on = e.from === id || e.to === id;
      else if ((A.has(e.from) && (A.has(e.to) || e.to === id)) ||
               ((D.has(e.to)) && (D.has(e.from) || e.from === id))) on = true;
      if (on) { path.classList.add('on'); path.parentNode.appendChild(path); }
    }
    nodeEls.get(id)?.parentNode.appendChild(nodeEls.get(id)); // bring selected node to front
  }

  function select(id, { fromUser = false } = {}) {
    if (id !== null && (!nodeById.has(id) || ghostById.has(id))) return false; // ghosts are not selectable
    applySelection(id);
    onSelect?.(id, { fromUser });
    return true;
  }

  svg.addEventListener('click', (ev) => {
    if (ev.target === svg || ev.target === bgRect || ev.target.classList?.contains('lane-stripe') ||
        ev.target.classList?.contains('era-band')) select(null, { fromUser: true });
  });
  const onKeydown = (ev) => {
    if (ev.key === 'Escape' && selected) select(null, { fromUser: true });
  };
  document.addEventListener('keydown', onKeydown);

  /* ---------- navigation helpers ---------- */
  // Animated moves use d3 transitions; with animate:false (reduced motion, tests) they are instant.
  const moveSel = (ms) => (animate ? svgSel.transition().duration(ms) : svgSel);
  function zoomBy(factor) { moveSel(200).call(zoom.scaleBy, factor); }
  function fit(wantAnimation) {
    const t = constrain(fitTransform());
    (wantAnimation ? moveSel(300) : svgSel).call(zoom.transform, t);
  }

  /** Pan (keeping zoom) so node `id` is centred; skipped if already comfortably visible and onlyIfOffscreen. */
  function focus(id, { onlyIfOffscreen = false } = {}) {
    const n = nodeById.get(id);
    if (!n) return;
    resize(); // the panel may just have changed the stage width
    const sx = transform.applyX(n.x), sy = transform.applyY(n.y);
    const margin = 60;
    const visible = sx > margin && sx < viewW - margin - n.labelW * transform.k && sy > margin && sy < viewH - margin;
    if (onlyIfOffscreen && visible) return;
    const k = Math.max(transform.k, 0.9);
    const t = constrain(d3.zoomIdentity.translate(viewW / 2 - n.x * k, viewH / 2 - n.y * k).scale(k));
    moveSel(400).call(zoom.transform, t);
  }

  function resize() {
    const r = stage.getBoundingClientRect();
    if (!r.width || !r.height) return;
    viewW = r.width; viewH = r.height;
    svg.setAttribute('width', viewW);
    svg.setAttribute('height', viewH);
    updateConstraints();
    // The stage may have just shrunk or grown (panel opened/closed): keep the view inside the world.
    // Only intervene for a real (>0.5px) violation: zoom.transform() interrupts any in-flight
    // pan/zoom transition, and sub-pixel float noise must not cancel an animation.
    const c = constrain(transform);
    if (Math.abs(c.x - transform.x) > 0.5 || Math.abs(c.y - transform.y) > 0.5) svgSel.call(zoom.transform, c);
    else applyTransform();
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(stage);
  resize();
  fit(false);

  return {
    select, focus, fit: () => fit(true), legendSlot,
    /** Re-measure the stage and re-clamp the view. Call after anything that changes the stage size. */
    resize,
    get selected() { return selected; },
    /** True for papers (selectable). Ghost nodes are not selectable. */
    has: (id) => nodeById.has(id) && !ghostById.has(id),
    destroy() {
      ro.disconnect();
      document.removeEventListener('keydown', onKeydown);
      svgSel.interrupt().on('.zoom', null);
    },
  };
}
