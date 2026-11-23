/* Hemline theme by ZeronKit (https://zeronkit.com). Free theme - not for resale or redistribution. © 2026 ZeronKit. */
/* Signature: ZK-HEMLINE-0DAC1CE1043A */
/*
  Small core of web components. No dependencies, no build step.
  Header, product, search, navigator, facets and outfit modules load only when needed.
*/

const config = JSON.parse(document.getElementById('hm-config')?.textContent || '{}');
const strings = config.strings || {};
const routes = config.routes || {};
const modules = config.modules || {};

const announce = (message) => {
  const live = document.getElementById('hm-live');
  if (!live || !message) return;
  live.textContent = '';
  window.setTimeout(() => { live.textContent = message; }, 50);
};

const parseHTML = (html) => new DOMParser().parseFromString(html, 'text/html');

const defineOnce = (name, constructor) => {
  if (!customElements.get(name)) customElements.define(name, constructor);
};

/* ---------- Dialogs: navigator, search, drawers, size guide ---------- */
let lastOpener = null;

const openDialog = (dialog, opener) => {
  if (!dialog || dialog.open) return;
  lastOpener = opener || document.activeElement;
  dialog.showModal();
  dialog.dispatchEvent(new CustomEvent('hm:open', { detail: { opener } }));
};

const reducedMotion = () => document.documentElement.dataset.motion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Plays the closing animation (unless reduced motion is on), then closes the dialog.
const closeDialog = (dialog) => {
  if (!dialog?.open || dialog.classList.contains('is-closing')) return;
  if (reducedMotion()) {
    dialog.close();
    return;
  }
  dialog.classList.add('is-closing');
  const done = () => {
    dialog.classList.remove('is-closing');
    if (dialog.open) dialog.close();
  };
  dialog.addEventListener('animationend', done, { once: true });
  window.setTimeout(done, 450);
};

// Esc fires "cancel": run the same animated close.
document.addEventListener('cancel', (event) => {
  if (event.target instanceof HTMLDialogElement) {
    event.preventDefault();
    closeDialog(event.target);
  }
}, true);

document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-hm-open]');
  if (opener) {
    const dialog = document.getElementById(opener.dataset.hmOpen);
    if (dialog) {
      event.preventDefault();
      // The navigator script is imported on first use, then the dialog opens.
      const ready = dialog.querySelector('hm-navigator') && modules.navigator ? import(modules.navigator).catch(() => {}) : Promise.resolve();
      ready.then(() => openDialog(dialog, opener));
    }
    return;
  }
  const closer = event.target.closest('[data-hm-close]');
  if (closer) {
    closeDialog(closer.closest('dialog'));
    return;
  }
  // A click on the backdrop lands on the dialog element itself, outside its box.
  if (event.target instanceof HTMLDialogElement && event.target.open) {
    const rect = event.target.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) closeDialog(event.target);
  }
});

document.addEventListener('close', (event) => {
  if (event.target instanceof HTMLDialogElement && lastOpener && document.contains(lastOpener)) {
    lastOpener.focus({ preventScroll: true });
  }
}, true);

/* ---------- Quantity stepper ---------- */
class HmQuantity extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input');
    this.addEventListener('click', (event) => {
      const button = event.target.closest('[data-step]');
      if (!button) return;
      const min = Number(this.input.min || 0);
      const next = Math.max(min, Number(this.input.value || 0) + Number(button.dataset.step));
      if (next === Number(this.input.value)) return;
      this.input.value = next;
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}
defineOnce('hm-quantity', HmQuantity);

/* ---------- Cart ---------- */
const cartSectionIds = () => {
  const ids = new Set();
  document.querySelectorAll('hm-cart[data-section-id]').forEach((el) => ids.add(el.dataset.sectionId));
  if (config.cartType === 'drawer' && document.getElementById('CartDrawer')) ids.add('cart-drawer');
  return [...ids];
};

const renderCartSections = (sections) => {
  if (!sections) return;
  let count = null;
  let label = null;
  document.querySelectorAll('hm-cart[data-section-id]').forEach((cart) => {
    const html = sections[cart.dataset.sectionId];
    if (!html) return;
    const fresh = parseHTML(html).querySelector('[data-hm-cart-content]');
    const current = cart.querySelector('[data-hm-cart-content]');
    if (fresh && current) {
      current.replaceWith(fresh);
      count = fresh.dataset.count;
      label = fresh.dataset.countLabel;
    }
  });
  if (count !== null) {
    document.querySelectorAll('[data-hm-cart-count]').forEach((el) => {
      el.textContent = count;
      el.hidden = Number(count) === 0;
    });
    document.querySelectorAll('[data-hm-cart-label]').forEach((el) => { el.textContent = label; });
  }
};

const readJSON = async (response) => {
  const data = await response.json();
  if (!response.ok || data.status) throw new Error(data.description || data.message || strings.error);
  return data;
};

const postJSON = async (url, body) => readJSON(await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify(body)
}));

