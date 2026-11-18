import { EDGE_STYLE, EVIDENCE_STYLE, HIGHLIGHT, MARKER_PATH } from './style.js';
import { radiusFor } from './layout.js';

const SVGNS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs, parent) {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
}

function item(container, label, drawSwatch, width = 36) {
  const wrap = document.createElement('span');
  wrap.className = 'legend-item';
  const svg = svgEl('svg', { width, height: 20, viewBox: `0 0 ${width} 20`, 'aria-hidden': 'true' }, wrap);
  drawSwatch(svg);
  const t = document.createElement('span');
  t.textContent = label;
  wrap.appendChild(t);
  container.appendChild(wrap);
}

function group(container, title) {
  const g = document.createElement('div');
  g.className = 'legend-group';
  const h = document.createElement('strong');
  h.textContent = title;
  g.appendChild(h);
  container.appendChild(g);
  return g;
}

function edgeSwatch(type, evidence = 'explicit') {
  return (svg) => {
    const st = EDGE_STYLE[type];
    const ev = EVIDENCE_STYLE[evidence];
    if (st.marker) {
      const id = `lg-${type}-${evidence}`;
      const defs = svgEl('defs', {}, svg);
      const m = svgEl('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, markerUnits: 'userSpaceOnUse', orient: 'auto' }, defs);
      svgEl('path', { d: MARKER_PATH[st.marker], fill: st.color, class: `mk mk-${type}` }, m);
    }
    const line = svgEl('line', {
      class: `sw-${type}`, x1: 2, y1: 10, x2: st.marker ? 30 : 34, y2: 10, stroke: st.color,
      'stroke-width': (st.width * ev.widthFactor).toFixed(2), 'stroke-opacity': ev.opacity, 'stroke-linecap': 'round',
    }, svg);
    if (st.dash) line.setAttribute('stroke-dasharray', st.dash);
    if (st.marker) line.setAttribute('marker-end', `url(#lg-${type}-${evidence})`);
  };
}

export function renderLegend(container) {
  container.textContent = '';

  const g1 = group(container, 'Node size = conceptual impact');
  for (const [n, label] of [[2, 'significant'], [3, 'foundational']]) {
    item(g1, label, (svg) => svgEl('circle', { cx: 12, cy: 10, r: radiusFor(n), fill: '#8a8f98' }, svg), 26);
  }
  item(g1, 'outside influence (not in the list)', (svg) =>
    svgEl('circle', { class: 'sw-ghost', cx: 12, cy: 10, r: 5, fill: '#e5e7eb', stroke: '#6b7280', 'stroke-width': 1.5, 'stroke-dasharray': '3 2' }, svg), 26);

  const g2 = group(container, 'Links (earlier → later)');
  for (const [type, st] of Object.entries(EDGE_STYLE)) item(g2, st.label, edgeSwatch(type));

  const g3 = group(container, 'Evidence');
  item(g3, 'explicit', edgeSwatch('builds_on', 'explicit'));
  item(g3, 'interpretive', edgeSwatch('builds_on', 'interpretive'));

  const g4 = group(container, 'Selected paper');
  for (const [key, label] of [['selected', 'selected'], ['ancestor', 'led to it'], ['descendant', 'it led to']]) {
    item(g4, label, (svg) => svgEl('circle', { class: `sw-ring-${key}`, cx: 12, cy: 10, r: 7, fill: '#fff', stroke: HIGHLIGHT[key], 'stroke-width': 3 }, svg), 26);
  }
}
