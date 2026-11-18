# Intent: The Progression of Thought in Computer Science

## Purpose

Build a browser-only interactive app that lets one person **understand how ideas in computer science led to one another**, using the 79 seminal works in `Seminal_Computer_Science_Works_1900-2026 (1).csv` (1910–2023) as the spine.

The goal is not a catalogue of famous papers. It is to see *why* each idea arose: what problem the field was stuck on, what insight broke it open, and what new problem that created for the next generation.

## Who it is for

A single curious learner (the author) with a general technical background, not a specialist in each subfield. Explanations are idea-level, written for a smart non-specialist. No audience beyond that is assumed for v1.

## The core promise

> Pick any paper. From the app alone, you can explain what led to it and what it enabled, two to three hops back and forward, in your own words.

This is the acceptance test for the whole project. Every design choice is judged against it.

## What makes it different from a reading list

1. **Links carry reasoning.** Every connection between papers is a typed, directed edge with a one-sentence "why." You read the intellectual move, not just see a line.
2. **Time and field are both visible.** One canvas shows when each idea appeared (x-axis) and which part of CS it belongs to (lanes), so chronology and cross-field influence are legible together.
3. **Eras ask questions.** The timeline is divided into eras, each framed by the question the field was asking at the time ("What can be computed?", "How do we share one machine?"). The progression reads as a story before anything is clicked.
4. **Honest about certainty.** Each link is tagged *explicit* (the later work credits or cites the earlier) or *interpretive* (a historian's reading). The reader always knows which is fact and which is judgement.

## Principles

- **Understanding over completeness.** Fewer, better-explained connections beat dense, unexplained ones.
- **Idea-level, not formal.** The mechanism is explained through problem, insight and analogy. Formalism is avoided unless a small widget makes it tangible.
- **Browser technologies only.** HTML, CSS, JS, JSON, SVG, plus a vendored copy of D3. No build step, no server code. Run with Live Server.
- **Closed, curated corpus.** The CSV defines the papers. A small number of clearly marked ghost nodes supply outside influences so edges have a real source.
- **Content is authored, not scraped.** The CSV provides the facts per paper. The explanations, edges and era framing are written deliberately and reviewed.

## Out of scope for v1 (deliberately)

Path-finding between two papers; filters; free-text search; a guided "story" or tour mode; phone and tablet support; per-paper bespoke simulators (reusable widgets for a handful of papers only); editing the corpus from inside the app.

## Success looks like

- All 79 papers have an idea-level explanation and at least one annotated edge.
- Selecting a paper lights up its full ancestry and descendants.
- Era bands make the overall progression readable at a glance.
- The author can pass the narrate-a-chain test on any paper chosen at random.
