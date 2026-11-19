/*
 * Pure layout logic: no DOM access, so it can be unit-tested (tests/unit.html).
 *
 * World coordinates: x grows with time (piecewise scale), y stacks the lanes top to bottom.
 * Within a lane, nodes whose labels would collide are pushed into separate sub-rows.
 */

export const ROW_H = 22;      // height of one sub-row inside a lane
export const LANE_PAD = 8;    // padding above and below the rows of a lane
export const GUTTER = 130;    // left margin reserved for lane labels (world units)

/**
 * Shared x-axis shape: year segments and their pixel widths. The two early segments are nearly
 * empty (a few ghost nodes and Principia), so they are compressed; the axis shows a break at 1930.
 */
export const X_SEGMENTS = [
  { from: 1850, to: 1908, px: 36 },
  { from: 1908, to: 1930, px: 90 },
  { from: 1930, to: 2026, px: 1632 },
];

/** Node radius from conceptual impact (1-3). */
export const radiusFor = (impact) => (impact >= 3 ? 9 : 6);

/** Rough text width when no real measurer is available (tests, fallbacks). */
export function estimateTextWidth(text, px = 12) {
  return text.length * px * 0.56;
}

/**
 * Piecewise-linear year -> x scale.
 * segments: contiguous [{ from, to, px }]; each maps years [from, to] onto px pixels.
 */
export function makeXScale(segments, origin = 0) {
  if (!segments.length) throw new Error('makeXScale: no segments');
  const starts = [];
  let acc = origin;
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    if (!(s.to > s.from) || !(s.px > 0)) throw new Error(`makeXScale: bad segment ${i}`);
    if (i > 0 && s.from !== segments[i - 1].to) throw new Error('makeXScale: segments must be contiguous');
    starts.push(acc);
    acc += s.px;
  }
  const f = (year) => {
    if (year <= segments[0].from) return origin;
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      if (year <= s.to) return starts[i] + ((year - s.from) / (s.to - s.from)) * s.px;
    }
    return acc;
  };
  f.origin = origin;
  f.width = acc - origin;
  f.end = acc;
  f.segments = segments;
  f.domain = [segments[0].from, segments[segments.length - 1].to];
  return f;
}

/**
 * Assign each node to a sub-row so labels in the same lane never overlap.
 * Each node occupies [x - r, x + r + labelGap + labelWidth] on its row.
 * Greedy, in x order (ties broken by id) so the result is deterministic.
 * Returns { rowOf: Map(id -> row), rows: number }.
 */
export function stackNodes(laneNodes, { labelGap = 4, hGap = 10 } = {}) {
  const sorted = [...laneNodes].sort((a, b) => a.x - b.x || (a.id < b.id ? -1 : 1));
  const rowEnds = [];
  const rowOf = new Map();
  for (const n of sorted) {
    const left = n.x - n.r;
    const right = n.x + n.r + labelGap + n.labelW;
    let row = rowEnds.findIndex((end) => end + hGap <= left);
    if (row === -1) {
      row = rowEnds.length;
      rowEnds.push(right);
    } else {
      rowEnds[row] = right;
    }
    rowOf.set(n.id, row);
  }
  return { rowOf, rows: Math.max(1, rowEnds.length) };
}

/**
 * nodes: [{ id, year, lane, label, impact, ghost? }]
 * lanes: [{ id, label, color }] in top-to-bottom order
 * Returns { nodes (with x,y,r,row,labelW), lanes (with y0,h,cy,rows), width, height }.
 *
 * By default the sub-rows only keep the dots apart: the app draws labels itself, in screen space,
 * and chooses which ones fit (js/labels.js). Pass reserveLabels: true to also reserve room for every
 * label in world space, which gives taller lanes but never needs a label to be hidden.
 */
export function computeLayout({ nodes, lanes, xScale, measure = estimateTextWidth, reserveLabels = false }) {
  const laneIds = new Set(lanes.map((l) => l.id));
  const prepared = nodes.map((n) => {
    if (!laneIds.has(n.lane)) throw new Error(`computeLayout: node ${n.id} has unknown lane "${n.lane}"`);
    return { ...n, x: xScale(n.year), r: radiusFor(n.impact), labelW: measure(n.label) };
  });

  const outLanes = [];
  const byId = new Map();
  let y = 0;
  for (const lane of lanes) {
    const inLane = prepared.filter((n) => n.lane === lane.id);
    const { rowOf, rows } = stackNodes(reserveLabels ? inLane : inLane.map((n) => ({ ...n, labelW: 0 })));
    const h = LANE_PAD * 2 + rows * ROW_H;
    for (const n of inLane) {
      const row = rowOf.get(n.id);
      byId.set(n.id, { ...n, row, y: y + LANE_PAD + row * ROW_H + ROW_H / 2 });
    }
    outLanes.push({ ...lane, y0: y, h, cy: y + h / 2, rows });
    y += h;
  }

  const outNodes = prepared.map((n) => byId.get(n.id));
  const maxRight = Math.max(0, ...outNodes.map((n) => n.x + n.r + 4 + n.labelW));
  return {
    nodes: outNodes,
    lanes: outLanes,
    width: Math.max(xScale.end, maxRight) + 16,
    height: y,
  };
}
