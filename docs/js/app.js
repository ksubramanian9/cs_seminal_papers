import { loadAll, DataError } from './data.js';
import { createGraph } from './graph.js';
import { createPanel } from './panel.js';
import { renderLegend } from './legend.js';

/** Deep links: #CS004 selects that paper. Anything else is ignored. */
function idFromHash() {
  try { return decodeURIComponent(location.hash.replace(/^#/, '')); } catch { return ''; }
}
function writeHash(id) {
  const url = id ? `#${encodeURIComponent(id)}` : location.pathname + location.search;
  history.replaceState(null, '', url);
}

/**
 * Mount the app into the given elements. Returns { graph, panel, data, destroy() },
 * or null if the data could not be loaded (an error is shown in errorEl instead).
 * Taking the elements as arguments lets the smoke tests mount the real app on their own page.
 */
export async function start({ canvasEl, panelEl, errorEl, animate }) {
  const showError = (message) => {
    errorEl.textContent = message;
    errorEl.hidden = false;
    canvasEl.textContent = '';
  };
  errorEl.hidden = true;

  let data;
  try {
    data = await loadAll();
  } catch (e) {
    showError(e instanceof DataError ? `Data problem: ${e.message}` : `Unexpected error: ${e.message}`);
    console.error(e);
    return null;
  }

  const paperById = new Map(data.papers.map((p) => [p.id, p]));
  const ghostById = new Map((data.ghosts || []).map((g) => [g.id, g]));
  const panel = createPanel(panelEl, {
    onClose: () => graph.select(null, { fromUser: true }),
    // Clicking a linked paper selects it and always re-centres the canvas on it.
    onNavigate: (id) => graph.select(id, { fromUser: false }),
  });

  /** A small summary of a node (paper or ghost) for the link lists. */
  const describe = (id) => {
    const p = paperById.get(id);
    if (p) return { id, title: p.title, year: p.year, ghost: false };
    const g = ghostById.get(id);
    if (g) return { id, title: g.title, year: g.year, ghost: true, blurb: g.blurb };
    return null;
  };

  /** Group the edges touching `id` for the panel, oldest related paper first within each group. */
  function groupsFor(id) {
    const groups = { drewOn: [], ledTo: [], rivals: [] };
    for (const e of data.edges) {
      if (e.from !== id && e.to !== id) continue;
      const other = describe(e.from === id ? e.to : e.from);
      if (!other) continue;
      if (e.type === 'rival') groups.rivals.push({ edge: e, other });
      else if (e.to === id) groups.drewOn.push({ edge: e, other });
      else groups.ledTo.push({ edge: e, other });
    }
    for (const g of Object.values(groups)) g.sort((a, b) => a.other.year - b.other.year || (a.other.id < b.other.id ? -1 : 1));
    return groups;
  }

  const graph = createGraph(canvasEl, data, {
    ...(animate === undefined ? {} : { animate }),
    onSelect(id, { fromUser }) {
      writeHash(id);
      if (!id) {
        panel.hide();
        graph.resize(); // the stage just widened: re-clamp now rather than waiting for ResizeObserver
        return;
      }
      panel.show({
        paper: paperById.get(id),
        explanation: data.explanations[id] || null,
        groups: groupsFor(id),
      });
      // After the panel opens the stage narrows; keep the node in view.
      graph.focus(id, { onlyIfOffscreen: fromUser });
    },
  });
  renderLegend(graph.legendSlot);

  const applyHash = () => {
    const id = idFromHash();
    if (id && graph.has(id)) graph.select(id);
    else if (!id && graph.selected) graph.select(null);
  };
  window.addEventListener('hashchange', applyHash);
  applyHash();

  return {
    graph, panel, data,
    destroy() {
      window.removeEventListener('hashchange', applyHash);
      graph.destroy();
    },
  };
}
