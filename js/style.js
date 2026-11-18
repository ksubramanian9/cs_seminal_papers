/*
 * Visual encoding shared by the graph and the legend. Colours are provisional until the
 * M1 review (palette and typography are an author decision).
 *
 * Edge types are distinguished by colour AND dash pattern AND arrowhead shape, so they
 * are not told apart by colour alone.
 */

export const EDGE_STYLE = {
  builds_on:       { label: 'Builds on',               color: '#6b7280', width: 1.6, dash: '',     marker: 'triangle' },
  generalizes:     { label: 'Generalizes',             color: '#7c3aed', width: 1.8, dash: '',     marker: 'diamond' },
  overcomes_limit: { label: 'Overcomes a limit of',    color: '#d1242f', width: 2.4, dash: '',     marker: 'triangle' },
  new_domain:      { label: 'Applies in a new domain', color: '#0d8a7f', width: 1.8, dash: '2 4',  marker: 'circle' },
  rival:           { label: 'Rival approach',          color: '#c77700', width: 1.8, dash: '7 5',  marker: null },
};

/** Interpretive edges are drawn thinner and lighter than explicit ones. */
export const EVIDENCE_STYLE = {
  explicit:     { widthFactor: 1,    opacity: 0.9,  label: 'Explicit (cited or credited)' },
  interpretive: { widthFactor: 0.65, opacity: 0.55, label: 'Interpretive (a reading)' },
};

export const HIGHLIGHT = {
  selected: '#111111',
  ancestor: '#1d4ed8',
  descendant: '#c2410c',
  rival: '#c77700',
};

export const MARKER_PATH = {
  triangle: 'M0,1 L10,5 L0,9 z',
  diamond: 'M0,5 L5,1 L10,5 L5,9 z',
  circle: 'M5,1 A4,4 0 1,1 4.99,1 z',
};
