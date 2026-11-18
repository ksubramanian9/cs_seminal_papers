/*
 * Pure graph traversal over edges ({ from, to, type }), where `from` is the earlier work.
 * `rival` edges are not lineage, so by default they are ignored when walking ancestry.
 */

export function buildIndex(edges, { includeRival = false } = {}) {
  const parents = new Map(); // id -> ids it builds on
  const children = new Map(); // id -> ids that build on it
  const add = (m, k, v) => {
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(v);
  };
  for (const e of edges) {
    if (!includeRival && e.type === 'rival') continue;
    add(parents, e.to, e.from);
    add(children, e.from, e.to);
  }
  return { parents, children };
}

function walk(adj, start) {
  const seen = new Set();
  const stack = [...(adj.get(start) || [])];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue; // also protects against cycles
    seen.add(id);
    for (const next of adj.get(id) || []) if (!seen.has(next)) stack.push(next);
  }
  seen.delete(start);
  return seen;
}

/** Everything that (transitively) led to `id`. */
export const ancestors = (index, id) => walk(index.parents, id);

/** Everything that (transitively) came from `id`. */
export const descendants = (index, id) => walk(index.children, id);

/** Rival neighbours of `id` (direct only), from the raw edge list. */
export function rivals(edges, id) {
  const out = new Set();
  for (const e of edges) {
    if (e.type !== 'rival') continue;
    if (e.from === id) out.add(e.to);
    else if (e.to === id) out.add(e.from);
  }
  return out;
}
