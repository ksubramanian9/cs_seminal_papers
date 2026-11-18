import { start } from './app.js';
import { createThemeToggle } from './theme.js';

// Theme first, so the toggle works even if the data fails to load.
createThemeToggle(document.getElementById('theme-toggle'));

const app = await start({
  canvasEl: document.getElementById('canvas'),
  panelEl: document.getElementById('panel'),
  errorEl: document.getElementById('error'),
});
if (app) window.__DATA__ = app.data; // handy for console inspection during development
