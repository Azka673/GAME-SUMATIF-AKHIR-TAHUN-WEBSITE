/** Inventory & lost item management */
import { ITEM_META } from './world.js';

export class Inventory {
  constructor(game) {
    this.game = game;
    this.items = [];
    this.maxSlots = 20;
    this.selectedIndex = -1;
    this.panel = document.getElementById('inventory-panel');
    this.grid = document.getElementById('inventory-grid');
    this.detail = document.getElementById('inventory-detail');
  }

  addItem(item) {
    if (this.items.length >= this.maxSlots) return false;
    this.items.push({ ...item, collectedAt: Date.now() });
    this.game.ui?.notify(`Collected: ${item.meta?.name || item.type}`, 'success');
    return true;
  }

  removeItem(id) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx >= 0) this.items.splice(idx, 1);
  }

  getSelected() {
    return this.items[this.selectedIndex] || null;
  }

  toggle() {
    if (!this.panel) return;
    const open = !this.panel.classList.contains('hidden');
    if (open) this.close();
    else this.open();
  }

  open() {
    this.panel?.classList.remove('hidden');
    this.render();
  }

  close() {
    this.panel?.classList.add('hidden');
  }

  render() {
    if (!this.grid) return;
    this.grid.innerHTML = '';
    for (let i = 0; i < this.maxSlots; i++) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot' + (i === this.selectedIndex ? ' selected' : '');
      const item = this.items[i];
      if (item) {
        slot.textContent = item.meta?.icon || '?';
        const rarity = document.createElement('span');
        rarity.className = `item-rarity rarity-${item.meta?.rarity || 'normal'}`;
        slot.appendChild(rarity);
        slot.addEventListener('click', () => this.selectItem(i));
      }
      this.grid.appendChild(slot);
    }
  }

  selectItem(index) {
    this.selectedIndex = index;
    const item = this.items[index];
    if (!item || !this.detail) return;
    this.render();
    this.detail.innerHTML = `
      <strong>${item.meta?.name || item.type}</strong><br>
      Rarity: ${item.meta?.rarity || 'normal'}<br>
      ${item.ownerId ? 'Owner ID linked — investigate!' : 'Owner unknown — use detective skills'}<br>
      <em>Press Q to trigger Memory Echo</em>
    `;
  }

  triggerEcho(item) {
    if (!item) return;
    const echo = item.meta?.echo || 'neutral';
    this.game.triggerMemoryEcho(item, echo);
  }
}
