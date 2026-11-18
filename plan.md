# Plan: CS Seminal Papers Explorer

Companion docs: [intent.md](intent.md), [spec.md](spec.md). Each milestone ends in something the author can run in Live Server and review before the next begins.

## Approach

Walking skeleton first: render all 79 nodes with era bands and selection highlighting on placeholder edges, then author **one era completely** so the template and tone are judged early, then fill the remaining eras, then add widgets, then polish. Vertical slices, not layers.

## Status

- **M0: done.**
- **M1: built.** Its review checklist below is still open: the author has not yet answered it, so M2 proceeded on the defaults.
- **M2: built, awaiting the author checkpoint** (see "M2 checkpoint" below). The slice is CS001-CS014 (eras E1 and E2).
- M3 onward: not started.
- **Tests** (open any through Live Server; the page title reads ALL PASSED, and each page lists every check):
  - `tests/unit.html`: 45 checks (layout, traversal, the validator's rules, and the theme logic).
  - `tests/smoke.html`: 36 checks; mounts the real app on its own page and drives it, and loads the real `index.html` to test the theme toggle.
  - `tests/validate.html`: data integrity (spec section 7). Default is scoped to authored papers; add `?strict=1` for the definition of done (it fails until all 79 are authored and no placeholder edges remain).

### M2 checkpoint (author decisions)

Please read a few full entries (suggested: CS004 Turing, CS007 EDVAC, CS011 Chomsky) and the link lists in their panels, then decide:

1. **Template and tone.** Five parts per paper (problem, insight, analogy, unlocked, left open), 350-390 words, written for a smart non-specialist. Right level? Too much or too little analogy? Keep the five headings?
2. **Edge density.** The slice has 28 real edges (about 2 per paper) and 5 ghost nodes. More, fewer, or about right?
3. **Ghost nodes.** Boole, Frege, Hilbert's decision problem, ENIAC, Wiener. The spec allowed three beyond its proposed list: Frege, ENIAC and Wiener are those three. Approve, or change?
4. **Evidence tags.** 17 explicit edges are checkable facts (list in `content/REVIEW_QUEUE.md` section B); 11 are interpretive. Spot-check a sample, particularly the items in section A of the queue.
5. **Diagrams.** 14 static SVGs; style guide in `content/DIAGRAM_STYLE.md`. Clear enough? Anything misleading?
6. **Changed from the spec:** CS011's short label is now "Three models of language" (the 1956 paper compares three models; the hierarchy came in 1959).

The rest of M3 (65 papers) does not start until you approve the template.

### M1 review checklist (author decisions)

1. **Overview legibility.** At the fitted zoom, labels render at roughly 7-8 px on a 1600x900 window because the 12 lanes and their stacked rows are height-limited. Options: accept it (zoom to read), hide labels in the overview, or give the canvas more height (e.g. a collapsible legend).
2. **Palette and typography.** Provisional: system font, 12 lane colours in `data/lanes.json`, edge colours in `js/style.js`.
3. **Short node labels.** 79 labels authored in `data/papers.json` (`short`); please skim for any you dislike.
4. **Axis compression.** 1908-1930 is compressed to 90 px with a dashed break line and an axis break mark.
5. **Lane order.** As in the spec; check that related fields sit near each other.
6. **Placeholder edges.** The 28 edges in `data/edges.json` are rough (`[placeholder]` in each `why`) and are replaced in M2/M3. They exist only to exercise the five edge styles and the highlighting.

## Planned file layout

```
index.html
css/styles.css
js/main.js            entry, wires everything
js/store.js           single state: selection, data
js/data.js            fetch + parse JSON, surface errors
js/layout.js          piecewise x-scale, lane y, collision stacking (pure)
js/graph.js           SVG render, zoom, highlight (uses D3)
js/traverse.js        ancestors/descendants (pure)
js/panel.js           detail panel
js/widgets/*.js       mount(container, config) / destroy()
vendor/d3.min.js      D3 v7 (pinned, vendored)
data/papers.json  explanations.json  edges.json  ghosts.json  eras.json  lanes.json
diagrams/CSxxx.svg
content/REVIEW_QUEUE.md   claims for the author to spot-check
tests/validate.html       data-integrity checks
tests/unit.html           layout/traversal tests
```

The source CSV stays untouched as a reference.

## Milestones

### M0: Foundations (data conversion and scaffold)

| # | Task | Done when |
|---|---|---|
| 0.1 | One-time conversion of the CSV to `data/papers.json` (throwaway script, not shipped; read as `utf-8-sig`) | 79 objects; ids CS001–CS079; years numeric; spot-check Gödel title renders correctly |
| 0.2 | Create stub `explanations.json`, `edges.json`, `ghosts.json`, `eras.json`, `lanes.json` | Files exist and parse; schema documented in a header comment in `data.js` |
| 0.3 | Vendor D3 v7 (pinned version) into `vendor/` | App loads with network disabled |
| 0.4 | `index.html` shell, CSS tokens, Live Server run | Blank layout with header, canvas area and panel area loads |
| 0.5 | `data.js` loader with visible error states | Deleting a JSON file shows a clear error message, not a blank page |

Checkpoint: author confirms the 79 papers match the CSV.

### M1: Walking skeleton (the whole graph, thinly)

| # | Task | Done when |
|---|---|---|
| 1.1 | `layout.js`: piecewise x-scale, lane y, collision stacking, with unit tests | Unit tests pass; no overlapping nodes on the real data |
| 1.2 | Draw lanes, axis (with break marker), era bands with captions | All 7 proposed eras visible with their question |
| 1.3 | Draw 79 nodes, size by conceptual impact, short labels | Every paper visible and legible at default zoom |
| 1.4 | Placeholder edges (about 20, deliberately rough) with type styles | All five edge-type styles visible and distinguishable |
| 1.5 | `traverse.js` with unit tests; selection highlights ancestry and descendants | Selecting a node dims all non-related nodes and edges |
| 1.6 | Pan/zoom with controls; hash deep link | `#CS004` loads selected; invalid hash is ignored |
| 1.7 | Minimal panel showing CSV fields only | Panel shows title, authors, year, source link |
| 1.8 | Legend | Lane, size and edge types explained |

Checkpoint: author reviews legibility of the canvas, the lane order and the visual style. **Decisions here:** palette and typography, short labels, axis compression.

### M2: One era fully authored (the template test)

Era chosen: **E1 + E2 (1910–1961, CS001–CS014)**, since it contains the clearest chain (Principia → Gödel → Church/Turing → Shannon → von Neumann → AI) and the first ghost nodes.

| # | Task | Done when |
|---|---|---|
| 2.1 | Author explanations for CS001–CS014 (problem, insight, analogy, unlocked, left open) | Each 350–450 words, in the agreed tone |
| 2.2 | Author the diagrams for those papers (static SVG) | Each file renders in the panel |
| 2.3 | Author real edges within and out of the era, with `why` and `evidence`; add the ghost nodes the era needs | Every paper in the era has ≥1 edge; explicit/interpretive tags applied honestly |
| 2.4 | Full panel: sections, Builds-on / Led-to lists, click-through navigation | Click-through selects and scrolls the canvas |
| 2.5 | `tests/validate.html` implementing the rules in the spec §7 (scoped to authored papers so far) | Validator runs green for the authored era |
| 2.6 | Populate `content/REVIEW_QUEUE.md` | Uncertain claims listed with the paper id |

Checkpoint (critical): the author reads several full entries and **approves or revises the template, tone, length and edge-density** before the remaining 60+ entries are written. Perform the narrate-a-chain test on this era.

### M3: Remaining eras, in order

Author in era order so edges can point backward to content that already exists. Each sub-milestone follows the same task set as M2 (explanations, diagrams, edges, ghosts, validator run, review queue) and ends with a short author review.

| Sub | Era | Papers | Notes |
|---|---|---|---|
| 3a | E3 | CS015–CS026 | Efficiency, OS/multiprogramming, structured programming, complexity theory begins |
| 3b | E4 | CS027–CS043 | Relational model, NP-completeness, public-key crypto, UNIX, C, OO, protocols |
| 3c | E5 | CS044–CS054 | Distributed consensus, end-to-end, architecture, patterns, the Web proposal |
| 3d | E6 | CS055–CS067 | Web search, Paxos, Agile, large-scale systems, privacy, Bitcoin |
| 3e | E7 | CS068–CS079 | Deep learning to transformers to LLMs and code evaluation |

After each sub-milestone, the validator must pass for all authored papers. The final one must pass for all 79.

Parallelism: era drafting can be handed to subagents, but one reviewer (the author) owns tone consistency. Each subagent is given the approved M2 entries as the template.

Checkpoint after 3e: cross-era pass. Read all edges that cross era boundaries and check the "overcomes limit" chain reads as a coherent story. Then the author performs the narrate-a-chain test on five random papers.

### M4: Widgets

| # | Task | Done when |
|---|---|---|
| 4.1 | Widget contract: `mount(container, config)` / `destroy()`, load on demand | Panel mounts and cleans up a widget when the selection changes (no leaks) |
| 4.2 | Pick the final 10–15 widget papers from the spec's candidate list, with the author | List agreed and recorded in the spec |
| 4.3 | Build the 6–10 reusable widget types (stepper, slider-model, graph-step, table-ops, message-diagram, matrix-viz, etc.) and configure each paper | Each widget works with keyboard and mouse, resets, and has a one-line caption |
| 4.4 | Manual test of each widget, including mount/unmount cycles | No console errors; no leaked listeners |

### M5: Polish and hardening

| # | Task | Done when |
|---|---|---|
| 5.1 | Visual polish: spacing, type, colour contrast check, edge crossing review | Contrast passes AA; the canvas is readable at 1280 × 720 |
| 5.2 | Performance check (render, highlight latency, zoom) | Meets the spec targets |
| 5.3 | Robustness: malformed JSON, missing diagram, bad hash, huge text | Each shows a clear error; nothing crashes |
| 5.4 | Browser check on Chrome, Edge, Firefox | Same behaviour in all three |
| 5.5 | Final validator run; clear the review queue or mark remaining items "accepted" | All checks pass; queue resolved |
| 5.6 | Short README (how to run with Live Server, how to edit data) | Author can add an edge without reading code |

## Dependency order

```
M0 → M1 → M2 → (author checkpoint) → M3a → M3b → M3c → M3d → M3e → M4 → M5
```

M4 widget infrastructure (4.1) can begin once M2's panel exists, in parallel with M3, but individual widgets are configured after the papers' content is stable.

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| A wrong "why" on an edge teaches something false | Medium | Explicit/interpretive tagging; review queue; spot-check sample; no `explicit` tag without confidence |
| 79 entries × ~400 words is a large writing task and tone drifts | High | M2 template checkpoint; era-by-era drafting; single reviewer |
| The canvas becomes a hairball in dense eras (1960s–70s, 2010s) | Medium | Lane order tuned in M1; collision stacking; edge opacity by evidence; limit to ~2–3 edges per paper |
| Edge routing across 12 lanes creates unreadable crossings | Medium | Curve routing tuned in M1; validate on the real edge set at M3 checkpoints |
| Widget scope balloons | Medium | Capped at 10–15 papers and 6–10 types; cut candidates freely |
| Author changes the corpus mid-way | Low | JSON is the source after M0; "ask first" boundary in the spec |
| Hand-written SVG diagrams are inconsistent | Medium | Shared diagram style guide (stroke, palette, label size) created at M2 |
| D3 version drift | Low | Pin and vendor one version; no CDN |

## Definition of done (project)

1. All 79 papers have a full explanation, a diagram, and at least one edge.
2. The validator passes with no failures and the review queue is resolved.
3. Selecting any paper highlights its ancestry and descendants; deep links work.
4. The author passes the narrate-a-chain test on five randomly chosen papers.
5. Works offline in Live Server on Chrome, Edge and Firefox at 1280 × 720 or larger.

## Immediate next step

On approval of these three documents: begin M0 (convert the CSV, scaffold the project, vendor D3).
