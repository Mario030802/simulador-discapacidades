import type { Page } from "puppeteer";

// Mide el contraste WCAG 2.1 DENTRO de la página renderizada por Puppeteer.
// El código corre en el contexto del navegador (ahí sí existen document /
// getComputedStyle); se pasa como STRING a page.evaluate para no chocar con los
// tipos de Node en el backend. Devuelve una lista de hallazgos (string[]),
// uno por elemento con texto directo cuyo ratio texto/fondo no cumple el umbral AA.
//
// Umbral AA: 4.5:1 texto normal, 3.0:1 texto grande (>=24px, o >=18.66px en negrita).
// Fondo efectivo: sube por ancestros componiendo alfa sobre blanco; si hay
// background-image/gradiente no se puede determinar el color y se salta el elemento
// (mejor no marcar que dar falso positivo).
const BROWSER_CONTRAST = `
(() => {
  const MAX = 100;
  const findings = [];
  let extra = 0;

  function parseColor(str) {
    const m = str && str.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const parts = m[1].split(',').map(function (s) { return parseFloat(s.trim()); });
    const a = parts.length >= 4 ? parts[3] : 1;
    return { r: parts[0], g: parts[1], b: parts[2], a: a };
  }
  function over(fg, bg) {
    const a = fg.a;
    return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
  }
  function effectiveBg(el) {
    const stack = [];
    let node = el;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; }
      node = node.parentElement;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  }
  function chan(v) { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * chan(c.r) + 0.7152 * chan(c.g) + 0.0722 * chan(c.b); }
  function ratio(c1, c2) { const l1 = lum(c1), l2 = lum(c2); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); }
  function hasDirectText(el) {
    const kids = el.childNodes;
    for (let i = 0; i < kids.length; i++) { const n = kids[i]; if (n.nodeType === 3 && n.textContent.trim().length > 0) return true; }
    return false;
  }

  if (!document.body) return findings;
  const els = [document.body].concat(Array.prototype.slice.call(document.body.querySelectorAll('*')));
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    try {
      if (!hasDirectText(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const bg = effectiveBg(el);
      if (!bg) continue;
      let fg = parseColor(cs.color);
      if (!fg || fg.a === 0) continue;
      if (fg.a < 1) fg = over(fg, bg);
      const fs = parseFloat(cs.fontSize) || 16;
      let weight = parseInt(cs.fontWeight, 10);
      if (!weight) weight = (cs.fontWeight === 'bold' ? 700 : 400);
      const large = fs >= 24 || (fs >= 18.66 && weight >= 700);
      const threshold = large ? 3.0 : 4.5;
      const r = ratio(fg, bg);
      if (r < threshold) {
        if (findings.length < MAX) {
          const txt = (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 40);
          findings.push('Contraste bajo ' + r.toFixed(2) + ':1 (mín ' + threshold + ') en <' + el.tagName.toLowerCase() + '>: ' + txt);
        } else { extra++; }
      }
    } catch (e) { /* saltar elemento problemático */ }
  }
  if (extra > 0) findings.push('… y ' + extra + ' más con contraste bajo');
  return findings;
})()
`;

export async function measureContrast(page: Page): Promise<string[]> {
  try {
    const result = await page.evaluate(BROWSER_CONTRAST);
    return Array.isArray(result) ? (result as string[]) : [];
  } catch (e) {
    console.error("measureContrast falló:", e);
    return [];
  }
}
