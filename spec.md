# Spec: CS Seminal Papers Explorer

Status: draft v1, derived from the grilling session. Companion docs: [intent.md](intent.md), [plan.md](plan.md).

## 1. Objective

An interactive, browser-only application that explains each of the 79 works in the source CSV at idea level and shows the conceptual links among them on a time-by-field canvas, so a reader can trace the progression of ideas.

## 2. Decisions locked in

| Area | Decision |
|---|---|
| Explanation depth | Idea-level for a smart non-specialist, about 350–450 words per paper |
| Link model | Typed, directed, annotated edges, each with a one-sentence "why" |
| Evidence | Each edge tagged `explicit` or `interpretive`; shown in the UI |
| Content provenance | Authored from knowledge plus CSV; review queue of uncertain claims; author spot-checks a sample |
| Main view | Single SVG canvas: x = year, y = primary-field lane, edges as curves |
| Encoding | Lane = field; node size = `conceptual_impact_1_3`; edge colour/style = edge type. **No ring/border for practice impact** (it is shown in the detail panel only) |
| Interactions (v1) | Select node → highlight full ancestry and descendants, dim the rest. Plus pan/zoom and deep links (`#CS004`) |
| Landing | Era bands with "what the field was asking" captions |
| Interactivity | ~10–15 papers get reusable demo widgets; every other paper gets a static SVG diagram |
| Corpus | CSV rows are the core nodes; up to 20 ghost context nodes for outside influences (cap raised from 12 by the author after M3a) |
| Data pipeline | One-time CSV→JSON conversion; JSON is the source of truth afterward |
| Runtime | Static files, served by Live Server; `fetch()` and ES modules allowed; no `file://` support |
| Dependencies | D3 v7 vendored in `vendor/`; nothing else; no CDN |
| Devices | Desktop/laptop browsers only (latest Chrome, Edge, Firefox) |
| Build order | Walking skeleton → one era fully authored → remaining eras → widgets → polish |

## 3. Source data facts (verified against the CSV)

- 79 rows, `work_id` CS001–CS079, years 1910–2023.
- 12 `primary_field` values: AI and machine learning (13), Software engineering (11), Networks and distributed systems (11), Programming languages and compilers (8), Algorithms and complexity (8), Databases (6), Foundations and logic (5), Architecture and hardware (5), Security and privacy (5), HCI and web (4), Operating systems and systems (2), Information theory (1).
- `conceptual_impact_1_3`: 49 rows are 3, 30 rows are 2. `practice_impact_1_3`: 50 are 3, 26 are 2, 3 are 1.
- `inclusion_tier`: 76 Established, 2 Emerging candidate, 1 Intellectual precursor (*Principia Mathematica*).
- All rows have a `source_url`.
- The CSV has **no** relationship data. All edges, explanations, diagrams, eras and ghost nodes are new content.
- The file begins with a UTF-8 BOM and contains non-ASCII characters (e.g. Gödel). The conversion must read it as `utf-8-sig`.

## 4. Data model

All files live in `data/` and are fetched at load. `work_id` (e.g. `CS004`) is the join key; ghost nodes use `G001`…

### 4.1 `papers.json` (generated once from the CSV, then edited by hand)

Array of objects with every CSV column, plus:

- `id` (= `work_id`)
- `year` as a number
- `fields` secondary fields as an array
- `tags` (from `analysis_tags`) as an array
- `short`: a label of at most 26 characters for the canvas (authored in M1; full titles stay in the panel and tooltip)

Original column names are kept so the author can diff against the CSV.

### 4.2 `explanations.json`: object keyed by `id`

```json
"CS004": {
  "problem": "…",
  "insight": "…",
  "analogy": "…",
  "unlocked": "…",
  "left_open": "…",
  "diagram": "diagrams/CS004.svg",
  "widget": { "type": "stepper", "config": "widgets/turing.json" },
  "review": ["claim the author should verify, if any"]
}
```

