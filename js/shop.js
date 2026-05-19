/** Shop — beli barang dengan uang (duit) dari tugas NPC */
export class Shop {
  constructor(game) {
    this.game = game;
    this.money = 0;
    this.panel = document.getElementById('shop-panel');
    this.listEl = document.getElementById('shop-list');
    this.moneyEl = document.getElementById('shop-money');
    this.owned = {};

    this.catalog = [
      { id: 'stamina_drink', name: 'Minuman Stamina', price: 45, icon: '🥤', desc: '+40 stamina instan' },
      { id: 'energy_bar', name: 'Energy Bar', price: 25, icon: '🍫', desc: '+20 stamina' },
      { id: 'speed_boost', name: 'Sepatu Lari', price: 120, icon: '👟', desc: '+20% kecepatan (permanen)' },
      { id: 'clue_map', name: 'Peta Petunjuk', price: 80, icon: '🗺️', desc: 'Tandai 1 barang di peta' },
      { id: 'scanner', name: 'Scanner Murid', price: 150, icon: '📡', desc: 'Skill: sorot barang hilang' },
      { id: 'big_bag', name: 'Tas Besar', price: 200, icon: '🎒', desc: '+3 slot inventori' },
      { id: 'lucky_charm', name: 'Jimat Keberuntungan', price: 100, icon: '🍀', desc: '+15% uang dari tugas' },
      { id: 'snack', name: 'Snack Kantin', price: 15, icon: '🥐', desc: 'Rep +5 (sekali)' },
    ];
  }

  addMoney(amount, reason = '') {
    const bonus = this.game.skillTree?.skills?.moneyBonus ? 1.15 : 1;
    const charm = this.owned.lucky_charm ? 1.15 : 1;
    const total = Math.floor(amount * bonus * charm);
    this.money += total;
    this._updateHUD();
    if (reason) this.game.ui?.notify(`+Rp ${total} — ${reason}`, 'success');
    return total;
  }

  canAfford(price) {
    return this.money >= price;
  }

  buy(itemId) {
    const item = this.catalog.find(c => c.id === itemId);
    if (!item) return false;
    if (this.owned[itemId] && ['speed_boost', 'scanner', 'big_bag', 'lucky_charm'].includes(itemId)) {
      this.game.ui?.notify('Sudah kamu miliki!', 'warning');
      return false;
    }
    const price = this.game.skillTree?.skills?.shopDiscount
      ? Math.floor(item.price * 0.9) : item.price;
    if (!this.canAfford(price)) {
      this.game.ui?.notify(`Uang tidak cukup! Butuh Rp ${price}`, 'warning');
      return false;
    }

    this.money -= price;
    this.owned[itemId] = (this.owned[itemId] || 0) + 1;
    this._applyPurchase(item);
    this._updateHUD();
    this.render();
    this.game.ui?.notify(`Dibeli: ${item.name}`, 'success');
    this.game.audio?.playPickup();
    return true;
  }

  _applyPurchase(item) {
    const p = this.game.player;
    const inv = this.game.inventory;
    const st = this.game.skillTree;

    switch (item.id) {
      case 'stamina_drink':
        p.stamina = Math.min(p.maxStamina, p.stamina + 40);
        break;
      case 'energy_bar':
        p.stamina = Math.min(p.maxStamina, p.stamina + 20);
        break;
      case 'speed_boost':
        p.speed = Math.floor(p.speed * 1.2);
        break;
      case 'clue_map': {
        const lost = this.game.npcManager?.lostItemsWorld?.find(i => !i.found);
        if (lost) {
          const room = this.game.world.getRoomById(lost.lastSeenRoom);
          this.game.reputation?.addClue(`Peta: barang di ${room?.name} (Lt.${lost.floor + 1})`);
        }
        break;
      }
      case 'scanner':
        st.skills.scanClue = true;
        break;
      case 'big_bag':
        inv.maxSlots += 3;
        break;
      case 'lucky_charm':
        break;
      case 'snack':
        this.game.reputation?.change(5);
        break;
    }
  }

  render() {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';
    this.catalog.forEach(item => {
      const owned = this.owned[item.id] || 0;
      const price = this.game.skillTree?.skills?.shopDiscount
        ? Math.floor(item.price * 0.9) : item.price;
      const canAfford = this.money >= price;
      const isOwned = owned > 0 && ['speed_boost', 'scanner', 'big_bag', 'lucky_charm'].includes(item.id);

      const el = document.createElement('div');
      el.className = `shop-item ${!canAfford ? 'disabled' : ''} ${isOwned ? 'owned' : ''}`;
      el.innerHTML = `
        <div class="shop-icon">${item.icon}</div>
        <div class="shop-info">
          <div class="shop-name">${item.name}</div>
          <div class="shop-desc">${item.desc}</div>
          <div class="shop-price">${isOwned ? '✓ Dimiliki' : `Rp ${price}`}</div>
        </div>
        <button class="shop-buy ${!canAfford || isOwned ? 'disabled' : ''}" 
                ${!canAfford || isOwned ? 'disabled' : ''}>
          ${isOwned ? '✓' : 'Beli'}
        </button>
      `;

      if (!isOwned && canAfford) {
        el.querySelector('.shop-buy').addEventListener('click', () => this.buy(item.id));
      }
      this.listEl.appendChild(el);
    });
  }

  toggle() {
    if (!this.panel) return;
    const open = !this.panel.classList.contains('hidden');
    if (open) {
      this.panel.classList.add('hidden');
      this.panel.classList.remove('panel-enter');
    } else {
      this.panel.classList.remove('hidden');
      this.panel.classList.add('panel-enter');
      this.render();
    }
  }

  _updateHUD() {
    const el = document.getElementById('hud-money');
    if (el) el.textContent = this.money;
    if (this.moneyEl) this.moneyEl.textContent = this.money;
  }

  render() {
    if (!this.listEl) return;
    this._updateHUD();
    this.listEl.innerHTML = '';

    this.catalog.forEach(item => {
      const owned = this.owned[item.id] && ['speed_boost', 'scanner', 'big_bag', 'lucky_charm'].includes(item.id);
      const row = document.createElement('div');
      row.className = 'shop-item';
      row.innerHTML = `
        <span class="shop-icon">${item.icon}</span>
        <span class="shop-info">
          <strong>${item.name}</strong>
          <small>${item.desc}</small>
        </span>
        <span class="shop-price">Rp ${item.price}</span>
        <button ${owned ? 'disabled' : ''}>${owned ? 'Punya' : 'Beli'}</button>
      `;
      row.querySelector('button')?.addEventListener('click', () => this.buy(item.id));
      this.listEl.appendChild(row);
    });
  }

  toJSON() {
    return { money: this.money, owned: this.owned };
  }

  fromJSON(data) {
    if (!data) return;
    this.money = data.money ?? 0;
    this.owned = data.owned ?? {};
    this._updateHUD();
  }
}
