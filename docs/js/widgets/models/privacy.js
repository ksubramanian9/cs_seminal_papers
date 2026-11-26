/*
 * Differential privacy for the slider widget (CS065): the Laplace mechanism on a counting query.
 *
 * A count changes by at most 1 when one person is added or removed. Releasing the count plus noise
 * from a Laplace distribution of scale b = 1/epsilon makes the answer almost as likely with you in
 * the data as without: for every possible answer, the two probabilities differ by a factor of at
 * most e^epsilon. A smaller epsilon means more privacy and more noise. Pure functions plus render().
 */

import { svgEl, linePath, fmt } from '../svg.js';

export const id = 'privacy';

/** Density of the Laplace distribution with centre mu and scale b at x. */
export const laplacePdf = (x, mu, b) => Math.exp(-Math.abs(x - mu) / b) / (2 * b);

/**
 * Natural log of the density. The privacy guarantee is a statement about the ratio of two densities,
 * which underflows to 0/0 far out in the tails; the log difference is exact everywhere.
 */
export const laplaceLogPdf = (x, mu, b) => -Math.abs(x - mu) / b - Math.log(2 * b);

/** Chance that Laplace noise of scale b has size at most k. */
export const withinProbability = (k, b) => 1 - Math.exp(-k / b);

/** Typical (mean absolute) size of Laplace noise of scale b. */
export const typicalError = (b) => b;

/** A Laplace(0, b) sample from a uniform u in (0, 1) (inverse-CDF method). */
export function laplaceSample(u, b) {
  const v = u - 0.5;
  return -b * Math.sign(v) * Math.log(1 - 2 * Math.abs(v));
}

/** A small deterministic generator (mulberry32), so the same clicks give the same draws. */
export function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function compute(values, config, extra) {
  const eps = Number(values.epsilon) || 1;
  const tol = Math.max(1, Number(values.tolerance) || 5);
  const truth = config.trueCount ?? 40;
  const b = 1 / eps;
  // Draws belong to the epsilon they were made with: moving the slider starts a fresh set.
  if (extra.eps !== eps) { extra.eps = eps; extra.draws = []; }
  if (!extra.rng) extra.rng = makeRng(config.seed ?? 20060101);
  const within = withinProbability(tol, b);
  const ratio = Math.exp(eps);
  const message = extra.draws.length
    ? `Last released answer: ${fmt(extra.draws[extra.draws.length - 1], 1)} (the true count is ${truth}).`
    : 'Press “Release a noisy count” to see answers the data holder might publish.';
  return {
    eps, tol, truth, b, within, ratio, draws: extra.draws, message,
    readouts: [
      { label: 'Typical error', value: `±${fmt(b, b < 1 ? 2 : 1)}`, hint: 'average size of the added noise, 1 ÷ ε' },
      { label: `Answer within ±${tol}`, value: `${fmt(within * 100, 0)}%`, hint: 'how often the released count is that close' },
      { label: 'Privacy guarantee', value: `×${ratio < 100 ? fmt(ratio, 2) : Math.round(ratio).toLocaleString('en-US')} at most`, hint: 'how much your being in the data can change the odds of any answer (eᵋ)' },
    ],
  };
}

/** The buttons the model adds beside Reset. */
export const actions = () => [{ id: 'draw', label: 'Release a noisy count' }];

export function act(actionId, values, config, extra) {
  if (actionId !== 'draw') return;
  const eps = Number(values.epsilon) || 1;
  if (extra.eps !== eps) { extra.eps = eps; extra.draws = []; }
  if (!extra.rng) extra.rng = makeRng(config.seed ?? 20060101);
  const truth = config.trueCount ?? 40;
  extra.draws.push(truth + laplaceSample(extra.rng(), 1 / eps));
  if (extra.draws.length > 12) extra.draws.shift();
}

export function render(host, state) {
  const W = 400, H = 190, x0 = 14, x1 = 386, yTop = 14, yBase = 140;
  const svg = svgEl('svg', { class: 'sl-chart', viewBox: `0 0 ${W} ${H}`, role: 'img' });
  const half = Math.max(5, 4 * state.b);
  const lo = state.truth - half, hi = state.truth + half;
  const X = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const peak = laplacePdf(0, 0, state.b);
  const Y = (d) => yBase - (d / peak) * (yBase - yTop);
  const curve = (mu) => { const pts = []; for (let i = 0; i <= 200; i++) { const v = lo + ((hi - lo) * i) / 200; pts.push([X(v), Y(laplacePdf(v, mu, state.b))]); } return pts; };

  svg.append(svgEl('line', { class: 'sl-axisline', x1: x0, x2: x1, y1: yBase, y2: yBase }));
  svg.append(svgEl('path', { class: 'dp-with', d: linePath(curve(state.truth + 1)), fill: 'none' }));
  svg.append(svgEl('path', { class: 'dp-without', d: linePath(curve(state.truth)), fill: 'none' }));
  svg.append(svgEl('line', { class: 'dp-truth', x1: X(state.truth), x2: X(state.truth), y1: yTop, y2: yBase }));
  // the answers released so far, as dots on the axis
  state.draws.forEach((v, i) => {
    if (v >= lo && v <= hi) svg.append(svgEl('circle', { class: `dp-draw${i === state.draws.length - 1 ? ' last' : ''}`, cx: X(v), cy: yBase + 12 + (i % 3) * 7, r: 3 }));
  });
  svg.append(svgEl('text', { class: 'sl-tick', x: X(lo), y: H - 4 }, fmt(lo, 0)));
  svg.append(svgEl('text', { class: 'sl-tick', x: X(hi), y: H - 4, 'text-anchor': 'end' }, fmt(hi, 0)));
  svg.append(svgEl('text', { class: 'sl-tick', x: X(state.truth), y: H - 4, 'text-anchor': 'middle' }, `true count ${state.truth}`));
  svg.append(svgEl('text', { class: 'sl-key without', x: x0, y: 10 }, 'Chance of each released answer without you'));
  svg.append(svgEl('text', { class: 'sl-key with', x: x1, y: 10, 'text-anchor': 'end' }, 'with you in the data'));
  svg.setAttribute('aria-label', `Two nearly overlapping noise curves, one for the data without you and one with you, noise scale ${fmt(state.b, 2)}; at most a factor of ${fmt(state.ratio, 2)} apart.`);
  host.textContent = '';
  host.append(svg);
}
