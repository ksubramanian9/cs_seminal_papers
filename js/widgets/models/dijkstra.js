/*
 * Dijkstra's shortest-path model for the stepper widget (CS013).
 *
 * shortestPaths() is a pure function over a small undirected graph. It returns every frame of the
 * algorithm: pick the unfinished node with the smallest tentative distance, declare it final,
 * then look at each edge leaving it and keep any improvement. The graph, its drawing positions and
 * the default start node all come from the config (widgets/dijkstra.json).
 */

const NS = 'http://www.w3.org/2000/svg';

export const id = 'dijkstra';

const INF = Infinity;
const fmt = (d) => (d === INF ? '∞' : String(d));

/**
 * nodes: [{ id }], edges: [{ a, b, w }] (undirected, w >= 0), source: node id.
 * Frame: { step, dist (object), prev (object), done (array of ids, in the order finalised),
 *          current (id|null), edge ({a,b}|null), improved (id|null), note }.
 * Ties between equal distances go to the node that appears first in `nodes`.
 */
export function shortestPaths(nodes, edges, source) {
  const ids = nodes.map((n) => n.id);
  const dist = Object.fromEntries(ids.map((i) => [i, INF]));
  const prev = Object.fromEntries(ids.map((i) => [i, null]));
  dist[source] = 0;
  const done = [];
  const adj = Object.fromEntries(ids.map((i) => [i, []]));
  for (const e of edges) { adj[e.a].push({ to: e.b, w: e.w }); adj[e.b].push({ to: e.a, w: e.w }); }

  const snap = (step, current, edge, improved, note) => ({
    step, dist: { ...dist }, prev: { ...prev }, done: [...done], current, edge, improved, note,
  });
  const frames = [snap(0, null, null, null,
    `Start: ${source} is at distance 0 and every other node is unknown (∞). The algorithm repeatedly settles the closest unsettled node.`)];

  for (;;) {
    let u = null;
    for (const i of ids) if (!done.includes(i) && dist[i] !== INF && (u === null || dist[i] < dist[u])) u = i;
    if (u === null) break;
    done.push(u);
    frames.push(snap(frames.length, u, null, null,
      `${u} has the smallest tentative distance (${dist[u]}) of the unsettled nodes, so ${u} is settled: no later route can beat it, because every other route is at least as long already.`));
    for (const { to, w } of adj[u]) {
      if (done.includes(to)) continue;
      const alt = dist[u] + w;
      const old = dist[to];
      if (alt < old) {
        dist[to] = alt; prev[to] = u;
        frames.push(snap(frames.length, u, { a: u, b: to }, to,
          `Edge ${u}–${to} (${w}): ${dist[u]} + ${w} = ${alt}, which is shorter than ${fmt(old)}. Update ${to} to ${alt}, reached via ${u}.`));
      } else {
        frames.push(snap(frames.length, u, { a: u, b: to }, null,
          `Edge ${u}–${to} (${w}): ${dist[u]} + ${w} = ${alt}, not shorter than ${fmt(old)}. Keep ${fmt(old)}.`));
      }
    }
  }

  const unreachable = ids.filter((i) => dist[i] === INF);
  const summary = ids.filter((i) => dist[i] !== INF).map((i) => `${i} ${dist[i]}`).join(', ');
  frames.push(snap(frames.length, null, null, null,
    `Done. Shortest distances from ${source}: ${summary}.` +
    (unreachable.length ? ` ${unreachable.join(', ')} cannot be reached.` : '') +
    ' The bold edges show the shortest route to each node.'));
  return { frames, dist: { ...dist }, prev: { ...prev }, order: [...done], source };
}

/** The route from the source to `to` as a list of node ids, or null if unreachable. */
export function pathTo(result, to) {
  if (result.dist[to] === INF) return null;
  const path = [];
  for (let n = to; n !== null; n = result.prev[n]) path.unshift(n);
  return path;
}

/* ---------- stepper interface ---------- */
export function inputs(config) {
  return [{
    id: 'start', label: 'Start node', value: config.source ?? config.nodes[0].id,
    maxLength: 1, hint: `one of ${config.nodes.map((n) => n.id).join(', ')}`,
  }];
}