- `problem`, `insight`, `analogy`, `unlocked`, `left_open` are required plain-text strings. Combined length target is 350–450 words.
- `diagram` is required; `diagram_alt` (the text alternative shown to screen readers, since the SVG is loaded through `<img>`) is required with it. `widget` is optional.
- `review` is optional and lists claims to spot-check. It feeds the review queue and is not shown in the UI.

### 4.3 `edges.json`

```json
{ "id": "E012", "from": "CS004", "to": "CS007", "type": "builds_on",
  "why": "One sentence naming the intellectual move.", "evidence": "explicit" }
```

- `type` ∈ `builds_on`, `generalizes`, `overcomes_limit`, `new_domain`, `rival`.
- `evidence` ∈ `explicit`, `interpretive`.
- `from` is the earlier work, `to` the later. `rival` edges are stored the same way but drawn undirected.
- `why` is required, one sentence, ≤ 40 words.

Edge type meanings:

| Type | Meaning |
|---|---|
| `builds_on` | Direct extension or refinement |
| `generalizes` | A broader abstraction that subsumes the earlier idea |
| `overcomes_limit` | Explicitly fixes a stated problem in the earlier work (strongest progression signal) |
| `new_domain` | Idea transplanted into a different field |
| `rival` | Competing solution to the same problem |

### 4.4 `ghosts.json`

`{ id, year, title, lane, blurb }`. Ghost nodes are greyed, not clickable into a full panel, and show only a tooltip with the blurb. They may be the `from` end of an edge, but never the `to` end. Proposed (author approves before use):

In use so far (15): Boole, *Laws of Thought* (1854); Frege, *Begriffsschrift* (1879); Hilbert's decision problem (1928); ENIAC (1945); Wiener, *Cybernetics* (1948); Bush, *As We May Think* (1945); the ALGOL 60 report (1960); the transistor and integrated circuit (1947); Multics (1965); IMS and CODASYL databases (1968); Simula 67 (1967); ARPANET (1969); the Perceptron (1958); Alexander, *A Pattern Language* (1977); Pnueli's temporal logic of programs (1977). Still proposed, not yet used (3): Hashcash/Merkle trees (precursors to Bitcoin); LSTM (1997); sequence-to-sequence models (2014). That would reach 18, within the cap of 20 (raised from 12 by the author after M3a).

### 4.5 `eras.json`

`{ id, label, start, end, question, summary }`, about 7 eras. Proposed starting point (boundaries finalised during authoring):

| Era | Years | Question the field was asking |
|---|---|---|
| E1 | 1910–1939 | What can be proved, and what can be computed? |
| E2 | 1940–1961 | Can machines be built, programmed, and made to think? |
| E3 | 1962–1969 | How do we make computing efficient, shared, and disciplined? |
| E4 | 1970–1979 | How do we organise data, structure software, and secure it? |
| E5 | 1980–1994 | How do machines cooperate, and how do we manage abstraction? |
| E6 | 1995–2008 | How do we scale to the web and the planet, and build software faster? |
| E7 | 2009–2023 | Can machines learn at scale, and now write code? |

Eras are contiguous year ranges, start and end inclusive, so every paper falls in exactly one era. Papers per era: E1 = CS001–CS005, E2 = CS006–CS014, E3 = CS015–CS026, E4 = CS027–CS043, E5 = CS044–CS054, E6 = CS055–CS067, E7 = CS068–CS079.

### 4.6 `lanes.json`

Ordered list of the 12 lanes with a colour each. Initial order, chosen to place related fields near one another and reduce edge crossings:

Foundations and logic → Information theory → Algorithms and complexity → Programming languages and compilers → Architecture and hardware → Operating systems and systems → Software engineering → Databases → Networks and distributed systems → Security and privacy → HCI and web → AI and machine learning.

Colours must be distinguishable and pass WCAG AA contrast against the background.