const afterAdd = (data) => {
  const drawer = document.getElementById('CartDrawer');
  if (config.cartType !== 'drawer' || !drawer) {
    window.location.href = routes.cart;
    return;
  }
  renderCartSections(data.sections);
  openDialog(drawer);
  announce(strings.added);
};

/* Used by the outfit builder to add several items in one request. */
const addItems = async (items) => {
  const data = await postJSON(`${routes.cartAdd}.js`, { items, sections: cartSectionIds().join(',') });
  afterAdd(data);
  return data;
};

class HmCart extends HTMLElement {
  connectedCallback() {
    this.addEventListener('change', (event) => {
      const input = event.target.closest('input[data-line]');
      if (input) {
        window.clearTimeout(this.timer);
        this.timer = window.setTimeout(() => this.update(input.dataset.line, Number(input.value)), 300);
      }
      if (event.target.matches('[data-hm-note]')) {
        postJSON(`${routes.cart}/update.js`, { note: event.target.value }).catch(() => {});
      }
    });
    this.addEventListener('click', (event) => {
      const remove = event.target.closest('[data-hm-remove]');
      if (remove) this.update(remove.dataset.hmRemove, 0);
    });
  }

  async update(line, quantity) {
    const row = this.querySelector(`.hm-line[data-line="${line}"]`);
    row?.setAttribute('aria-busy', 'true');
    try {
      const data = await postJSON(`${routes.cartChange}.js`, { line: Number(line), quantity, sections: cartSectionIds().join(',') });
      renderCartSections(data.sections);
      const target = this.querySelector(`input[data-line="${line}"]`) || this.querySelector('input[data-line]') || this.querySelector('[data-hm-cart-content] a');
      target?.focus({ preventScroll: true });
    } catch (error) {
      row?.removeAttribute('aria-busy');
      const message = row?.querySelector('[data-hm-line-error]');
      if (message) {
        message.textContent = error.message;
        message.hidden = false;
      }
    }
  }
}
defineOnce('hm-cart', HmCart);

document.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-hm-cart-toggle]');
  const drawer = document.getElementById('CartDrawer');
  if (toggle && drawer && config.cartType === 'drawer') {
    event.preventDefault();
    openDialog(drawer, toggle);
  }
});



/* ---------- Search dialog ---------- */
document.getElementById('SearchDialog')?.addEventListener('hm:open', (event) => {
  if (modules.search) import(modules.search);
  event.currentTarget.querySelector('input[type="search"]')?.focus();
});

/* ---------- Lazy modules (import on need) ---------- */
window.Hemline = { addItems, announce, parseHTML, strings, routes, afterAdd, readJSON, cartSectionIds, closeDialog };

const loadModules = () => {
  if (modules.product && document.querySelector('hm-product, hm-product-form, hm-recommendations, hm-pickup, hm-deferred-media, hm-model, hm-ambient-video')) import(modules.product);
  if (modules.header && document.querySelector('hm-header, hm-announce')) import(modules.header);
  if (modules.motion && !reducedMotion()) import(modules.motion);
  if (modules.cards && document.querySelector('[data-hm-card-swatch]')) import(modules.cards);
  if (modules.slider && document.querySelector('hm-slider')) import(modules.slider);
  if (modules.search && document.querySelector('main [data-hm-recent], [data-hm-search-collections]')) import(modules.search);
  if (modules.facets && document.querySelector('hm-facets')) import(modules.facets);
  if (modules.outfit && document.querySelector('hm-outfit')) import(modules.outfit);
  if (modules.search && document.activeElement?.closest?.('hm-predictive-search')) import(modules.search);
};
loadModules();
document.addEventListener('shopify:section:load', loadModules);
document.addEventListener('pointerover', (event) => {
  if (modules.navigator && event.target.closest?.('[data-hm-open="Navigator"]')) import(modules.navigator);
}, { passive: true });
document.addEventListener('focusin', (event) => {
  if (modules.navigator && event.target.closest?.('[data-hm-open="Navigator"]')) import(modules.navigator);
  if (modules.search && event.target.closest?.('hm-predictive-search')) import(modules.search);
});
