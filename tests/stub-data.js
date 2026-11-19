/*
 * Stand-in papers for the planned expansion (Tier A of docs/CANDIDATE_ADDITIONS.md, plus Java, TDD
 * and DDD), used only to test how the canvas copes with about 120 papers before any of them is
 * written. They are NOT part of the data. Years and lanes are real; the short labels are
 * placeholders in the style of the real ones; each stub gets two invented links so that degree
 * (which feeds label priority) and edge density are realistic.
 *
 *   const bigger = withStubs(data);   // data from loadAll(); returns a new object, data is untouched
 */

const L = {
  found: 'Foundations and logic', info: 'Information theory', algo: 'Algorithms and complexity',
  pl: 'Programming languages and compilers', os: 'Operating systems and systems', se: 'Software engineering',
  db: 'Databases', net: 'Networks and distributed systems', sec: 'Security and privacy',
  hci: 'HCI and web', ai: 'AI and machine learning',
};

// [year, lane, short label, conceptual impact]
const STUBS = [
  [1959, L.found, 'Finite automata', 2], [1984, L.algo, 'PAC learning', 3], [1985, L.sec, 'Zero-knowledge proofs', 3],
  [1965, L.algo, 'Edmonds: polynomial time', 3], [1949, L.sec, 'Secrecy systems', 3], [1950, L.info, 'Error-correcting codes', 3],
  [1952, L.info, 'Huffman coding', 2], [1977, L.info, 'Lempel-Ziv compression', 3], [1982, L.found, 'Simulating physics', 3],
  [1994, L.algo, 'Shor: factoring', 3],
  [1956, L.ai, 'Logic Theory Machine', 3], [1959, L.ai, 'Samuel: checkers', 2], [1969, L.ai, 'Minsky-Papert: Perceptrons', 3],
  [1982, L.ai, 'Hopfield networks', 3], [1988, L.ai, 'Bayesian networks', 3], [2013, L.ai, 'word2vec', 3],
  [2015, L.ai, 'Deep Q-networks', 3], [2016, L.ai, 'AlphaGo', 3], [2020, L.ai, 'Diffusion models', 3],
  [2020, L.ai, 'Scaling laws', 3], [2022, L.ai, 'InstructGPT and RLHF', 3], [2021, L.ai, 'AlphaFold', 3],
  [1966, L.pl, 'Landin: next 700 languages', 3], [1967, L.pl, 'Floyd: program meaning', 3], [1978, L.pl, 'Hindley-Milner types', 3],
  [1978, L.pl, 'CSP', 3], [1995, L.pl, 'Java', 3],
  [1968, L.se, 'Conway’s law', 2], [2002, L.se, 'Test-driven development', 2], [2003, L.se, 'Domain-driven design', 2],
  [1965, L.os, 'Semaphores', 3], [1984, L.os, 'Trusting trust', 2],
  [1974, L.db, 'SEQUEL (SQL)', 3], [1981, L.db, 'Transaction concept', 3], [1992, L.db, 'ARIES recovery', 3],
  [1964, L.net, 'Packet switching', 3], [1985, L.net, 'FLP impossibility', 3], [1988, L.net, 'Congestion control', 2],
  [1976, L.net, 'Ethernet', 2], [1999, L.net, 'Practical BFT', 3],
  [1960, L.hci, 'Man-computer symbiosis', 2], [1991, L.hci, 'Ubiquitous computing', 2],
];

/** Small deterministic random generator, so the stub data is identical on every run. */
function rng(seed) {
  let s = seed;
  return (n) => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s % n; };
}

export function withStubs(data) {
  const rnd = rng(7);
  const papers = [...data.papers];
  const edges = [...data.edges];
  const real = data.papers;
  STUBS.forEach(([year, lane, short, impact], i) => {
    const id = `ST${String(i + 1).padStart(3, '0')}`;
    papers.push({
      id, year, title: short, authors: 'Stub', primary_field: lane, short,
      conceptual_impact_1_3: impact, practice_impact_1_3: 2, inclusion_tier: 'Established',
      work_type: 'Paper', source_url: '', fields: [lane], tags: [],
    });
    const before = real.filter((p) => p.year < year), after = real.filter((p) => p.year > year);
    if (before.length) edges.push({ id: `S${i}a`, from: before[rnd(before.length)].id, to: id, type: 'builds_on', evidence: 'interpretive', why: 'stub' });
    if (after.length) edges.push({ id: `S${i}b`, from: id, to: after[rnd(after.length)].id, type: 'builds_on', evidence: 'interpretive', why: 'stub' });
  });
  return { ...data, papers, edges };
}

export const STUB_COUNT = STUBS.length;
