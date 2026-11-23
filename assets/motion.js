/* Hemline theme by ZeronKit (https://zeronkit.com). Free theme - not for resale or redistribution. © 2026 ZeronKit. */
/*
  Reveal on scroll with a short stagger. Loaded only when animations are on and the shopper
  has not asked for reduced motion. Content stays visible if this file never runs.
*/

const targets = [
  '.hm-section__head',
  '.hm-grid > li',
  '.hm-palette',
  '.hm-outfit__slot',
  '.hm-outfit__summary',
  '.hm-drop__head',
  '.hm-canvas__inner > *',
  '.hm-collection__head',
  '.hm-footer__block',
  '.hm-404__art',
  '.hm-404__copy'
].join(',');

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('is-in');
    observer.unobserve(entry.target);
  }
}, { rootMargin: '0px 0px 25% 0px', threshold: 0 });

const prepare = (root = document) => {
  root.querySelectorAll(targets).forEach((el) => {
    if (el.classList.contains('hm-reveal') || el.closest('.hm-hero, dialog, .hm-header-section')) return;
    const siblings = el.parentElement ? [...el.parentElement.children] : [el];
    el.style.setProperty('--hm-i', String(Math.min(siblings.indexOf(el) % 6, 5)));
    el.classList.add('hm-reveal');
    // Anything already scrolled past or on screen is shown straight away.
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
    else observer.observe(el);
  });
};

prepare();
document.documentElement.classList.add('hm-motion-ready');
document.addEventListener('shopify:section:load', (event) => prepare(event.target));

// New grid content from filtering or recommendations appears without waiting for a scroll.
new MutationObserver((records) => {
  for (const record of records) {
    record.addedNodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      prepare(node.parentElement || node);
      node.querySelectorAll?.('.hm-reveal').forEach((el) => el.classList.add('is-in'));
      if (node.classList?.contains('hm-reveal')) node.classList.add('is-in');
    });
  }
}).observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
