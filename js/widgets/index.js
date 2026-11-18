/*
 * Widget loader: the contract between the detail panel and the interactive widgets.
 *
 * A paper's explanation may carry   "widget": { "type": "stepper", "config": "widgets/turing.json" }
 *
 * - `type` selects a widget module, loaded on demand (nothing is downloaded until a panel needs it).
 * - `config` is a JSON file, fetched relative to the project root, handed to the module.
 * - A widget module exports   mount(container, config)   and returns a handle with   destroy().
 *   destroy() must stop every timer and listener the widget started, and leave nothing behind.
 *
 * mountWidget() is safe against the user moving on: if destroy() is called before loading has
 * finished, nothing is mounted. Failures show a message in the container instead of throwing.
 */

import { noteMounted, noteDestroyed } from './registry.js';
import { WIDGET_TYPE_NAMES } from './types.js';

export { WIDGET_TYPE_NAMES };
export { widgetStats } from './registry.js';

const ROOT_URL = new URL('../../', import.meta.url);

/** Module loaders, one per implemented type. Types listed in WIDGET_TYPE_NAMES but missing here are not built yet. */
const LOADERS = {
  stepper: () => import('./stepper.js'),
};

async function fetchConfig(path) {
  const res = await fetch(new URL(path, ROOT_URL), { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json();
}

function note(container, text, cls = 'widget-note') {
  container.textContent = '';
  const p = document.createElement('p');
  p.className = cls;
  p.textContent = text;
  container.append(p);
}

/**
 * Mount a widget described by `spec` into `container`.
 * Returns { destroy(), ready } where `ready` resolves once the widget has mounted or failed.
 */
export function mountWidget(container, spec) {
  let destroyed = false;
  let handle = null;
  note(container, 'Loading the interactive demo…');

  const ready = (async () => {
    try {
      const loader = spec && LOADERS[spec.type];
      if (!loader) {
        const known = WIDGET_TYPE_NAMES.includes(spec?.type);
        throw new Error(known ? `widget type "${spec.type}" is not built yet` : `unknown widget type "${spec?.type}"`);
      }
      if (!spec.config) throw new Error('no config file named');
      const [mod, config] = await Promise.all([loader(), fetchConfig(spec.config)]);
      if (destroyed) return; // the user moved on while we were loading
      container.textContent = '';
      handle = mod.mount(container, config);
      noteMounted();
    } catch (err) {
      console.error('Widget failed:', err);
      if (!destroyed) note(container, 'The interactive demo is unavailable.', 'widget-note widget-error');
    }
  })();

  return {
    ready,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (handle) {
        try { handle.destroy(); } finally { noteDestroyed(); }
        handle = null;
      }
      container.textContent = '';
    },
  };
}
