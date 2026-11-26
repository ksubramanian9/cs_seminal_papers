# The Progression of Thought in Computer Science

An interactive map of how ideas in computer science led to one another. It is built around 79 seminal works, from *Principia Mathematica* (1910) to SWE-bench (2023).

It is not meant as a reading list. The goal is to see *why* each idea arose: what problem the field was stuck on, what insight broke it open, and what new problem that created for the next generation.

> Pick any paper. From the app alone, you should be able to explain what led to it and what it enabled, two to three hops back and forward, in your own words.

## What you see

- **One canvas, two axes.** Left to right is time. Each horizontal lane is a field (foundations and logic, algorithms, databases, networks, AI and machine learning, and seven more). The canvas shows when each idea appeared and where it came from at the same time.
- **Eras that ask questions.** The timeline is divided into seven eras. Each is labelled with the question the field was asking then, such as "What can be proved, and what can be computed?" (1910–1939) or "Can machines learn at scale, and now write code?" (2009–2023).
- **Links that carry reasoning.** About 150 directed edges connect the papers. Each has a type (*builds on*, *generalizes*, *overcomes a limit*, *moves to a new domain*, or *rival*) and a one-sentence "why" that names the step from one idea to the next.
- **Honesty about certainty.** Each link is tagged *explicit* if the later work credits the earlier one, or *interpretive* if it is a historian's reading. Interpretive links are drawn lighter, so you can always tell fact from judgement.
- **Context nodes.** Twenty grey "ghost" nodes, such as Boole, ENIAC, ARPANET and the Perceptron, stand for outside influences so that the early links have a real source.

## How to use it

Click a paper to select it. Its whole ancestry and all its descendants stay lit, and the rest of the map dims. A side panel then explains the paper in about 400 words, written for a smart non-specialist:

1. The problem it faced
2. The core insight, with an analogy
3. What it unlocked, and what it left open
4. A diagram, and for some papers an interactive widget
5. What it builds on and what it led to, with the reason for each link

Drag to pan and scroll to zoom. Press Esc to clear the selection. Each selection is written to the URL (for example `#CS004` for Turing), so you can link straight to a paper. A light/dark toggle is in the header.

### Widgets

Some ideas are easier to understand by playing with them, so 12 papers get a small interactive widget built from five reusable types:

| Type | Papers |
|---|---|
| Stepper | Church's lambda calculus, Turing machines, Dijkstra's shortest paths, Quicksort |
| Slider model | Shannon's information theory, Amdahl's law, Brooks's law, differential privacy |
| Graph iteration | PageRank |
| Training loop | Backpropagation, GANs |
| Message simulator | Paxos |

The stepper and slider widgets are built. The other three types are in progress. Every other paper has a static diagram.

## Running it

It is a static site with no build step and no server code: plain HTML, CSS, JavaScript, JSON and SVG, plus a local copy of D3 in `vendor/`. It fetches nothing from the internet at run time.

Because it loads its data with `fetch()`, it has to be served over HTTP rather than opened as a file. The simplest way is VS Code's **Live Server** extension: open the folder and choose "Open with Live Server" on `index.html`. Any static file server works too, for example `python -m http.server`.

It is designed for desktop browsers (current Chrome, Edge and Firefox) at 1280 × 720 or larger.

## How it is organised

| Path | What it holds |
|---|---|
| `index.html`, `css/`, `js/` | The app. `js/widgets/` holds the widget types and their per-paper models |
| `data/papers.json` | The 79 papers, converted once from the source CSV and edited by hand since |
| `data/explanations.json` | The authored explanation for each paper |
| `data/edges.json` | The links between papers, with type, evidence and "why" |
| `data/eras.json`, `data/lanes.json`, `data/ghosts.json` | Eras with their questions, the field lanes and their colours, and the context nodes |
| `diagrams/` | One SVG diagram per paper |
| `widgets/` | One config file per widget paper |
| `content/` | The diagram style guide and the queue of claims still to be checked |
| `docs/` | Notes on works that could be added to the corpus |
| `tests/` | Browser test pages (see below) |
| `intent.md`, `spec.md`, `plan.md` | Why the project exists, what it must do, and how it is being built |

The JSON files are the source of truth. To add a link, add an entry to `data/edges.json`:

```json
{ "id": "E145", "from": "CS004", "to": "CS007", "type": "builds_on",
  "evidence": "explicit", "why": "One sentence, at most 40 words, naming the step from one idea to the next." }
```

`from` is the earlier work. `type` is one of `builds_on`, `generalizes`, `overcomes_limit`, `new_domain` or `rival`, and `evidence` is `explicit` or `interpretive`. Section 4 of [spec.md](spec.md) describes every data file in full.

## Checking it

Open these pages through the same server. Each one's title reads ALL PASSED when everything is fine, and the page lists every check.

- `tests/validate.html` checks the data. It confirms that every paper has an explanation and at least one link, that every link is well formed and points forward in time, that every referenced file exists, and that the lineage has no cycles. Add `?strict=1` for the full definition of done.
- `tests/unit.html` runs the unit tests for layout, labels, traversal, the validator, the theme and the widgets.
- `tests/smoke.html` loads the real app and drives it. Run it in a window of at least 1500 × 900.

## Status

All 79 papers are written up and linked, with a diagram each. Work remaining: the last three widget types, a planned expansion of the corpus, and a final round of polish and browser checks. See [plan.md](plan.md) for details.

The explanations, links and era framing were written for this project. The source CSV supplies only the facts about each paper. Claims that need checking against the original sources are tracked in [content/REVIEW_QUEUE.md](content/REVIEW_QUEUE.md).
