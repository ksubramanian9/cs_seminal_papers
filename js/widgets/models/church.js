/*
 * Lambda-calculus model for the stepper widget (Church, CS003).
 *
 * reduce() is a pure program (no DOM): it parses an expression, then reduces it in normal order
 * (always the leftmost, outermost step, also inside function bodies) and returns every frame.
 * Two kinds of step happen: "unfold" (a defined name such as ADD, or a digit, is replaced by its
 * definition when it is about to be applied) and "apply" (beta reduction: the argument replaces
 * the function's variable in the body). Normal order is the strategy that reaches an answer
 * whenever there is one.
 *
 * The text typed in is only ever tokenised by this file's own parser; nothing is evaluated and
 * nothing typed reaches the page as markup.
 */

export const id = 'church';

/* ---------- terms ---------- */
// { k:'var', n } | { k:'abs', v, b } | { k:'app', f, a } | { k:'const', n }
const V = (n) => ({ k: 'var', n });
const L = (v, b) => ({ k: 'abs', v, b });
const A = (f, a) => ({ k: 'app', f, a });
const C = (n) => ({ k: 'const', n });

/* ---------- parser ---------- */
const ALLOWED = /^[A-Za-z0-9λ\\.\s()]*$/;

function tokenize(src) {
  const toks = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === 'λ' || ch === '\\') { toks.push({ t: 'lam' }); i++; continue; }
    if (ch === '.') { toks.push({ t: 'dot' }); i++; continue; }
    if (ch === '(') { toks.push({ t: 'open' }); i++; continue; }
    if (ch === ')') { toks.push({ t: 'close' }); i++; continue; }
    if (/[a-z]/.test(ch)) { toks.push({ t: 'var', n: ch }); i++; continue; }
    if (/[0-9]/.test(ch)) {
      if (/[0-9]/.test(src[i + 1] ?? '')) throw new Error('Numerals go from 0 to 9, one digit each.');
      toks.push({ t: 'num', n: ch }); i++; continue;
    }
    if (/[A-Z]/.test(ch)) {
      let j = i;
      while (j < src.length && /[A-Z]/.test(src[j])) j++;
      toks.push({ t: 'name', n: src.slice(i, j) });
      i = j;
      continue;
    }
    throw new Error(`The character “${ch}” is not allowed here.`);
  }
  return toks;
}

/** Parse source text into a term. `known(name)` says whether an uppercase name is defined. */
export function parse(src, known) {
  if (!ALLOWED.test(src)) throw new Error('Use only letters, digits, \\ or λ, dots, spaces and parentheses.');
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const startsAtom = (t) => t && (t.t === 'var' || t.t === 'num' || t.t === 'name' || t.t === 'open' || t.t === 'lam');

  function parseExpr() {
    const t = peek();
    if (!t) throw new Error('The expression ends too soon.');
    if (t.t === 'lam') return parseLambda();
    let left = parseAtom();
    while (startsAtom(peek())) {
      left = A(left, peek().t === 'lam' ? parseLambda() : parseAtom());
    }
    return left;
  }
  function parseLambda() {
    p++; // lam
    const vars = [];
    while (peek() && peek().t === 'var') { vars.push(peek().n); p++; }
    if (!vars.length) throw new Error('A λ must be followed by a variable letter, as in λx.x');
    if (!peek() || peek().t !== 'dot') throw new Error('Put a dot after the variable(s), as in λx.x');
    p++; // dot
    let body = parseExpr();
    for (let i = vars.length - 1; i >= 0; i--) body = L(vars[i], body);
    return body;
  }
  function parseAtom() {
    const t = peek();
    if (!t) throw new Error('The expression ends too soon.');
    if (t.t === 'var') { p++; return V(t.n); }
    if (t.t === 'num') { p++; return C(t.n); }
    if (t.t === 'name') {
      if (!known(t.n)) throw new Error(`“${t.n}” is not a known name.`);
      p++;
      return C(t.n);
    }
    if (t.t === 'open') {
      p++;
      const e = parseExpr();
      if (!peek() || peek().t !== 'close') throw new Error('A parenthesis is not closed.');
      p++;
      return e;
    }
    if (t.t === 'close') throw new Error('There is a closing parenthesis with no opening one.');
    throw new Error('Something is missing before this point.');
  }

  if (!toks.length) throw new Error('Type an expression, for example ADD 2 3.');
  const term = parseExpr();
  if (p < toks.length) throw new Error(peek().t === 'close' ? 'There is a closing parenthesis with no opening one.' : 'The expression could not be read.');
  return term;
}

/* ---------- operations on terms ---------- */
function freeVars(t, acc = new Set()) {
  if (t.k === 'var') acc.add(t.n);
  else if (t.k === 'app') { freeVars(t.f, acc); freeVars(t.a, acc); }
  else if (t.k === 'abs') {
    const inner = freeVars(t.b, new Set());
    inner.delete(t.v);
    for (const x of inner) acc.add(x);
  }
  return acc;
}

