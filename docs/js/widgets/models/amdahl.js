/*
 * Amdahl's law for the slider widget (CS021).
 *
 * If a fraction p of a program's work can be spread over N processors and the rest cannot, the
 * speedup is  S = 1 / ((1 - p) + p / N).  However large N becomes, S never exceeds 1 / (1 - p):
 * the serial part sets the ceiling. Pure functions plus render().
 */

import { svgEl, linePath, fmt } from '../svg.js';

export const id = 'amdahl';

export const speedup = (p, n) => 1 / (1 - p + p / n);
export const speedupLimit = (p) => (p >= 1 ? Infinity : 1 / (1 - p));

/** A tidy upper bound for the chart's vertical axis. */
function niceCeil(v) {
  const mag = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * mag >= v - 1e-9) return m * mag;
  return 10 * mag;
}

export function compute(values, config) {
  const p = Math.min(1, Math.max(0, (Number(values.parallel) || 0) / 100));
  const n = Math.max(1, Number(values.processors) || 1);
  const s = speedup(p, n);
  const limit = speedupLimit(p);
  const maxN = Math.max(...(config.sliders.find((x) => x.id === 'processors').values));
  const message = !Number.isFinite(limit)
    ? 'With every part of the work parallel, speedup keeps growing with the processors.'
    : `With ${fmt(p * 100, 0)}% parallel work, no number of processors can give more than ${fmt(limit, limit < 10 ? 1 : 0)}× speedup.`;
  return {
    p, n, speedup: s, limit, efficiency: s / n, maxN, message,
    readouts: [
      { label: 'Speedup now', value: `${fmt(s, 2)}×`, hint: `on ${n} processor${n === 1 ? '' : 's'}` },
      { label: 'Ceiling', value: Number.isFinite(limit) ? `${fmt(limit, limit < 10 ? 1 : 0)}×` : 'none', hint: 'what infinitely many processors would give' },
      { label: 'Efficiency', value: `${fmt((s / n) * 100, 0)}%`, hint: 'how much of each processor does useful work' },
    ],
  };
}

export function render(host, state) {
  const W = 400, H = 190, x0 = 40, x1 = 388, y0 = 14, y1 = 150;
  const svg = svgEl('svg', { class: 'sl-chart', viewBox: `0 0 ${W} ${H}`, role: 'img' });
  const kMax = Math.log2(state.maxN);
  const yMax = niceCeil(Math.max(speedup(state.p, state.maxN), Number.isFinite(state.limit) ? state.limit * 1.12 : 0, 2)); // leave room above the ceiling line
  const X = (n) => x0 + (Math.log2(n) / kMax) * (x1 - x0);
  const Y = (s) => y1 - (Math.min(s, yMax) / yMax) * (y1 - y0);

  svg.append(svgEl('rect', { class: 'sl-plot', x: x0, y: y0, width: x1 - x0, height: y1 - y0 }));
  // Ideal linear speedup (S = N) while it fits on the chart, then the real curve.
  const ideal = [];
  for (let k = 0; k <= kMax * 20; k++) { const n = 2 ** (k / 20); if (n > yMax) break; ideal.push([X(n), Y(n)]); }
  if (yMax <= state.maxN) ideal.push([X(yMax), Y(yMax)]); // end exactly at the top of the chart
  svg.append(svgEl('path', { class: 'sl-ideal', d: linePath(ideal), fill: 'none' }));
  if (Number.isFinite(state.limit) && state.limit <= yMax) {
    svg.append(svgEl('line', { class: 'sl-limit', x1: x0, x2: x1, y1: Y(state.limit), y2: Y(state.limit) }));
    svg.append(svgEl('text', { class: 'sl-tick', x: x1 - 2, y: Y(state.limit) - 4, 'text-anchor': 'end' }, `ceiling ${fmt(state.limit, state.limit < 10 ? 1 : 0)}×`));
  }
  const pts = [];
  for (let k = 0; k <= kMax * 20; k++) { const n = 2 ** (k / 20); pts.push([X(n), Y(speedup(state.p, n))]); }
  svg.append(svgEl('path', { class: 'sl-curve', d: linePath(pts), fill: 'none' }));
  svg.append(svgEl('circle', { class: 'sl-dot', cx: X(state.n), cy: Y(state.speedup), r: 5 }));

  // axes
  for (let k = 0; k <= kMax; k += 2) {
    svg.append(svgEl('text', { class: 'sl-tick', x: X(2 ** k), y: y1 + 13, 'text-anchor': 'middle' }, String(2 ** k)));
  }
  svg.append(svgEl('text', { class: 'sl-axis', x: (x0 + x1) / 2, y: y1 + 28, 'text-anchor': 'middle' }, 'processors (doubling to the right)'));
  svg.append(svgEl('text', { class: 'sl-tick', x: x0 - 4, y: y1, 'text-anchor': 'end' }, '1×'));
  svg.append(svgEl('text', { class: 'sl-tick', x: x0 - 4, y: y0 + 8, 'text-anchor': 'end' }, `${yMax}×`));
  svg.append(svgEl('text', { class: 'sl-key ideal', x: x0 + 6, y: y0 + 12 }, 'dashed: ideal speedup'));
  svg.setAttribute('aria-label', `Speedup ${fmt(state.speedup, 2)} times on ${state.n} processors; ${Number.isFinite(state.limit) ? `ceiling ${fmt(state.limit, 1)} times` : 'no ceiling'}.`);
  host.textContent = '';
  host.append(svg);
}
