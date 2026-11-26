/*
 * Bookkeeping for widgets, so leaks are measurable (and tested).
 *
 * Every widget timer goes through setTimer/clearTimer, and the loader counts mounted widgets.
 * After a widget is destroyed, both counts must return to what they were before it mounted.
 */

const timers = new Set();
let mounted = 0;

/** setTimeout that is tracked. The callback runs at most once. */
export function setTimer(fn, ms) {
  const id = setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
  return id;
}

export function clearTimer(id) {
  if (id == null) return;
  clearTimeout(id);
  timers.delete(id);
}

export const noteMounted = () => { mounted++; };
export const noteDestroyed = () => { mounted = Math.max(0, mounted - 1); };

/** Live counts, for tests and debugging. */
export function widgetStats() {
  return { mounted, timers: timers.size };
}
