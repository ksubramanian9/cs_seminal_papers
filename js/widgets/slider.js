/*
 * The "slider" widget type: move sliders, watch a chart and a few readouts respond.
 *
 * It owns the sliders, the readouts, the status line and the Reset button. What the numbers mean
 * and how the chart is drawn belongs to a model (js/widgets/models/<name>.js), chosen by config.model:
 *
 *   model.compute(values, config, extra) -> { readouts: [{ label, value, hint? }], message?, ...state }
 *        pure; `values` maps each slider id to its current value; `extra` is a scratch object that lives
 *        as long as the widget (a model may keep random draws in it) and is cleared by Reset.
 *   model.render(host, state, config)    draws the chart into `host`
 *   model.actions?(config)               -> [{ id, label }]  extra buttons beside Reset
 *   model.act?(id, values, config, extra) handles one of those buttons
 *
 * A slider in the config is { id, label, min, max, step, value, unit? }, or, for values that do not
 * go up evenly (powers of two, a logarithmic scale), { id, label, values: [...], value, unit? }.
 *
 * There are no timers, so nothing runs after destroy(); the loader only needs mount(container, config)
 * to return { destroy() }.
 */

import * as shannon from './models/shannon.js';
import * as amdahl from './models/amdahl.js';
import * as brooks from './models/brooks.js';
import * as privacy from './models/privacy.js';

const MODELS = { shannon, amdahl, brooks, privacy };
let instances = 0; // gives every mounted widget unique ids for its labels

function el(tag, props = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else n.setAttribute(k, v);
  }
  for (const c of children) if (c != null) n.append(c);
  return n;
}

const unitText = (unit) => (!unit ? '' : unit === '%' ? '%' : ` ${unit}`);

export function mount(host, config) {
  const model = MODELS[config.model];
  if (!model) throw new Error(`unknown slider model "${config.model}"`);
  if (!Array.isArray(config.sliders) || !config.sliders.length) throw new Error('a slider widget needs at least one slider');
  const uid = ++instances;
  const extra = {};
  const values = {};

  /* ---------- DOM ---------- */
  const root = el('div', { class: 'widget slider-widget' });
  const title = config.title ? el('p', { class: 'widget-title' }, config.title) : null;

  const controls = el('div', { class: 'sl-controls' });
  const rows = config.sliders.map((spec) => {
    const discrete = Array.isArray(spec.values);
    const inputId = `sl-${uid}-${spec.id}`;
    const input = el('input', { type: 'range', class: 'sl-range', id: inputId });
    if (discrete) { input.min = '0'; input.max = String(spec.values.length - 1); input.step = '1'; }
    else { input.min = String(spec.min); input.max = String(spec.max); input.step = String(spec.step ?? 1); }
    const out = el('output', { class: 'sl-value', for: inputId });
    controls.append(el('div', { class: 'sl-row' }, el('label', { for: inputId }, spec.label), input, out));
    return { spec, discrete, input, out };
  });

  const stage = el('div', { class: 'widget-stage' });
  const readouts = el('dl', { class: 'sl-readouts' });
  const status = el('p', { class: 'widget-status', role: 'status', 'aria-live': 'polite' });
  const buttons = el('div', { class: 'widget-controls' });
  const bReset = el('button', { type: 'button', class: 'widget-btn', 'aria-label': 'Reset the sliders to their starting values' }, '↺ Reset');
  buttons.append(bReset);
  const modelActions = model.actions ? model.actions(config) : [];
  const actionButtons = modelActions.map((a) => {
    const b = el('button', { type: 'button', class: 'widget-btn' }, a.label);
    b.addEventListener('click', () => { model.act(a.id, values, config, extra); update(); });
    buttons.append(b);
    return b;
  });
  const caption = config.caption ? el('p', { class: 'widget-caption' }, config.caption) : null;

  for (const n of [title, controls, stage, readouts, status, buttons, caption]) if (n) root.append(n);
  host.append(root);

  /* ---------- behaviour ---------- */
  function readValue(row) {
    const raw = Number(row.input.value);
    return row.discrete ? row.spec.values[raw] : raw;
  }

  function showSlider(row) {
    const v = readValue(row);
    values[row.spec.id] = v;
    const text = `${v}${unitText(row.spec.unit)}`;
    row.out.textContent = text;
    row.input.setAttribute('aria-valuetext', text);
  }

  function update() {
    for (const row of rows) showSlider(row);
    const state = model.compute(values, config, extra);
    model.render(stage, state, config);
    readouts.textContent = '';
    for (const r of state.readouts) {
      const dd = el('dd', {}, r.value);
      if (r.hint) dd.append(el('span', { class: 'sl-hint' }, r.hint));
      readouts.append(el('dt', {}, r.label), dd);
    }
    status.textContent = state.message ?? '';
  }

  function setDefaults() {
    for (const row of rows) {
      row.input.value = row.discrete ? String(Math.max(0, row.spec.values.indexOf(row.spec.value))) : String(row.spec.value);
    }
  }

  const onInput = () => update();
  for (const row of rows) row.input.addEventListener('input', onInput);
  bReset.addEventListener('click', () => {
    for (const k of Object.keys(extra)) delete extra[k];
    setDefaults();
    update();
  });

  setDefaults();
  update();

  return {
    destroy() {
      for (const row of rows) row.input.removeEventListener('input', onInput);
      root.remove();
    },
  };
}