## 5. UI requirements

### 5.1 Layout

- Left: the graph canvas filling the window. Right: a detail panel (about 420 px wide) that appears when a node is selected. The panel can be closed.
- A fixed, small legend explains lane, node size and edge types.
- Header with the app title and a one-line how-to.

### 5.2 Canvas

- Inline SVG, rendered with vanilla JS plus D3 scales and zoom. x position is by `year`; y position is by lane.
- Because the span is 1910–2023 but very sparse before 1930, the x-axis uses a **piecewise scale** that compresses 1910–1930 (decided in the plan; default is compression). A visible axis break marks it.
- Nodes in the same lane within a close span of years are stacked into sub-rows by a deterministic collision rule, so no two nodes overlap.
- Node size maps to `conceptual_impact_1_3` (2 = smaller, 3 = larger). Node fill is the lane colour. Ghost nodes are grey and dashed.
- Each node has a short label (a "short title" field in `papers.json`) and a year. Full titles appear in the panel and tooltip.
- Edges are cubic curves. Colour and marker identify the edge type. `explicit` edges are full strength; `interpretive` edges are thinner and lighter. `rival` edges are dashed with no arrowhead.
- Era bands are alternating shaded vertical regions with the era label and question at the top. They remain visible while panning horizontally.
- Pan and zoom with mouse drag, wheel, and on-screen +/−/reset buttons.

### 5.3 Selection and highlighting

- Clicking a node selects it. All ancestors (transitively, along `from → to`) and all descendants stay at full opacity; everything else dims. Edges not on those paths dim too. Ancestry and descendants may use two subtly different tints so direction is clear.
- `rival` edges are not lineage: they are ignored when computing ancestry and descendants. A selected paper's direct rivals are kept visible with a dashed amber ring, so the competing approach is still seen.
- Clicking blank canvas, pressing Esc, or the panel's close button clears the selection.
- Animated pans and zooms are skipped when the OS "reduce motion" setting is on (the moves become instant).
- The selected node's id is written to the URL hash (`#CS004`). Loading a URL with a valid hash selects that node. An invalid hash is ignored.
- Hover shows a tooltip with title, authors, year.

### 5.4 Detail panel (per paper)

In this order:

1. Title, authors, year, work type, field, and a **source link** (opens in a new tab with `rel="noopener noreferrer"`; only `http(s)` URLs are rendered as links).
2. **The problem**
3. **The core insight**, with the analogy
4. **What it unlocked and what it left open**
5. The diagram, and the widget if one exists
6. **Builds on** and **Led to** lists. Each item shows the other paper's title, the edge type, the evidence tag and the "why." Clicking an item selects that paper and scrolls the canvas to it.
7. Metadata strip: `conceptual_impact_1_3`, `practice_impact_1_3`, `inclusion_tier`, tags. Practice impact appears here only, not on the canvas.

### 5.5 Widgets

A small widget library with a common contract: a widget module exports `mount(container, config)` and `destroy()`. About 6–10 widget types, reused across about 10–15 papers. Candidate papers (the final set is chosen in the plan):

| Paper | Candidate widget |
|---|---|
| CS004 Turing | Step-through of a tiny Turing machine |
| CS003 Church | Lambda-term reduction stepper |
| CS008 Shannon | Entropy of a editable symbol distribution |
| CS011 Chomsky | Tiny grammar that generates and accepts strings |
| CS013 Dijkstra | Shortest-path on a small graph, step by step |
| CS016 Quicksort | Partition animation |
| CS021 Amdahl | Slider for serial fraction and processors |
| CS027 Codd | Relational operations on two small tables |
| CS037 / CS040 | Key-exchange and toy-RSA walkthrough |
| CS042 Lamport | Logical clocks on a message diagram |
| CS048 Backprop | One-neuron gradient step |
| CS057 PageRank | Rank iteration on a small web |
| CS063 MapReduce | Word-count map/shuffle/reduce |
| CS075 Attention | Attention weights over a short sentence |

