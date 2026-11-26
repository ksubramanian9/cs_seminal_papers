/*
 * Brooks's law for the slider widget (CS034).
 *
 * A toy model of "adding manpower to a late software project makes it later". W person-months of
 * work are shared among n people, but every pair of people is a communication path costing c
 * person-months of coordination, and there are n(n-1)/2 pairs. Each person then carries W/n of the
 * work plus c(n-1)/2 of coordination, so the project takes
 *
 *     T(n) = W / n + c (n - 1) / 2   months.
 *
 * T falls at first, reaches a best size near sqrt(2W/c), then rises again. Pure functions plus render().
 */

import { svgEl, linePath, fmt } from '../svg.js';

export const id = 'brooks';

export const paths = (n) => (n * (n - 1)) / 2;
export const months = (n, work, cost) => work / n + (cost * (n - 1)) / 2;

/** The whole-number team size in 1..maxN that finishes soonest (the smaller team on a tie). */
export function bestTeam(work, cost, maxN) {
  let best = 1;
  for (let n = 2; n <= maxN; n++) if (months(n, work, cost) < months(best, work, cost) - 1e-12) best = n;
  return best;
}

export function compute(values, config) {
  const maxN = config.sliders.find((s) => s.id === 'team').max;
  const n = Math.max(1, Math.round(Number(values.team) || 1));
  const work = Number(values.work) || 1;
  const cost = Math.max(0, Number(values.cost) || 0);
  const t = months(n, work, cost);
  const best = bestTeam(work, cost, maxN);
  const tBest = months(best, work, cost);
  const past = n > best;
  const message = past
    ? `${n} people is past the best size: adding more people now makes the project later.`
    : n === best ? 'This is the best team size for this project.'
      : `More people still help here, up to about ${best}. Past that, coordination costs more than the extra hands save.`;
  return {
    n, work, cost, maxN, t, best, tBest, paths: paths(n), past, message,
    readouts: [
      { label: 'Communication paths', value: String(paths(n)), hint: `n(n−1)/2 with n = ${n}` },
      { label: 'Time to finish', value: `${fmt(t, 1)} months` },
      { label: 'Best team size', value: `${best} ${best === 1 ? 'person' : 'people'}`, hint: `finishes in ${fmt(tBest, 1)} months` },
    ],
  };
}

export function render(host, state) {
  const W = 400, H = 176;
  const svg = svgEl('svg', { class: 'sl-chart', viewBox: `0 0 ${W} ${H}`, role: 'img' });

  // Left: the people as dots on a circle, and every communication path between them.
  const ccx = 76, ccy = 84, cr = 62, n = state.n;
  const at = (i) => [ccx + cr * Math.sin((2 * Math.PI * i) / n), ccy - cr * Math.cos((2 * Math.PI * i) / n)];
  const lines = svgEl('g', { class: 'bk-paths' });
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const [ax, ay] = at(i), [bx, by] = at(j);
    lines.append(svgEl('line', { class: 'bk-path', x1: ax.toFixed(1), y1: ay.toFixed(1), x2: bx.toFixed(1), y2: by.toFixed(1) }));
  }
  svg.append(lines);
  for (let i = 0; i < n; i++) { const [x, y] = at(i); svg.append(svgEl('circle', { class: 'bk-person', cx: x.toFixed(1), cy: y.toFixed(1), r: n > 24 ? 2.2 : 3.2 })); }
  svg.append(svgEl('text', { class: 'sl-axis', x: ccx, y: H - 4, 'text-anchor': 'middle' }, `${n} ${n === 1 ? 'person' : 'people'}, ${state.paths} paths`));

  // Right: months to finish against team size.
  const x0 = 186, x1 = 392, y0 = 14, y1 = 138;
  const ns = Array.from({ length: state.maxN }, (_, i) => i + 1);
  const ts = ns.map((m) => months(m, state.work, state.cost));
  // The vertical axis stops at about twice the best time, so the dip and the later rise are visible;
  // the very long time for a tiny team runs off the top of the chart.
  const tMax = Math.min(Math.max(...ts), Math.max(state.tBest * 2.2, state.t * 1.15));
  const X = (m) => x0 + ((m - 1) / (state.maxN - 1)) * (x1 - x0);
  const Y = (t) => y1 - (t / tMax) * (y1 - y0);
  const clip = svgEl('clipPath', { id: 'bk-clip' });
  clip.append(svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }));
  svg.append(clip);
  svg.append(svgEl('rect', { class: 'sl-plot', x: x0, y: y0, width: x1 - x0, height: y1 - y0 }));
  svg.append(svgEl('path', { class: 'sl-curve', d: linePath(ns.map((m, i) => [X(m), Y(ts[i])])), fill: 'none', 'clip-path': 'url(#bk-clip)' }));
  svg.append(svgEl('circle', { class: 'sl-best', cx: X(state.best), cy: Y(state.tBest), r: 4.5 }));
  svg.append(svgEl('circle', { class: `sl-dot${state.past ? ' past' : ''}`, cx: X(state.n), cy: Math.max(y0, Y(state.t)), r: 5 }));
  svg.append(svgEl('text', { class: 'sl-tick', x: x0, y: y1 + 13 }, '1'));
  svg.append(svgEl('text', { class: 'sl-tick', x: x1, y: y1 + 13, 'text-anchor': 'end' }, String(state.maxN)));
  svg.append(svgEl('text', { class: 'sl-axis', x: (x0 + x1) / 2, y: y1 + 28, 'text-anchor': 'middle' }, 'team size (people)' ));
  svg.append(svgEl('text', { class: 'sl-tick', x: x0 - 4, y: y0 + 8, 'text-anchor': 'end' }, `${fmt(tMax, 0)}`));
  svg.append(svgEl('text', { class: 'sl-axis', x: x0, y: 10 }, 'months to finish'));
  svg.setAttribute('aria-label', `${n} people with ${state.paths} communication paths finish in ${fmt(state.t, 1)} months; the best team size is ${state.best}.`);
  host.textContent = '';
  host.append(svg);
}
