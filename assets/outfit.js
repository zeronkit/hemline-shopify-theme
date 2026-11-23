/* Hemline theme by ZeronKit (https://zeronkit.com). Free theme - not for resale or redistribution. © 2026 ZeronKit. */
/*
  Outfit Builder: one choice per slot, live total, one request to add the whole look.
*/

const { addItems, announce, strings = {} } = window.Hemline || {};

class HmOutfit extends HTMLElement {
  connectedCallback() {
    this.formatter = new Intl.NumberFormat(document.documentElement.lang || undefined, {
      style: 'currency',
      currency: this.dataset.currency || 'USD'
    });
    this.button = this.querySelector('[data-hm-add-look]');
    this.status = this.querySelector('[data-hm-outfit-status]');
    this.querySelectorAll('[data-hm-slot]').forEach((slot) => {
      const checked = slot.querySelector('[data-hm-pick]:checked');
      if (!checked || checked.disabled) {
        const firstOpen = slot.querySelector('[data-hm-pick]:not(:disabled)');
        if (firstOpen) firstOpen.checked = true;
      }
    });
    this.addEventListener('change', () => this.refresh());
    this.button?.addEventListener('click', () => this.addLook());
    this.refresh();
  }

  /* Returns one { slot, variantId, price, image } per included slot. */
  selection() {
    return [...this.querySelectorAll('[data-hm-slot]')].map((slot) => {
      const include = slot.querySelector('[data-hm-include]');
      const included = !include || include.checked;
      slot.classList.toggle('is-skipped', !included);
      const pick = slot.querySelector('[data-hm-pick]:checked');
      slot.querySelectorAll('[data-hm-variant-for]').forEach((box) => {
        box.hidden = !pick || box.dataset.hmVariantFor !== pick.value;
      });
      if (!included || !pick || pick.disabled) return null;
      const field = slot.querySelector(`[data-hm-variant-for="${pick.value}"] [data-hm-variant]`);
      if (!field) return null;
      const option = field.tagName === 'SELECT' ? field.selectedOptions[0] : field;
      if (!option || option.disabled) return null;
      return {
        variantId: Number(field.value),
        price: Number(option.dataset.price || 0),
        image: pick.nextElementSibling?.querySelector('img')
      };
    }).filter(Boolean);
  }

  refresh() {
    const items = this.selection();
    const total = items.reduce((sum, item) => sum + item.price, 0) / 100;
    const output = this.querySelector('[data-hm-total]');
    if (output) output.textContent = this.formatter.format(total);
    const collage = this.querySelector('[data-hm-collage]');
    if (collage) {
      collage.replaceChildren(...items.filter((item) => item.image).map((item) => {
        const img = item.image.cloneNode();
        img.removeAttribute('loading');
        img.alt = '';
        return img;
      }));
    }
    if (this.button) this.button.disabled = items.length === 0;
  }

  async addLook() {
    const items = this.selection();
    if (!items.length || !addItems) return;
    this.button.setAttribute('aria-busy', 'true');
    this.status.textContent = '';
    try {
      await addItems(items.map((item) => ({ id: item.variantId, quantity: 1 })));
      this.status.textContent = strings.outfitAdded || '';
      announce?.(strings.outfitAdded);
    } catch (error) {
      this.status.textContent = error.message || strings.error || '';
    } finally {
      this.button.removeAttribute('aria-busy');
    }
  }
}

if (!customElements.get('hm-outfit')) customElements.define('hm-outfit', HmOutfit);