Papers without a widget show a static SVG diagram and nothing else extra.

## 6. Non-functional requirements

- **Browsers:** latest Chrome, Edge and Firefox on desktop; minimum viewport 1280 × 720.
- **Performance:** initial render of 79 + ghost nodes and ~150 edges in under 1 s on a typical laptop; selection highlight updates in under 100 ms; pan/zoom stays smooth (no dropped frames noticeable at this size).
- **Offline:** works with no network once served locally. No CDN or remote font, script or image.
- **Security/robustness:** all content from JSON is inserted with `textContent` or a restricted renderer, never raw `innerHTML` from data. External links are validated as `http(s)`. Each missing or malformed data file produces a visible error, not a blank page.
- **Theme:** a light/dark toggle in the header (added after M2 at the author's request). It starts from the saved choice, else the operating system's preference, and follows the OS live until the user chooses. The choice is saved in `localStorage` (guarded, since storage can be blocked) and applied as `data-theme` on `<html>` by a tiny inline script before first paint, so there is no flash. All colours come from CSS tokens; diagrams stay on a white card in both themes because they are drawn for a light background.
- **Accessibility (baseline):** sufficient colour contrast; edge types are distinguishable by more than colour (marker/dash); panel is a real landmark with readable text; text uses relative units. Full keyboard navigation of the graph is **not** a v1 goal, but selecting a paper from the panel's lists must work via keyboard.
- **Maintainability:** modular ES modules (`data`, `layout`, `graph`, `panel`, `widgets/*`); data separate from code; no global state beyond a single store.

## 7. Data integrity rules (checked by an in-browser validator)

A `tests/validate.html` page, run through Live Server, loads all data and reports PASS/FAIL for:

1. Every CSV-derived paper has an entry in `explanations.json`.
2. Every explanation has all required sections and falls within 300–500 words.
3. Every paper (not ghost) is the `from` or `to` of **at least one** edge. This directly encodes the narrate-a-chain test.
4. Every edge has valid endpoints, a valid `type` and `evidence`, and a non-empty `why` ≤ 40 words.
5. `from.year ≤ to.year` for every edge, except that a `rival` edge may go either way round when the two years differ by at most 2 (near-simultaneous independent solutions). A rival that goes forward in time is always fine.
6. No ghost node is an edge target.
7. Every referenced diagram file and widget config exists.
8. No duplicate ids; no dangling era or lane references.
9. The graph is acyclic when `rival` edges are excluded.

## 8. Testing and verification

- The validator above covers data integrity.
- Layout logic (collision/stacking, piecewise scale, ancestor/descendant traversal) is pure functions with small unit tests in `tests/` runnable in the browser.
- Manual checklist per milestone (in `plan.md`): load, select, deep link, pan/zoom, panel navigation, widget mount/destroy, hash invalid.
- Content acceptance: the author performs the narrate-a-chain test on five randomly chosen papers.

## 9. Boundaries

**Always:** keep the CSV-derived facts accurate; label interpretive edges; keep the app dependency-free apart from vendored D3; keep authored text free of text copied from the papers (short quoted phrases only, with attribution).

**Ask first:** adding or removing a paper or ghost node; changing the edge-type vocabulary; adding a new library; changing the era boundaries after they've been reviewed.

**Never:** invent a citation relationship and tag it `explicit`; fetch anything remote at runtime; render untrusted data with `innerHTML`.

## 10. Open items to settle during the build

1. Final era boundaries (proposed in §4.5).
2. The final ghost-node list (proposed in §4.4).
3. The final list of ~10–15 widget papers (candidates in §5.5).
4. Short labels for the 79 nodes.
5. Whether to compress 1910–1930 on the axis (default: yes).
6. A visual style direction (palette and typography), chosen at the walking-skeleton milestone and reviewed by the author.
