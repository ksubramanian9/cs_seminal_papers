/*
 * Detail panel. Everything from data goes in via textContent; the source link is rendered
 * only for http(s) URLs; diagrams are loaded through <img> (never inlined), so an SVG can
 * not run script on this page.
 *
 * show(model) where model = {
 *   paper,                      // a papers.json entry
 *   explanation,                // an explanations.json entry, or null if not written yet
 *   groups: { drewOn, ledTo, rivals }   // arrays of { edge, other }, other = { id, title, year, ghost, blurb }
 * }
 */

const ROOT_URL = new URL('../', import.meta.url);

function h(tag, props = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else n.setAttribute(k, v);
  }
  for (const c of children) if (c != null) n.append(c);
  return n;
}

const isHttpUrl = (u) => /^https?:\/\//i.test(u || '');

/** How an edge reads from each side. `to` is the later paper, `from` the earlier one. */
const PHRASE = {
  drewOn: {
    builds_on: 'This paper builds on it',
    generalizes: 'This paper generalizes it',
    overcomes_limit: 'This paper overcomes a limit of it',
    new_domain: 'This paper applies it in a new domain',
  },
  ledTo: {
    builds_on: 'It builds on this paper',
    generalizes: 'It generalizes this paper',
    overcomes_limit: 'It overcomes a limit of this paper',
    new_domain: 'It applies this paper in a new domain',
  },
  rival: 'Rival approach to the same problem',
};

const EVIDENCE_TITLE = {
  explicit: 'Explicit: the later work cites or credits the earlier one.',
  interpretive: 'Interpretive: a reading of how the ideas connect, not a citation.',
};

function section(title, text, cls = '') {
  if (!text) return null;
  return h('section', { class: `panel-section ${cls}`.trim() }, h('h3', {}, title), h('p', {}, text));
}

function linkItem(kind, { edge, other }, onNavigate) {
  const phrase = edge.type === 'rival' ? PHRASE.rival : PHRASE[kind]?.[edge.type] || edge.type;
  const inner = [
    h('span', { class: 'link-title' }, other.title),
    h('span', { class: 'link-year' }, ` (${other.year})${other.ghost ? ', outside the list' : ''}`),
    h('span', { class: 'link-meta' },
      h('span', { class: `link-type t-${edge.type}` }, phrase),
      h('span', { class: `badge ev-${edge.evidence}`, title: EVIDENCE_TITLE[edge.evidence] || '' }, edge.evidence)),
    h('span', { class: 'link-why' }, edge.why),
  ];
  if (other.ghost) {
    return h('li', { class: 'link-item ghost' }, h('div', { class: 'link-body' }, ...inner),
      other.blurb ? h('p', { class: 'link-blurb' }, other.blurb) : null);
  }
  const btn = h('button', { type: 'button', class: 'link-body', 'data-goto': other.id }, ...inner);
  btn.addEventListener('click', () => onNavigate?.(other.id));
  return h('li', { class: 'link-item' }, btn);
}

function linkGroup(title, kind, items, onNavigate) {
  if (!items.length) return null;
  return h('section', { class: 'panel-section links' },
    h('h3', {}, title),
    h('ul', { class: 'link-list' }, ...items.map((it) => linkItem(kind, it, onNavigate))));
}

function diagram(explanation) {
  if (!explanation?.diagram) return null;
  const img = h('img', {
    class: 'diagram', src: new URL(explanation.diagram, ROOT_URL).href,
    alt: explanation.diagram_alt || 'Diagram', loading: 'lazy',
  });
  const fig = h('figure', { class: 'panel-section figure' }, img);
  img.addEventListener('error', () => {
    fig.textContent = '';
    fig.append(h('p', { class: 'diagram-missing' }, 'Diagram unavailable.'));
  });
  return fig;
}

export function createPanel(root, { onClose, onNavigate } = {}) {
  function show(model) {
    const { paper, explanation, groups } = model;
    root.textContent = '';

    const close = h('button', { type: 'button', class: 'panel-close', 'aria-label': 'Close details' }, '×');
    close.addEventListener('click', () => onClose?.());

    const header = [
      close,
      h('h2', {}, paper.title),
      h('p', { class: 'panel-meta' }, `${paper.authors} · ${paper.year} · ${paper.work_type}`),
    ];
    if (isHttpUrl(paper.source_url)) {
      header.push(h('p', { class: 'source' },
        h('a', { href: paper.source_url, target: '_blank', rel: 'noopener noreferrer' }, 'Read the original ↗')));
    }
    // Optional parts (an empty link group, a missing section) come back as null. Element.append()
    // would print the text "null" for those, so every append goes through this filter.
    const add = (...nodes) => root.append(...nodes.filter((n) => n != null));
    add(...header);

    if (explanation) {
      add(
        paper.central_idea ? h('p', { class: 'one-line' }, paper.central_idea) : null,
        section('The problem', explanation.problem),
        section('The core insight', explanation.insight),
        section('An analogy', explanation.analogy, 'analogy'),
        section('What it unlocked', explanation.unlocked),
        section('What it left open', explanation.left_open),
        diagram(explanation),
      );
    } else {
      add(
        section('Central idea', paper.central_idea),
        section('Conceptual shift', paper.conceptual_shift),
        section('Impact on practice', paper.practice_impact),
        h('p', { class: 'placeholder-note' },
          'The full explanation for this paper has not been written yet (milestone M3). The links below are provisional.'),
      );
    }

    add(
      linkGroup('What this paper drew on', 'drewOn', groups.drewOn, onNavigate),
      linkGroup('What it led to', 'ledTo', groups.ledTo, onNavigate),
      linkGroup('Rival approaches', 'rival', groups.rivals, onNavigate),
    );

    add(h('section', { class: 'panel-section metadata' },
      h('h3', {}, 'About this entry'),
      h('p', { class: 'chips' },
        h('span', { class: 'chip' }, paper.primary_field),
        h('span', { class: 'chip' }, `Conceptual impact ${paper.conceptual_impact_1_3}/3`),
        h('span', { class: 'chip' }, `Practice impact ${paper.practice_impact_1_3}/3`),
        h('span', { class: 'chip' }, paper.inclusion_tier),
        ...(paper.tags || []).map((t) => h('span', { class: 'chip tag' }, t))),
      paper.curatorial_note ? h('p', { class: 'curator' }, `Curator’s note: ${paper.curatorial_note}`) : null));

    root.hidden = false;
    root.scrollTop = 0;
    close.focus({ preventScroll: true });
  }

  function hide() {
    root.hidden = true;
    root.textContent = '';
  }

  return { show, hide };
}
