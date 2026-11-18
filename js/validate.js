/*
 * Data-integrity rules (spec section 7). Pure functions: no DOM, no fetch, so they can be unit-tested.
 *
 * validateData(data, { strict }) -> [{ id, name, status: 'pass'|'warn'|'fail', problems[], warnings[] }]
 *
 * "Authored" papers are those with an entry in explanations.json. In the default (scoped) mode
 * only authored papers are held to the content rules, so the check stays meaningful while the
 * corpus is written era by era. strict=true (the project's definition of done) requires all of it.
 */

import { EDGE_TYPES, EVIDENCE } from './data.js';

export const WORDS_MIN = 300;      // hard limits for the five explanation sections combined
export const WORDS_MAX = 500;
export const WORDS_TARGET = [350, 450]; // the agreed target; outside it is a warning
export const WHY_MAX_WORDS = 40;
export const SECTION_FIELDS = ['problem', 'insight', 'analogy', 'unlocked', 'left_open'];

export const wordCount = (s) => (String(s ?? '').trim().match(/\S+/g) || []).length;
const isPlaceholder = (e) => /^\[placeholder\]/i.test(e.why || '') || /^P\d+$/.test(e.id || '');

export function validateData(data, { strict = false } = {}) {
  const papers = data.papers || [], ghosts = data.ghosts || [], edges = data.edges || [];
  const explanations = data.explanations || {}, lanes = data.lanes || [], eras = data.eras || [];

  const results = [];
  const add = (id, name, problems = [], warnings = []) =>
    results.push({ id, name, status: problems.length ? 'fail' : warnings.length ? 'warn' : 'pass', problems, warnings });

  const paperIds = new Set(papers.map((p) => p.id));
  const ghostIds = new Set(ghosts.map((g) => g.id));
  const laneIds = new Set(lanes.map((l) => l.id));
  const yearOf = new Map([...papers.map((p) => [p.id, p.year]), ...ghosts.map((g) => [g.id, g.year])]);
  const authored = Object.keys(explanations);

  /* R1 coverage */
  {
    const problems = [], warnings = [];
    const unknown = authored.filter((id) => !paperIds.has(id));
    if (unknown.length) problems.push(`explanations for unknown papers: ${unknown.join(', ')}`);
    const missing = papers.filter((p) => !explanations[p.id]).map((p) => p.id);
    if (missing.length) (strict ? problems : warnings).push(`${missing.length} paper(s) have no explanation yet`);
    add('R1', `Coverage: ${authored.length - unknown.length}/${papers.length} papers have an explanation`, problems, warnings);
  }

  /* R2 explanation content */
  {
    const problems = [], warnings = [];
    for (const id of authored) {
      const ex = explanations[id];
      if (!paperIds.has(id)) continue;
      const empty = SECTION_FIELDS.filter((f) => !String(ex[f] ?? '').trim());
      if (empty.length) problems.push(`${id}: missing section(s) ${empty.join(', ')}`);
      const words = SECTION_FIELDS.reduce((n, f) => n + wordCount(ex[f]), 0);
      if (words < WORDS_MIN || words > WORDS_MAX) problems.push(`${id}: ${words} words (allowed ${WORDS_MIN}-${WORDS_MAX})`);
      else if (words < WORDS_TARGET[0] || words > WORDS_TARGET[1]) warnings.push(`${id}: ${words} words (target ${WORDS_TARGET[0]}-${WORDS_TARGET[1]})`);
      if (!String(ex.diagram ?? '').trim()) problems.push(`${id}: no diagram`);
      if (!String(ex.diagram_alt ?? '').trim()) problems.push(`${id}: no diagram_alt text`);
    }
    add('R2', 'Explanations: all five sections, 300-500 words, diagram with alt text', problems, warnings);
  }

  /* R3 every (authored) paper has at least one edge */
  {
    const touched = new Set();
    for (const e of edges) { touched.add(e.from); touched.add(e.to); }
    const scope = strict ? papers.map((p) => p.id) : authored.filter((id) => paperIds.has(id));
    const lonely = scope.filter((id) => !touched.has(id));
    add('R3', `Connected: every ${strict ? '' : 'authored '}paper has at least one edge`,
      lonely.map((id) => `${id} has no edges`));
  }

  /* R4 edge validity */
  {
    const problems = [], warnings = [];
    const seen = new Set();
    for (const e of edges) {
      const tag = e.id || `${e.from}->${e.to}`;
      if (!e.id) problems.push(`edge ${e.from}->${e.to} has no id`);
      else if (seen.has(e.id)) problems.push(`${tag}: duplicate edge id`);
      seen.add(e.id);
      for (const end of ['from', 'to']) {
        if (!paperIds.has(e[end]) && !ghostIds.has(e[end])) problems.push(`${tag}: unknown ${end} "${e[end]}"`);
      }
      if (e.from === e.to) problems.push(`${tag}: edge from a node to itself`);
      if (!EDGE_TYPES.includes(e.type)) problems.push(`${tag}: invalid type "${e.type}"`);
      if (!EVIDENCE.includes(e.evidence)) problems.push(`${tag}: invalid evidence "${e.evidence}"`);
      const why = String(e.why ?? '').trim();
      if (!why) problems.push(`${tag}: empty "why"`);
      else if (wordCount(why) > WHY_MAX_WORDS) problems.push(`${tag}: "why" is ${wordCount(why)} words (max ${WHY_MAX_WORDS})`);
      if (isPlaceholder(e)) (strict ? problems : warnings).push(`${tag}: placeholder edge not yet replaced`);
    }
    add('R4', 'Edges: valid endpoints, type, evidence, and a one-sentence "why"', problems, warnings);
  }

  /* R5 chronology */
  {
    const problems = [];
    for (const e of edges) {
      const a = yearOf.get(e.from), b = yearOf.get(e.to);
      if (a == null || b == null) continue; // reported by R4
      // Spec section 7 rule 5: from.year <= to.year, except that near-simultaneous rivals
      // (independent solutions published within 2 years of each other) may be recorded either way round.
      const nearSimultaneousRival = e.type === 'rival' && Math.abs(a - b) <= 2;
      if (a > b && !nearSimultaneousRival) {
        problems.push(`${e.id}: ${e.from} (${a}) -> ${e.to} (${b}) goes backwards in time`);
      }
    }
    add('R5', 'Chronology: edges run from earlier to later (near-simultaneous rivals may go either way)', problems);
  }

  /* R6 ghosts are sources only */
  {
    const problems = edges.filter((e) => ghostIds.has(e.to)).map((e) => `${e.id}: ghost ${e.to} is an edge target`);
    add('R6', 'Ghost nodes are only ever the source of an edge', problems);
  }

  /* R8 ids and references */
  {
    const problems = [];
    const dup = (arr, label) => {
      const s = new Set();
      for (const x of arr) { if (s.has(x)) problems.push(`duplicate ${label} id ${x}`); s.add(x); }
    };
    dup(papers.map((p) => p.id), 'paper');
    dup(ghosts.map((g) => g.id), 'ghost');
    dup(lanes.map((l) => l.id), 'lane');
    dup(eras.map((e) => e.id), 'era');
    for (const id of ghostIds) if (paperIds.has(id)) problems.push(`id ${id} is used by both a paper and a ghost`);
    for (const p of papers) if (!laneIds.has(p.primary_field)) problems.push(`${p.id}: unknown lane "${p.primary_field}"`);
    for (const g of ghosts) if (!laneIds.has(g.lane)) problems.push(`${g.id}: unknown lane "${g.lane}"`);
    for (const p of papers) {
      const n = eras.filter((e) => p.year >= e.start && p.year <= e.end).length;
      if (n !== 1) problems.push(`${p.id} (${p.year}) falls in ${n} eras (must be exactly 1)`);
    }
    add('R8', 'References: unique ids, known lanes, every paper in exactly one era', problems);
  }

  /* R9 acyclic (ignoring rival edges) */
  {
    const nodes = new Set([...paperIds, ...ghostIds]);
    const indeg = new Map([...nodes].map((n) => [n, 0]));
    const out = new Map([...nodes].map((n) => [n, []]));
    for (const e of edges) {
      if (e.type === 'rival' || !nodes.has(e.from) || !nodes.has(e.to)) continue;
      out.get(e.from).push(e.to);
      indeg.set(e.to, indeg.get(e.to) + 1);
    }
    const queue = [...nodes].filter((n) => indeg.get(n) === 0);
    let done = 0;
    while (queue.length) {
      const n = queue.pop();
      done++;
      for (const m of out.get(n)) { indeg.set(m, indeg.get(m) - 1); if (indeg.get(m) === 0) queue.push(m); }
    }
    const stuck = [...nodes].filter((n) => indeg.get(n) > 0);
    add('R9', 'No cycles in the lineage (rival edges excluded)', done === nodes.size ? [] : [`cycle involves: ${stuck.join(', ')}`]);
  }

  return results;
}

/** Files the data refers to (diagrams, widget configs), for the page to check exist. */
export function requiredFiles(data) {
  const out = [];
  for (const [id, ex] of Object.entries(data.explanations || {})) {
    if (ex.diagram) out.push({ id, kind: 'diagram', path: ex.diagram });
    if (ex.widget?.config) out.push({ id, kind: 'widget config', path: ex.widget.config });
  }
  return out;
}

/** Summary counts shown on the validator page. */
export function summarize(data) {
  const edges = data.edges || [];
  return {
    papers: (data.papers || []).length,
    authored: Object.keys(data.explanations || {}).length,
    ghosts: (data.ghosts || []).length,
    edges: edges.length,
    explicit: edges.filter((e) => e.evidence === 'explicit').length,
    interpretive: edges.filter((e) => e.evidence === 'interpretive').length,
    placeholders: edges.filter(isPlaceholder).length,
    reviewItems: Object.values(data.explanations || {}).reduce((n, ex) => n + (ex.review?.length || 0), 0),
  };
}