function allNames(t, acc = new Set()) {
  if (t.k === 'var') acc.add(t.n);
  else if (t.k === 'app') { allNames(t.f, acc); allNames(t.a, acc); }
  else if (t.k === 'abs') { acc.add(t.v); allNames(t.b, acc); }
  return acc;
}

/** A deep copy. Every place a term is inserted gets its own copy, so highlighting and replacing by identity stays exact. */
function clone(t) {
  if (t.k === 'app') return A(clone(t.f), clone(t.a));
  if (t.k === 'abs') return L(t.v, clone(t.b));
  return { ...t };
}

/** Substitute s for the free occurrences of x in t, renaming binders to avoid capturing s's free variables. */
function subst(t, x, s, state) {
  if (t.k === 'var') return t.n === x ? clone(s) : t;
  if (t.k === 'const') return t;
  if (t.k === 'app') return A(subst(t.f, x, s, state), subst(t.a, x, s, state));
  // abstraction
  if (t.v === x) return t; // x is shadowed
  if (!state.sFree) state.sFree = freeVars(s);
  if (state.sFree.has(t.v)) {
    // rename the bound variable to something not used anywhere in t or s
    const used = new Set([...allNames(t.b), ...state.sFree, x]);
    let nv = t.v + "'";
    while (used.has(nv)) nv += "'";
    state.renamed = true;
    return L(nv, subst(subst(t.b, t.v, V(nv), {}), x, s, state));
  }
  return L(t.v, subst(t.b, x, s, state));
}

/** The leftmost-outermost step: { kind:'apply'|'unfold', node } or null. */
function findRedex(t) {
  if (t.k === 'app') {
    if (t.f.k === 'abs') return { kind: 'apply', node: t };
    if (t.f.k === 'const') return { kind: 'unfold', node: t.f };
    return findRedex(t.f) || findRedex(t.a);
  }
  if (t.k === 'abs') return findRedex(t.b);
  return null;
}

/** Rebuild t with `target` replaced by `repl` (identity comparison). */
function replaceNode(t, target, repl) {
  if (t === target) return repl;
  if (t.k === 'app') {
    const f = replaceNode(t.f, target, repl);
    const a = f !== t.f ? t.a : replaceNode(t.a, target, repl);
    return f === t.f && a === t.a ? t : A(f, a);
  }
  if (t.k === 'abs') {
    const b = replaceNode(t.b, target, repl);
    return b === t.b ? t : L(t.v, b);
  }
  return t;
}

const size = (t) => (t.k === 'app' ? 1 + size(t.f) + size(t.a) : t.k === 'abs' ? 1 + size(t.b) : 1);

/* ---------- printing ---------- */
/** Segments [{ t:text, hl:boolean }] for a term, the node `mark` (if any) flagged as highlighted. */
export function segments(term, mark) {
  const out = [];
  let hl = 0;
  const push = (t) => out.push({ t, hl: hl > 0 });
  function go(t, ctx) { // ctx: 0 = free standing, 1 = function position, 2 = argument position
    const isMark = t === mark;
    if (isMark) hl++;
    if (t.k === 'var' || t.k === 'const') push(t.n);
    else if (t.k === 'abs') {
      const paren = ctx !== 0;
      if (paren) out.push({ t: '(', hl: false });
      push(`λ${t.v}.`);
      go(t.b, 0);
      if (paren) out.push({ t: ')', hl: false });
    } else {
      const paren = ctx === 2;
      if (paren) out.push({ t: '(', hl: false });
      go(t.f, 1);
      push(' ');
      go(t.a, 2);
      if (paren) out.push({ t: ')', hl: false });
    }
    if (isMark) hl--;
  }
  go(term, 0);
  return out;
}

export const show = (term) => segments(term).map((s) => s.t).join('');

/** If the term is the Church numeral n (λf.λx. f (f (… x))), return n; otherwise null. */
export function numeralValue(t) {
  if (t.k !== 'abs' || t.b.k !== 'abs') return null;
  const f = t.v, x = t.b.v;
  if (f === x) return null;
  let n = 0, cur = t.b.b;
  while (cur.k === 'app' && cur.f.k === 'var' && cur.f.n === f) { n++; cur = cur.a; }
  return cur.k === 'var' && cur.n === x ? n : null;
}

/* ---------- definitions ---------- */
function numeralTerm(n) {
  let body = V('x');
  for (let i = 0; i < n; i++) body = A(V('f'), body);
  return L('f', L('x', body));
}

/** Prepare the table of definitions from the config: name -> { term, text, gloss }. Digits are added. */
export function makeDefinitions(config) {
  const defs = new Map();
  for (let d = 0; d <= 9; d++) {
    const t = numeralTerm(d);
    defs.set(String(d), { term: t, text: show(t), gloss: d === 0 ? 'apply f no times' : d === 1 ? 'apply f once' : `apply f ${d} times` });
  }
  for (const [name, spec] of Object.entries(config.definitions || {})) {
    const src = typeof spec === 'string' ? spec : spec.source;
    const t = parse(src, () => false);
    defs.set(name, { term: t, text: show(t), gloss: typeof spec === 'string' ? '' : spec.gloss || '' });
  }
  return defs;
}

