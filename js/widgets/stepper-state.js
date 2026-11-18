/*
 * Pure position-tracking for a stepper: which frame is showing, and whether we can go on or back.
 * No DOM, so it is unit-tested directly.
 */

export function createStepperState(frameCount) {
  let count = Math.max(1, frameCount | 0);
  let i = 0;
  return {
    get index() { return i; },
    get count() { return count; },
    get atStart() { return i === 0; },
    get atEnd() { return i >= count - 1; },
    /** Advance one frame. Returns false (and stays put) at the last frame. */
    next() { if (i < count - 1) { i++; return true; } return false; },
    /** Go back one frame. Returns false (and stays put) at the first frame. */
    back() { if (i > 0) { i--; return true; } return false; },
    reset() { i = 0; },
    /** Replace the frames (for example after the user edits the input); returns to the start. */
    setCount(n) { count = Math.max(1, n | 0); i = 0; },
  };
}
