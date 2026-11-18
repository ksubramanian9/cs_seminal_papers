/*
 * Data loader. All app data lives in data/*.json (see spec.md section 4).
 *
 * papers.json        [ { id, year, title, authors, primary_field, conceptual_impact_1_3,
 *                        practice_impact_1_3, fields[], tags[], source_url, ...CSV columns } ]
 * explanations.json  { CSxxx: { problem, insight, analogy, unlocked, left_open,
 *                               diagram, widget?, review? } }
 * edges.json         [ { id, from, to, type, why, evidence } ]
 *                    type: builds_on | generalizes | overcomes_limit | new_domain | rival
 *                    evidence: explicit | interpretive
 * ghosts.json        [ { id: "G001", year, title, lane, blurb } ]
 * eras.json          [ { id, label, start, end, question, summary } ]
 * lanes.json         [ { id, label, color } ]   (array order = top-to-bottom lane order)
 */

export const EDGE_TYPES = ['builds_on', 'generalizes', 'overcomes_limit', 'new_domain', 'rival'];
export const EVIDENCE = ['explicit', 'interpretive'];

const FILES = {
  papers: { path: 'data/papers.json', shape: 'array' },
  explanations: { path: 'data/explanations.json', shape: 'object' },
  edges: { path: 'data/edges.json', shape: 'array' },
  ghosts: { path: 'data/ghosts.json', shape: 'array' },
  eras: { path: 'data/eras.json', shape: 'array' },
  lanes: { path: 'data/lanes.json', shape: 'array' },
};

export class DataError extends Error {
  constructor(file, message) {
    super(`${file}: ${message}`);
    this.name = 'DataError';
    this.file = file;
  }
}

async function loadOne(key, { path, shape }) {
  let res;
  try {
    // Resolve against this module (js/), not the page, so any page (index.html, tests/*) works.
    res = await fetch(new URL(`../${path}`, import.meta.url), { cache: 'no-cache' });
  } catch (e) {
    throw new DataError(path, `could not be fetched (${e.message}). Is the app being served by Live Server?`);
  }
  if (!res.ok) throw new DataError(path, `HTTP ${res.status}`);
  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new DataError(path, `is not valid JSON (${e.message})`);
  }
  const isArr = Array.isArray(json);
  if (shape === 'array' && !isArr) throw new DataError(path, 'expected a JSON array');
  if (shape === 'object' && (isArr || json === null || typeof json !== 'object')) {
    throw new DataError(path, 'expected a JSON object');
  }
  return json;
}

/** Load every data file in parallel. Rejects with a DataError naming the first bad file. */
export async function loadAll() {
  const keys = Object.keys(FILES);
  const results = await Promise.all(keys.map((k) => loadOne(k, FILES[k])));
  return Object.fromEntries(keys.map((k, i) => [k, results[i]]));
}
