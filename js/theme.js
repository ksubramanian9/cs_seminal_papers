/*
 * Light/dark theme. The choice is stored in localStorage (wrapped, because storage can be
 * blocked or throw in private windows) and applied as <html data-theme="light|dark">.
 * With no saved choice the operating system's preference is used, and follows it live.
 * index.html runs a tiny inline script first so the page never flashes the wrong theme.
 */

export const STORAGE_KEY = 'cs-theme';
export const THEMES = ['light', 'dark'];

/** Which theme applies, given a saved value (maybe junk or null) and the OS preference. */
export function resolveTheme({ stored, prefersDark }) {
  return THEMES.includes(stored) ? stored : prefersDark ? 'dark' : 'light';
}

/** localStorage that never throws. */
export function safeStorage() {
  return {
    get() { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } },
    set(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch { /* blocked: the choice just lasts for this visit */ } },
  };
}

/**
 * Wire a button as the theme toggle.
 * options (all optional, for tests): root (element getting data-theme), storage, media (a MediaQueryList-like).
 */
export function createThemeToggle(button, {
  root = document.documentElement,
  storage = safeStorage(),
  media = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null,
} = {}) {
  const current = () => resolveTheme({ stored: storage.get(), prefersDark: !!media?.matches });

  function paint(theme) {
    root.dataset.theme = theme;
    const next = theme === 'dark' ? 'light' : 'dark';
    // The button names the theme you will get, which is how most people read a toggle.
    button.textContent = '';
    const icon = document.createElement('span');
    icon.className = 'theme-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = next === 'dark' ? '☾' : '☀'; // crescent moon / sun
    const label = document.createElement('span');
    label.textContent = next === 'dark' ? 'Dark' : 'Light';
    button.append(icon, label);
    button.setAttribute('aria-label', `Switch to ${next} theme`);
    button.title = `Switch to ${next} theme`;
  }

  const onClick = () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    storage.set(next);
    paint(next);
  };
  const onOsChange = () => { if (!THEMES.includes(storage.get())) paint(current()); };

  button.addEventListener('click', onClick);
  media?.addEventListener?.('change', onOsChange);
  paint(current());

  return {
    get theme() { return root.dataset.theme; },
    destroy() {
      button.removeEventListener('click', onClick);
      media?.removeEventListener?.('change', onOsChange);
    },
  };
}
