/*
 * Turing machine model for the stepper widget.
 *
 * run() is a pure simulation (no DOM): it returns every frame of the computation, so the stepper
 * can go forwards and backwards. render() draws one frame. The machine is described entirely by
 * the config (widgets/turing.json): a rule table of (state, read) -> (write, move, next state).
 */

const NS = 'http://www.w3.org/2000/svg';
const MIN_CELLS = 9;

export const id = 'turing';

const showSym = (s, blank) => (s === blank ? 'a blank' : s);
const moveWord = (m) => (m === 'L' ? 'left' : m === 'R' ? 'right' : 'stay put');

/** The text inputs the stepper should offer. */
export function inputs(config) {
  return [{
    id: 'tape', label: 'Binary number on the tape', value: config.input ?? '1011',
    maxLength: config.maxDigits ?? 8, hint: `digits 0 and 1, up to ${config.maxDigits ?? 8}`,
  }];
}

/** Returns an error message, or null if the values are acceptable. */
export function validate(values, config) {
  const t = String(values.tape ?? '').trim();
  const max = config.maxDigits ?? 8;
  if (!t) return 'Enter a binary number, for example 1011.';
  if (!/^[01]+$/.test(t)) return 'Use only the digits 0 and 1.';
  if (t.length > max) return `Use at most ${max} digits.`;
  return null;
}

function describe(rule, sym, blank) {
  return `In state “${rule.state}” reading ${showSym(sym, blank)}: write ${showSym(rule.write, blank)}, ` +
    `move ${moveWord(rule.move)}, go to state “${rule.next}”.`;
}

function fillTemplate(tpl, input, out) {
  return tpl
    .replace('{input}', input).replace('{out}', out)
    .replace('{inDec}', String(parseInt(input, 2))).replace('{outDec}', String(parseInt(out, 2)));
}

/**
 * Run the machine on `input` (a string of tape symbols), the head starting on the rightmost symbol.
 * Returns { frames, lo, hi, halted, stuck, truncated, output, input }.
 * Each frame: { step, state, head, tape (Map index->symbol), rule (index or null), note }.
 */
export function run(config, input) {
  const blank = config.blank ?? '_';
  const rules = config.rules;
  const halt = new Set(config.haltStates ?? []);
  const maxSteps = config.maxSteps ?? 200;

  const tape = new Map();
  [...input].forEach((ch, i) => tape.set(i, ch));
  let head = input.length - 1;
  let state = config.initialState;

  const frames = [{
    step: 0, state, head, tape: new Map(tape), rule: null,
    note: `Start in state “${state}” with the head on the rightmost digit.`,
  }];
  let halted = false, stuck = false, truncated = false;

  for (let n = 1; ; n++) {
    if (halt.has(state)) { halted = true; break; }
    if (n > maxSteps) { truncated = true; break; }
    const sym = tape.get(head) ?? blank;
    const ri = rules.findIndex((r) => r.state === state && r.read === sym);
    if (ri === -1) { stuck = true; break; }
    const r = rules[ri];
    tape.set(head, r.write);
    head += r.move === 'L' ? -1 : r.move === 'R' ? 1 : 0;
    state = r.next;
    frames.push({ step: n, state, head, tape: new Map(tape), rule: ri, note: describe(r, sym, blank) });
  }

  // Result: the non-blank symbols in order along the tape.
  const keys = [...tape.keys()].sort((a, b) => a - b);
  const output = keys.map((k) => tape.get(k)).join('').replace(new RegExp(`^${blank}+|${blank}+$`, 'g'), '');

  const last = frames[frames.length - 1];
  if (halted) last.note += ' ' + (config.resultTemplate ? fillTemplate(config.resultTemplate, input, output) : `Halted. The tape reads ${output}.`);
  else if (stuck) last.note += ' No rule applies in this state, so the machine stops without halting properly.';
  else if (truncated) last.note += ` Stopped after ${maxSteps} steps without halting.`;

  // A fixed window showing every cell that is ever visited or written, so the tape does not jump.
  let lo = 0, hi = input.length - 1;
  for (const f of frames) {
    lo = Math.min(lo, f.head, ...f.tape.keys());
    hi = Math.max(hi, f.head, ...f.tape.keys());
  }
  lo -= 1; hi += 1;
  for (let flip = 0; hi - lo + 1 < MIN_CELLS; flip++) { if (flip % 2 === 0) hi++; else lo--; }

  return { frames, lo, hi, halted, stuck, truncated, output, input };
}

/** Build everything the stepper needs from the config and the input values. */
export function build(config, values) {
  const built = run(config, String(values.tape ?? config.input).trim());
  return { ...built, config };
}

const svgEl = (tag, attrs = {}, text) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};

/** Draw one frame into `host`: the tape with its head, then the rule table with the applied rule highlighted. */
export function render(host, built, frame) {
  const { lo, hi, config } = built;
  const blank = config.blank ?? '_';
  const count = hi - lo + 1;
  const W = Math.min(36, Math.floor(372 / count));
  const width = count * W + 4;

  const svg = svgEl('svg', { class: 'tm-tape', viewBox: `0 0 ${width} 84`, role: 'img' });
  const tapeText = [];
  for (let i = lo; i <= hi; i++) {
    const sym = frame.tape.get(i) ?? blank;
    tapeText.push(sym === blank ? 'blank' : sym);
    const x = 2 + (i - lo) * W;
    const isHead = i === frame.head;
    svg.append(svgEl('rect', { class: `tm-cell${isHead ? ' head' : ''}`, x, y: 8, width: W, height: 34, rx: 3 }));
    svg.append(svgEl('text', { class: `tm-sym${sym === blank ? ' blank' : ''}`, x: x + W / 2, y: 31, 'text-anchor': 'middle' }, sym === blank ? '·' : sym));
  }
  const hx = 2 + (frame.head - lo) * W + W / 2;
  svg.append(svgEl('path', { class: 'tm-head', d: `M${hx - 8},58 L${hx + 8},58 L${hx},46 Z` }));
  svg.append(svgEl('text', { class: 'tm-state', x: hx, y: 76, 'text-anchor': 'middle' }, `state: ${frame.state}`));
  svg.setAttribute('aria-label', `Tape: ${tapeText.join(' ')}. Head on cell ${frame.head - lo + 1}. State ${frame.state}.`);

  const table = document.createElement('table');
  table.className = 'tm-rules';
  const head = table.createTHead().insertRow();
  for (const h of ['state', 'read', 'write', 'move', 'next']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = h;
    head.append(th);
  }
  const body = table.createTBody();
  config.rules.forEach((r, i) => {
    const tr = body.insertRow();
    if (frame.rule === i) tr.className = 'active';
    for (const v of [r.state, r.read === blank ? '·' : r.read, r.write === blank ? '·' : r.write, moveWord(r.move), r.next]) {
      tr.insertCell().textContent = v;
    }
  });

  host.textContent = '';
  host.append(svg, table);
}
