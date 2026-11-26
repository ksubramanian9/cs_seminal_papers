/*
 * Which node labels to draw at the current zoom. Pure: no DOM, so it is unit-tested (tests/unit.html).
 *
 * Labels live in screen space, so they stay a readable size at every zoom level. There is not room
 * to label every node when zoomed out, so labels are offered in priority order and a label is drawn
 * only if it fits: it must not overlap an already-drawn label, and it must not cover another
 * node's dot. Zooming in spreads the nodes apart, so more labels fit.
 *
 * `order` is the priority list (most important first). The caller puts the hovered node first,
 * then the selected paper's lineage, then everything else by importance.
 */

const MARGIN = 40; // how far outside the view a node may be and still be considered

/** Where a label may go, in order of preference: beside its dot first, then on top of or under it. */
export const SIDES = ['right', 'left', 'above', 'below'];
const ANCHOR = { right: 'start', left: 'end', above: 'middle', below: 'middle' };

/**
 * nodes: [{ id, x, y, r, labelW }] in world coordinates (labelW is the label's width in screen px).
 * Returns Map(id -> { x, y, w, side, anchor }) for the labels to draw. (x, y) is the text anchor point
 * in screen coordinates: the left end for a label to the right of its dot, the right end for one to
 * the left, and the middle for one above or below. y is the vertical middle of the text.
 * A label is drawn only if it lies wholly inside the view and starts no further left than `minX` (the
 * sticky lane names live there). Ids in `force` are always drawn if any side of them is inside the view.
 */
export function chooseLabels({ nodes, order, k, tx, ty, viewW, viewH, labelH = 14, gap = 4, pad = 3, sides = SIDES, minX = 0, force = [] }) {
  // Screen geometry of every node that could matter: inside the view, or just outside it.
  const vis = new Map();
  for (const n of nodes) {
    const sx = n.x * k + tx, sy = n.y * k + ty, r = n.r * k;
    if (sx - r > viewW + MARGIN || sy + r < -MARGIN || sy - r > viewH + MARGIN) continue;
    if (sx + r + gap + n.labelW < -MARGIN) continue; // the whole label would be off to the left
    vis.set(n.id, { id: n.id, sx, sy, r, w: n.labelW });
  }
  const dots = [...vis.values()].map((v) => ({ id: v.id, x0: v.sx - v.r - 1, x1: v.sx + v.r + 1, y0: v.sy - v.r - 1, y1: v.sy + v.r + 1 }));

  const hit = (a, b, p) => a.x0 < b.x1 + p && b.x0 < a.x1 + p && a.y0 < b.y1 + p && b.y0 < a.y1 + p;
  const placed = [];
  const out = new Map();
  const forced = new Set(force);
  for (const id of order) {
    const v = vis.get(id);
    if (!v || out.has(id)) continue;
    // Try each side in order of preference; the first one with room wins.
    const at = {
      right: { x0: v.sx + v.r + gap, cy: v.sy },
      left: { x0: v.sx - v.r - gap - v.w, cy: v.sy },
      above: { x0: v.sx - v.w / 2, cy: v.sy - v.r - 2 - labelH / 2 },
      below: { x0: v.sx - v.w / 2, cy: v.sy + v.r + 2 + labelH / 2 },
    };
    // Forced ids (the hovered or selected node) are always named: if no side is clear of other dots, the
    // first side that is inside the view is used even though it covers one.
    const passes = forced.has(id) ? [false, true] : [false];
    for (const ignoreDots of passes) {
      for (const side of sides) {
        const c = { side, ...at[side] };
        const rect = { x0: c.x0, x1: c.x0 + v.w, y0: c.cy - labelH / 2, y1: c.cy + labelH / 2 };
        if (rect.x0 < minX || rect.x1 > viewW || rect.y0 < 0 || rect.y1 > viewH) continue; // wholly inside the view, clear of the lane names on the left
        if (!ignoreDots && dots.some((d) => d.id !== id && hit(rect, d, 0))) continue;
        if (placed.some((p) => hit(rect, p, pad))) continue;
        placed.push(rect);
        out.set(id, { x: c.side === 'left' ? c.x0 + v.w : c.side === 'right' ? c.x0 : c.x0 + v.w / 2, y: c.cy, w: v.w, side: c.side, anchor: ANCHOR[c.side] });
        break;
      }
      if (out.has(id)) break;
    }
  }
  return out;
}

/**
 * Priority order for labels: importance first (conceptual impact, then how many links touch the
 * paper, so well-connected papers win ties), outside influences last, then id for a stable result.
 * nodes: [{ id, impact, ghost? }]; degree: Map(id -> number of edges).
 */
export function basePriority(nodes, degree) {
  const rank = (n) => (n.ghost ? 0 : n.impact);
  return [...nodes]
    .sort((a, b) => rank(b) - rank(a) || (degree.get(b.id) || 0) - (degree.get(a.id) || 0) || (a.id < b.id ? -1 : 1))
    .map((n) => n.id);
}

/** Put `first` ids at the front of `order`, keeping the rest in their order, without duplicates. */
export function withFirst(order, first) {
  const seen = new Set();
  const out = [];
  for (const id of [...first, ...order]) {
    if (id == null || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}
