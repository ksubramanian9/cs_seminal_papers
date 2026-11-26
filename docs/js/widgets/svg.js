/* Small SVG helpers shared by the widget models. Text always goes in through textContent. */

const NS = 'http://www.w3.org/2000/svg';

export function svgEl(tag, attrs = {}, text) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
}

/** A path "M x,y L x,y …" through points [[x, y], …], rounded to 0.1 px. */
export function linePath(points) {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

/** Format a number with `d` decimals, using a minus sign that cannot be mistaken for a dash. */
export function fmt(n, d = 1) {
  if (!Number.isFinite(n)) return n > 0 ? '∞' : '−∞';
  return n.toFixed(d).replace('-', '−');
}