const clip = (s, n = 34) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

/**
 * Reduce `input` (source text). Returns { frames, normal, loop, truncated, truncatedBy, numeral, defs }.
 * Each frame: { step, term, mark, segs, note } where `mark` is the next step's node and `segs`
 * the printable pieces with that step highlighted.
 */
export function reduce(config, input) {
  const defs = makeDefinitions(config);
  const maxSteps = config.maxSteps ?? 150;
  const maxSize = config.maxSize ?? 500;
  let term = parse(input, (n) => defs.has(n));

  const frames = [];
  const seen = new Set();
  let note = 'The starting expression. The highlighted part is what gets reduced next.';
  let normal = false, loop = false, truncated = false, truncatedBy = null;

  for (let step = 0; ; step++) {
    const redex = findRedex(term);
    const segs = segments(term, redex && redex.node);
    frames.push({ step, term, mark: redex && redex.node, segs, note });
    if (!redex) { normal = true; break; }
    const text = segs.map((s) => s.t).join('');
    if (seen.has(text)) { loop = true; break; }
    seen.add(text);
    if (step >= maxSteps) { truncated = true; truncatedBy = 'steps'; break; }

    if (redex.kind === 'unfold') {
      const def = defs.get(redex.node.n);
      term = replaceNode(term, redex.node, clone(def.term));
      note = `Unfold ${redex.node.n}: it is about to be applied, so the name is replaced by its definition, ${clip(def.text, 60)}.`;
    } else {
      const app = redex.node;
      const state = {};
      const reduced = subst(app.f.b, app.f.v, app.a, state);
      term = replaceNode(term, app, reduced);
      note = `Apply the function to its argument: replace ${app.f.v} with ${clip(show(app.a))} in the body.` +
        (state.renamed ? ' A bound variable was renamed so it would not clash with a variable in the argument.' : '');
    }
    if (size(term) > maxSize) {
      const segs2 = segments(term, null);
      frames.push({ step: step + 1, term, mark: null, segs: segs2, note });
      truncated = true; truncatedBy = 'size';
      break;
    }
  }

  const last = frames[frames.length - 1];
  const numeral = normal ? numeralValue(last.term) : null;
  if (normal) {
    last.note += ' Nothing is left to reduce, so this is the answer (the normal form).' +
      (numeral != null ? ` It is the numeral ${numeral}: f applied ${numeral} ${numeral === 1 ? 'time' : 'times'} to x.` : '');
  } else if (loop) {
    last.note += ' This expression has reduced to a copy of itself, so it will never finish. Some expressions have no answer, and Church proved that no general method can tell in advance which.';
  } else if (truncatedBy === 'size') {
    last.note += ' The expression has grown too large for this demo, so it stops here. It may be growing without end.';
  } else if (truncated) {
    last.note += ` Stopped after ${maxSteps} steps. Either this never finishes, or it needs more steps than this demo allows.`;
  }
  return { frames, normal, loop, truncated, truncatedBy, numeral, defs, input };
}

/* ---------- stepper interface ---------- */
export function inputs(config) {
  return [{
    id: 'expr', label: 'Expression', value: config.input ?? 'ADD 2 3',
    maxLength: config.maxLength ?? 40,
    hint: config.hint || 'Try ADD 2 3, MUL 2 3 or SUCC (SUCC 0). Type \\ for λ.',
  }];
}

export function validate(values, config) {
  const src = String(values.expr ?? '');
  if (src.length > (config.maxLength ?? 40)) return `Use at most ${config.maxLength ?? 40} characters.`;
  try {
    const defs = makeDefinitions(config);
    parse(src, (n) => defs.has(n));
  } catch (e) {
    return e.message;
  }
  return null;
}

export function build(config, values) {
  return { ...reduce(config, String(values.expr ?? config.input)), config };
}

export function render(host, built, frame) {
  const term = document.createElement('p');
  term.className = 'lc-term';
  term.setAttribute('aria-label', `Expression: ${frame.segs.map((s) => s.t).join('')}`);
  for (const s of frame.segs) {
    const span = document.createElement('span');
    if (s.hl) span.className = 'lc-redex';
    span.textContent = s.t;
    term.append(span);
  }

  const table = document.createElement('table');
  table.className = 'lc-defs';
  const head = table.createTHead().insertRow();
  for (const h of ['name', 'meaning', 'definition']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = h;
    head.append(th);
  }
  const body = table.createTBody();
  const named = Object.keys(built.config.definitions || {});
  for (const name of [...named, '0–9']) {
    const tr = body.insertRow();
    const d = name === '0–9' ? null : built.defs.get(name);
    tr.insertCell().textContent = name;
    tr.insertCell().textContent = d ? d.gloss : 'numeral n: apply f n times';
    tr.insertCell().textContent = d ? d.text : 'λf.λx.f (… (f x))';
  }

  host.textContent = '';
  host.append(term, table);
}
