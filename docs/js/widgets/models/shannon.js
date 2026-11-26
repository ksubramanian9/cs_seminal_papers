/*
 * Shannon's information theory for the slider widget (CS008).
 *
 * Four symbols with adjustable weights (turned into probabilities) show three of Shannon's results:
 *   - entropy H = -sum p log2 p: the fewest bits per symbol any code can average;
 *   - the source coding theorem: a good code (Huffman's) gets within one bit of H;
 *   - channel capacity: a channel that flips each bit with probability f carries at most 1 - H2(f)
 *     bits per use, however cleverly it is coded.
 * The functions below are pure (no DOM); render() draws one state.
 */

import { svgEl, linePath, fmt } from '../svg.js';

export const id = 'shannon';

/* ---------- the maths ---------- */
/** Entropy in bits of a probability list (0 log 0 counts as 0). */
export function entropy(p) {
  let h = 0;
  for (const x of p) if (x > 0) h -= x * Math.log2(x);
  return h + 0; // + 0 turns -0 into 0
}

export const binaryEntropy = (f) => (f <= 0 || f >= 1 ? 0 : -f * Math.log2(f) - (1 - f) * Math.log2(1 - f));

/** Capacity in bits per use of a binary symmetric channel that flips each bit with probability f. */
export const channelCapacity = (f) => 1 - binaryEntropy(f);

/** Huffman code lengths for probabilities p (0 for a symbol that never occurs, and for a lone symbol). */
export function huffmanLengths(p) {
  const lengths = p.map(() => 0);
  let nodes = p.map((x, i) => ({ p: x, syms: [i] })).filter((n) => n.p > 0);
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.p - b.p || Math.min(...a.syms) - Math.min(...b.syms)); // deterministic ties
    const [a, b] = nodes;
    for (const s of [...a.syms, ...b.syms]) lengths[s]++;
    nodes = [{ p: a.p + b.p, syms: [...a.syms, ...b.syms] }, ...nodes.slice(2)];
  }
  return lengths;
}

/** Canonical prefix codes (strings of 0 and 1) for the given code lengths; '' for unused symbols. */
export function canonicalCodes(lengths) {
  const order = lengths.map((len, i) => ({ len, i })).filter((x) => x.len > 0).sort((a, b) => a.len - b.len || a.i - b.i);
  const codes = lengths.map(() => '');
  let code = 0, prevLen = 0;
  for (const { len, i } of order) {
    code <<= len - prevLen;
    codes[i] = code.toString(2).padStart(len, '0');
    code++;
    prevLen = len;
  }
  return codes;
}

export const averageLength = (p, lengths) => p.reduce((s, x, i) => s + x * lengths[i], 0);

/** Everything the widget shows, from the slider values (pure). */
export function compute(values, config) {
  const symbols = config.symbols;
  const weights = symbols.map((_, i) => Number(values[`w${i}`]) || 0);
  const total = weights.reduce((a, b) => a + b, 0);
  const f = (Number(values.noise) || 0) / 100;
  const capacity = channelCapacity(f);
  if (total <= 0) {
    return { symbols, weights, total, valid: false, f, capacity, message: 'Give at least one symbol some weight.',
      readouts: [{ label: 'Entropy', value: '—' }, { label: 'Fixed-length code', value: '—' }, { label: 'Huffman code (average)', value: '—' },
        { label: 'Channel capacity', value: `${fmt(capacity, 2)} bits per use`, hint: `a channel that flips ${Math.round(f * 100)}% of bits` }] };
  }
  const p = weights.map((w) => w / total);
  const H = entropy(p);
  const active = p.filter((x) => x > 0).length;
  const fixed = Math.ceil(Math.log2(active));
  const lengths = huffmanLengths(p);
  const codes = canonicalCodes(lengths);
  const avg = averageLength(p, lengths);
  const message = active === 1
    ? 'Only one symbol can occur, so nothing needs to be sent: the entropy is 0.'
    : `A fixed code spends ${fixed} bits on every symbol. The best possible average is ${fmt(H, 2)} bits${avg < fixed - 1e-9 ? `, and Huffman's code gets ${fmt(avg, 2)}` : ''}.`;
  return {
    symbols, weights, total, valid: true, p, H, active, fixed, lengths, codes, avg, f, capacity, message,
    readouts: [
      { label: 'Entropy', value: `${fmt(H, 2)} bits per symbol`, hint: 'the fewest any code can average' },
      { label: 'Fixed-length code', value: `${fixed} bits per symbol` },
      { label: 'Huffman code (average)', value: `${fmt(avg, 2)} bits per symbol`, hint: 'always within one bit of the entropy' },
      { label: 'Channel capacity', value: `${fmt(capacity, 2)} bits per use`, hint: `a channel that flips ${Math.round(f * 100)}% of bits` },
    ],
  };
}

