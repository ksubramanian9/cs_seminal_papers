/*
 * Quicksort model for the stepper widget (Hoare, CS016).
 *
 * sortFrames() is a pure function: it runs Hoare's two-pointer partition scheme and records every
 * visible moment: a range is chosen, the two pointers stop, a swap happens, the pointers cross and
 * the range splits in two. Elements are tracked by identity (id), so equal values are never confused.
 *
 * Partition of A[lo..hi] with pivot value p = A[lo]: pointer i moves right past values smaller than p,
 * pointer j moves left past values larger than p; when both have stopped and i < j the two values
 * swap; when the pointers meet or cross, everything at or left of j is <= p and everything right of
 * j is >= p, so each side can be sorted on its own.
 */

const NS = 'http://www.w3.org/2000/svg';

export const id = 'quicksort';

/**
 * Frame: { step, items: [{ v, id }], range: [lo, hi] | null, pivot: id | null, i, j (indices | null),
 *          swapped: [a, b] | null, done: [ids settled in place], note }.
 */
export function sortFrames(values) {
  const items = values.map((v, k) => ({ v, id: k }));
  const done = new Set();
  const frames = [];
  const snap = (range, pivot, i, j, swapped, note) => frames.push({
    step: frames.length, items: items.map((x) => ({ ...x })), range: range && [...range], pivot,
    i, j, swapped: swapped && [...swapped], done: [...done], note,
  });

  snap(null, null, null, null, null,
    `Start with ${items.length} numbers. Quicksort picks a pivot, splits the numbers into “smaller” and “larger” around it, then sorts each part the same way.`);

  function settleIfSingle(lo, hi) { if (lo === hi) done.add(items[lo].id); }

  function sort(lo, hi) {
    if (lo >= hi) { settleIfSingle(lo, hi); return; }
    const pivotItem = items[lo];
    const p = pivotItem.v;
    snap([lo, hi], pivotItem.id, null, null, null,
      `Sort positions ${lo + 1} to ${hi + 1}. The pivot is the first number in this range, ${p}.`);
    let i = lo - 1, j = hi + 1;
    for (;;) {
      do j--; while (items[j].v > p);
      do i++; while (items[i].v < p);
      if (i < j) {
        snap([lo, hi], pivotItem.id, i, j, null,
          `The pointers stop: i at ${items[i].v}, which is not smaller than ${p}, and j at ${items[j].v}, which is not larger than ${p}. They are on the wrong sides, so swap them.`);
        [items[i], items[j]] = [items[j], items[i]];
        snap([lo, hi], pivotItem.id, i, j, [i, j], `Swapped. The smaller number is now on the left and the larger on the right.`);
      } else {
        const leftSize = j - lo + 1, rightSize = hi - j;
        // A side with one number left is in its final place.
        if (lo === j) done.add(items[lo].id);
        if (j + 1 === hi) done.add(items[hi].id);
        snap([lo, hi], pivotItem.id, i, j, null,
          `The pointers have ${i === j ? 'met' : 'crossed'}. Everything up to position ${j + 1} is at most ${p} and everything after it is at least ${p}. ` +
          `Now sort the left part (${leftSize} ${leftSize === 1 ? 'number' : 'numbers'}) and the right part (${rightSize} ${rightSize === 1 ? 'number' : 'numbers'}) on their own.`);
        sort(lo, j);
        sort(j + 1, hi);
        return;
      }
    }
  }
  sort(0, items.length - 1);

  snap(null, null, null, null, null, `Sorted: ${items.map((x) => x.v).join(', ')}. Every number has been settled by the splits.`);
  return { frames, sorted: items.map((x) => x.v), input: [...values] };
}

/* ---------- stepper interface ---------- */
const MIN_N = 2;

export function inputs(config) {
  return [{
    id: 'list', label: 'Numbers to sort', value: config.input ?? '5 2 9 1 7 3 8 6',
    maxLength: 40, hint: `${MIN_N} to ${config.maxCount ?? 10} whole numbers from 0 to ${config.maxValue ?? 99}, separated by spaces`,
  }];
}

function parseList(text) {
  return String(text ?? '').trim().split(/[\s,]+/).filter(Boolean);
}

