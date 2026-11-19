/*
 * The "stepper" widget type: play, pause, step and go back through a precomputed list of frames.
 *
 * It owns the controls, the position, the status line and the optional inputs. What the frames
 * ARE and how one is drawn belongs to a model (js/widgets/models/<name>.js), chosen by config.model:
 *
 *   model.inputs(config)            -> [{ id, label, value, maxLength, hint }]   (optional)
 *   model.validate(values, config)  -> error string or null                      (optional)
 *   model.build(config, values)     -> { frames: [{ note, ... }], ... }
 *   model.render(host, built, frame, index)
 *
 * Contract with the loader: mount(container, config) returns { destroy() }; destroy() clears the
 * play timer and removes the listener this module added outside the widget's own DOM.
 */

import { createStepperState } from './stepper-state.js';
import { setTimer, clearTimer } from './registry.js';
import * as turing from './models/turing.js';
import * as church from './models/church.js';
import * as dijkstra from './models/dijkstra.js';
import * as quicksort from './models/quicksort.js';

const MODELS = { turing, church, dijkstra, quicksort };
const DEFAULT_SPEED_MS = 900;

function el(tag, props = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else n.setAttribute(k, v);
  }
  for (const c of children) if (c != null) n.append(c);
  return n;
}

export function mount(host, config) {
  const model = MODELS[config.model];
  if (!model) throw new Error(`unknown stepper model "${config.model}"`);
  const speed = config.speedMs ?? DEFAULT_SPEED_MS;

  let built = null;
  const state = createStepperState(1);
  let playing = false;
  let timer = null;
  let destroyed = false;

  /* ---------- DOM ---------- */
  const root = el('div', { class: 'widget stepper' });
  const title = config.title ? el('p', { class: 'widget-title' }, config.title) : null;

  const inputSpecs = model.inputs ? model.inputs(config) : [];
  const inputEls = new Map();
  let form = null, errorEl = null;
  if (inputSpecs.length) {
    errorEl = el('p', { class: 'widget-input-error', role: 'alert' });
    errorEl.hidden = true;
    form = el('form', { class: 'widget-inputs', novalidate: '' });
    for (const spec of inputSpecs) {
      const input = el('input', { type: 'text', id: `w-${spec.id}`, value: spec.value ?? '', autocomplete: 'off', spellcheck: 'false' });
      if (spec.maxLength) input.maxLength = spec.maxLength;
      input.setAttribute('aria-describedby', 'w-hint');
      inputEls.set(spec.id, input);
      form.append(el('label', { for: `w-${spec.id}` }, spec.label), input);
    }
    form.append(el('button', { type: 'submit', class: 'widget-btn' }, 'Run'));
    form.append(el('span', { id: 'w-hint', class: 'widget-hint' }, inputSpecs[0].hint || ''));
  }

  const stage = el('div', { class: 'widget-stage' });
  const status = el('p', { class: 'widget-status', role: 'status', 'aria-live': 'polite' });
  const counter = el('span', { class: 'widget-counter' });
  const btn = (text, label) => el('button', { type: 'button', class: 'widget-btn', 'aria-label': label }, text);
  const bReset = btn('↺ Reset', 'Reset to the start');
  const bBack = btn('◀ Back', 'Step back');
  const bPlay = btn('▶ Play', 'Play automatically');
  const bStep = btn('Step ▶', 'Step forward');
  const controls = el('div', { class: 'widget-controls' }, bReset, bBack, bPlay, bStep, counter);
  const caption = config.caption ? el('p', { class: 'widget-caption' }, config.caption) : null;

  for (const n of [title, form, errorEl, stage, status, controls, caption]) if (n) root.append(n);
  host.append(root);

  /* ---------- behaviour ---------- */
  function currentValues() {
    const v = {};
    for (const [k, input] of inputEls) v[k] = input.value;
    return v;
  }

  function update() {
    if (destroyed || !built) return;
    const i = state.index;
    const frame = built.frames[i];
    model.render(stage, built, frame, i);
    status.textContent = frame.note ?? '';
    counter.textContent = `Step ${i} of ${state.count - 1}`;
    bReset.disabled = state.atStart;
    bBack.disabled = state.atStart;
    bStep.disabled = state.atEnd;
    bPlay.textContent = playing ? '⏸ Pause' : (state.atEnd && state.count > 1 ? '↻ Replay' : '▶ Play');
    bPlay.setAttribute('aria-label', playing ? 'Pause' : 'Play automatically');
    bPlay.disabled = state.count <= 1;
  }

  function stop() {
    playing = false;
    clearTimer(timer);
    timer = null;
  }

  function tick() {
    timer = null;
    if (destroyed || !playing) return;
    if (!state.next()) { stop(); update(); return; }
    update();
    if (state.atEnd) { stop(); update(); return; }
    timer = setTimer(tick, speed);
  }

  function play() {
    if (state.atEnd) state.reset();
    playing = true;
    update();
    timer = setTimer(tick, speed);
  }

  function rebuild() {
    stop();
    const values = currentValues();
    const err = model.validate ? model.validate(values, config) : null;
    if (err) {
      errorEl.textContent = err;
      errorEl.hidden = false;
      for (const input of inputEls.values()) input.setAttribute('aria-invalid', 'true');
      return false;
    }
    if (errorEl) { errorEl.textContent = ''; errorEl.hidden = true; }
    for (const input of inputEls.values()) input.removeAttribute('aria-invalid');
    built = model.build(config, values);
    state.setCount(built.frames.length);
    update();
    return true;
  }

  const on = (node, type, fn) => node.addEventListener(type, fn);
  on(bReset, 'click', () => { stop(); state.reset(); update(); });
  on(bBack, 'click', () => { stop(); state.back(); update(); });
  on(bStep, 'click', () => { stop(); state.next(); update(); });
  on(bPlay, 'click', () => { if (playing) { stop(); update(); } else play(); });
  if (form) on(form, 'submit', (ev) => { ev.preventDefault(); rebuild(); });
  const onKey = (ev) => {
    if (ev.target.tagName === 'INPUT' || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); stop(); state.next(); update(); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); stop(); state.back(); update(); }
  };
  on(root, 'keydown', onKey);

  rebuild();

  return {
    destroy() {
      destroyed = true;
      stop();
      root.removeEventListener('keydown', onKey);
      root.remove();
    },
  };
}