export function validate(values, config) {
  const s = String(values.start ?? '').trim().toUpperCase();
  if (!s) return 'Enter the letter of a start node.';
  if (!config.nodes.some((n) => n.id === s)) return `Choose one of ${config.nodes.map((n) => n.id).join(', ')}.`;
  return null;
}

export function build(config, values) {
  const source = String(values.start ?? config.source).trim().toUpperCase();
  return { ...shortestPaths(config.nodes, config.edges, source), config };
}

const svgEl = (tag, attrs = {}, text) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};

export function render(host, built, frame) {
  const { config } = built;
  const pos = Object.fromEntries(config.nodes.map((n) => [n.id, n]));
  const isFinal = frame.step === built.frames.length - 1;
  const treeEdge = (e) => frame.prev[e.a] === e.b || frame.prev[e.b] === e.a;
  const svg = svgEl('svg', { class: 'dj-graph', viewBox: '0 0 400 170', role: 'img' });

  for (const e of config.edges) {
    const a = pos[e.a], b = pos[e.b];
    const looking = frame.edge && ((frame.edge.a === e.a && frame.edge.b === e.b) || (frame.edge.a === e.b && frame.edge.b === e.a));
    const cls = ['dj-edge'];
    if (treeEdge(e)) cls.push('tree');
    if (looking) cls.push('look');
    svg.append(svgEl('line', { class: cls.join(' '), x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    svg.append(svgEl('rect', { class: 'dj-wbg', x: mx - 9, y: my - 8, width: 18, height: 15, rx: 3 }));
    svg.append(svgEl('text', { class: `dj-w${looking ? ' look' : ''}`, x: mx, y: my + 4, 'text-anchor': 'middle' }, String(e.w)));
  }
  for (const n of config.nodes) {
    const settled = frame.done.includes(n.id);
    const cls = ['dj-node'];
    if (settled) cls.push('done');
    if (frame.current === n.id) cls.push('current');
    if (frame.improved === n.id) cls.push('improved');
    svg.append(svgEl('circle', { class: cls.join(' '), cx: n.x, cy: n.y, r: 16 }));
    svg.append(svgEl('text', { class: 'dj-label', x: n.x, y: n.y + 5, 'text-anchor': 'middle' }, n.id));
  }
  const dists = config.nodes.map((n) => `${n.id} ${fmt(frame.dist[n.id])}${frame.done.includes(n.id) ? ' settled' : ''}`).join(', ');
  svg.setAttribute('aria-label', `Graph of six towns joined by weighted roads. Distances from ${built.source}: ${dists}.`);

  const frontier = config.nodes
    .filter((n) => !frame.done.includes(n.id) && frame.dist[n.id] !== Infinity)
    .sort((x, y) => frame.dist[x.id] - frame.dist[y.id])
    .map((n) => `${n.id} ${frame.dist[n.id]}`);
  const info = document.createElement('p');
  info.className = 'dj-info';
  info.textContent = isFinal
    ? `Settled in order: ${frame.done.join(', ')}`
    : `Settled: ${frame.done.length ? frame.done.join(', ') : 'none yet'}. Waiting (closest first): ${frontier.length ? frontier.join(', ') : 'none'}.`;

  // Distances sit in a row of chips below the drawing, so they never collide with the edge weights.
  const chips = document.createElement('p');
  chips.className = 'dj-dists';
  for (const n of config.nodes) {
    const chip = document.createElement('span');
    const cls = ['dj-chip'];
    if (frame.done.includes(n.id)) cls.push('done');
    if (frame.improved === n.id) cls.push('improved');
    if (frame.dist[n.id] === Infinity) cls.push('inf');
    chip.className = cls.join(' ');
    const name = document.createElement('b');
    name.textContent = n.id;
    chip.append(name, ` ${fmt(frame.dist[n.id])}`);
    chips.append(chip);
  }

  host.textContent = '';
  host.append(svg, chips, info);
}