export function validate(values, config) {
  const max = config.maxCount ?? 10, maxVal = config.maxValue ?? 99;
  const parts = parseList(values.list);
  if (parts.length < MIN_N) return `Enter at least ${MIN_N} numbers, for example 5 2 9 1.`;
  if (parts.length > max) return `Use at most ${max} numbers.`;
  for (const p of parts) {
    if (!/^\d{1,2}$/.test(p) || Number(p) > maxVal) return `“${p.length > 8 ? p.slice(0, 8) + '…' : p}” is not a whole number from 0 to ${maxVal}.`;
  }
  return null;
}

export function build(config, values) {
  const nums = parseList(values.list ?? config.input).map(Number);
  return { ...sortFrames(nums), config };
}

const svgEl = (tag, attrs = {}, text) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};

export function render(host, built, frame) {
  const n = frame.items.length;
  const W = 400, H = 170, top = 18, base = 130;
  const slot = (W - 8) / n;
  const bw = Math.min(34, slot - 6);
  const maxV = Math.max(...frame.items.map((x) => x.v), 1);
  const svg = svgEl('svg', { class: 'qs-chart', viewBox: `0 0 ${W} ${H}`, role: 'img' });

  if (frame.range) {
    const [lo, hi] = frame.range;
    svg.append(svgEl('rect', { class: 'qs-range', x: 4 + lo * slot, y: 4, width: (hi - lo + 1) * slot, height: base + 14, rx: 6 }));
  }
  frame.items.forEach((it, k) => {
    const h = 6 + ((base - top - 6) * it.v) / maxV;
    const cx = 4 + k * slot + slot / 2;
    const cls = ['qs-bar'];
    if (frame.done.includes(it.id)) cls.push('done');
    if (frame.pivot === it.id) cls.push('pivot');
    if (frame.swapped && frame.swapped.includes(k)) cls.push('swapped');
    if (frame.range && (k < frame.range[0] || k > frame.range[1])) cls.push('out');
    svg.append(svgEl('rect', { class: cls.join(' '), x: cx - bw / 2, y: base - h, width: bw, height: h, rx: 3 }));
    svg.append(svgEl('text', { class: 'qs-val', x: cx, y: base - h - 4, 'text-anchor': 'middle' }, String(it.v)));
  });
  const pointer = (k, label) => {
    if (k == null || k < 0 || k >= n) return;
    const cx = 4 + k * slot + slot / 2;
    svg.append(svgEl('path', { class: `qs-ptr ${label}`, d: `M${cx - 6},${base + 20} L${cx + 6},${base + 20} L${cx},${base + 9} Z` }));
    svg.append(svgEl('text', { class: `qs-ptr-label ${label}`, x: cx, y: base + 33, 'text-anchor': 'middle' }, label));
  };
  if (frame.i != null && frame.j != null && frame.i === frame.j) {
    const cx = 4 + frame.i * slot + slot / 2;
    svg.append(svgEl('path', { class: 'qs-ptr i', d: `M${cx - 6},${base + 20} L${cx + 6},${base + 20} L${cx},${base + 9} Z` }));
    svg.append(svgEl('text', { class: 'qs-ptr-label i', x: cx, y: base + 33, 'text-anchor': 'middle' }, 'i = j'));
  } else {
    pointer(frame.i, 'i');
    pointer(frame.j, 'j');
  }
  svg.setAttribute('aria-label',
    `Bars for the numbers ${frame.items.map((x) => x.v).join(', ')}.` +
    (frame.range ? ` Sorting positions ${frame.range[0] + 1} to ${frame.range[1] + 1}.` : '') +
    (frame.pivot != null ? ` Pivot ${frame.items.find((x) => x.id === frame.pivot).v}.` : ''));

  // The colours are explained in words as well, so they are not the only carrier of meaning.
  const legend = document.createElement('p');
  legend.className = 'qs-legend';
  for (const [cls, text] of [['pivot', 'pivot'], ['swapped', 'just swapped'], ['done', 'in its final place']]) {
    const key = document.createElement('span');
    key.className = `qs-key ${cls}`;
    key.textContent = text;
    legend.append(key);
  }
  host.textContent = '';
  host.append(svg, legend);
}