/* ---------- drawing ---------- */
export function render(host, state, config) {
  const W = 400, H = 176;
  const svg = svgEl('svg', { class: 'sl-chart', viewBox: `0 0 ${W} ${H}`, role: 'img' });
  const n = state.symbols.length;

  // Left: one bar per symbol, with its Huffman code underneath.
  const x0 = 14, bw = 40, gap = 14, baseY = 108, topY = 22;
  svg.append(svgEl('text', { class: 'sl-axis', x: x0, y: 12 }, 'Chance of each symbol, and its Huffman code'));
  state.symbols.forEach((s, i) => {
    const x = x0 + i * (bw + gap);
    const pr = state.valid ? state.p[i] : 0;
    const h = pr * (baseY - topY);
    svg.append(svgEl('rect', { class: 'sl-bar', x, y: baseY - h, width: bw, height: Math.max(h, 0), rx: 3 }));
    svg.append(svgEl('text', { class: 'sl-val', x: x + bw / 2, y: baseY - h - 4, 'text-anchor': 'middle' }, state.valid ? `${Math.round(pr * 100)}%` : ''));
    svg.append(svgEl('text', { class: 'sl-sym', x: x + bw / 2, y: baseY + 15, 'text-anchor': 'middle' }, s));
    svg.append(svgEl('text', { class: 'sl-code', x: x + bw / 2, y: baseY + 30, 'text-anchor': 'middle' }, state.valid ? (state.codes[i] || (pr > 0 ? '(none needed)' : '—')) : ''));
  });
  svg.append(svgEl('line', { class: 'sl-axisline', x1: x0 - 4, x2: x0 + n * (bw + gap) - gap + 4, y1: baseY, y2: baseY }));

  // Right: the channel capacity curve, with the current noise level marked.
  const cx = 250, cw = 136, cy = 28, ch = 80;
  svg.append(svgEl('text', { class: 'sl-axis', x: cx, y: 12 }, 'Noisy channel'));
  svg.append(svgEl('rect', { class: 'sl-plot', x: cx, y: cy, width: cw, height: ch }));
  const pts = [];
  for (let i = 0; i <= 50; i++) { const f = (i / 50) * 0.5; pts.push([cx + (f / 0.5) * cw, cy + ch - channelCapacity(f) * ch]); }
  svg.append(svgEl('path', { class: 'sl-curve', d: linePath(pts), fill: 'none' }));
  const mx = cx + (Math.min(state.f, 0.5) / 0.5) * cw, my = cy + ch - state.capacity * ch;
  svg.append(svgEl('circle', { class: 'sl-dot', cx: mx, cy: my, r: 4.5 }));
  svg.append(svgEl('text', { class: 'sl-tick', x: cx, y: cy + ch + 12 }, '0%'));
  svg.append(svgEl('text', { class: 'sl-tick', x: cx + cw, y: cy + ch + 12, 'text-anchor': 'end' }, '50% flipped'));
  svg.append(svgEl('text', { class: 'sl-tick', x: cx - 4, y: cy + 8, 'text-anchor': 'end' }, '1'));
  svg.append(svgEl('text', { class: 'sl-tick', x: cx - 4, y: cy + ch, 'text-anchor': 'end' }, '0'));
  svg.append(svgEl('text', { class: 'sl-axis', x: cx, y: cy + ch + 28 }, 'bits carried per use'));

  const part = state.valid ? `Probabilities ${state.p.map((x, i) => `${state.symbols[i]} ${Math.round(x * 100)}%`).join(', ')}; entropy ${fmt(state.H, 2)} bits.` : 'No symbol has any weight.';
  svg.setAttribute('aria-label', `${part} Channel capacity ${fmt(state.capacity, 2)} bits per use when ${Math.round(state.f * 100)}% of bits flip.`);
  host.textContent = '';
  host.append(svg);
}
