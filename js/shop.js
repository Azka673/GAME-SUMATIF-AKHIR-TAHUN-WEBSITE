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
      { id: 'stamina_drink', name: 'Minuman Stamina', price: 45, icon: '🥤', desc: '+40 stamina instan', type: 'consumable' },
      { id: 'energy_bar', name: 'Energy Bar', price: 25, icon: '🍫', desc: '+20 stamina', type: 'consumable' },
      { id: 'healing_kit', name: 'Kotak P3K', price: 75, icon: '🩹', desc: 'Restore stamina penuh', type: 'consumable' },
      { id: 'focus_tea', name: 'Teh Fokus', price: 35, icon: '🫖', desc: '+50 stamina', type: 'consumable' },
      { id: 'speed_boost', name: 'Sepatu Lari', price: 120, icon: '👟', desc: '+20% kecepatan (permanen)', type: 'permanent' },
      { id: 'clue_map', name: 'Peta Petunjuk', price: 80, icon: '🗺️', desc: 'Tandai 1 barang di peta', type: 'consumable' },
      { id: 'scanner', name: 'Scanner Murid', price: 150, icon: '📡', desc: 'Sorot barang hilang', type: 'permanent' },
      { id: 'big_bag', name: 'Tas Besar', price: 200, icon: '🎒', desc: '+3 slot inventori (permanen)', type: 'permanent' },
      { id: 'lucky_charm', name: 'Jimat Keberuntungan', price: 100, icon: '🍀', desc: '+15% uang dari tugas', type: 'permanent' },
      { id: 'snack', name: 'Snack Kantin', price: 15, icon: '🥐', desc: 'Tambah reputasi +5', type: 'consumable' },
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

    // Check if permanent item already owned
    if (item.type === 'permanent' && this.owned[itemId]) {
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
      case 'healing_kit':
        p.stamina = p.maxStamina;
        break;
      case 'focus_tea':
        p.stamina = Math.min(p.maxStamina, p.stamina + 50);
        break;
      case 'speed_boost':
        if (!this.owned[item.id] || this.owned[item.id] === 1) {
          p.speed = Math.floor(p.speed * 1.2);
        }
        break;
      case 'clue_map': {
        const lost = this.game.npcManager?.lostItemsWorld?.find(i => !i.found);
        if (lost) {
          const room = this.game.world.getRoomById(lost.lastSeenRoom);
          this.game.ui?.notify(`Peta: barang di ${room?.name || 'tempat tertentu'} (Lt.${lost.floor + 1})`, 'info');
        }
        break;
      }
      case 'scanner':
        st.skills.scanClue = true;
        this.game.ui?.notify('Scanner diaktifkan! Tekan F untuk sorot barang.', 'success');
        break;
      case 'big_bag':
        if (!this.owned[item.id] || this.owned[item.id] === 1) {
          inv.maxSlots += 3;
          this.game.ui?.notify('Kapasitas tas bertambah!', 'success');
        }
        break;
      case 'lucky_charm':
        // Passive effect, no action needed
        break;
      case 'snack':
        this.game.reputation?.change(5);
        break;
    }
  }

  render() {
    if (!this.listEl) return;
    this._updateHUD();
    this.listEl.innerHTML = '';

    this.catalog.forEach(item => {
      const owned = this.owned[item.id] || 0;
      const price = this.game.skillTree?.skills?.shopDiscount
        ? Math.floor(item.price * 0.9) : item.price;
      const canAfford = this.money >= price;
      const isPermanent = item.type === 'permanent' && owned > 0;

      const el = document.createElement('div');
      el.className = `shop-item ${!canAfford && !isPermanent ? 'disabled' : ''} ${isPermanent ? 'owned' : ''}`;
      el.innerHTML = `
        <div class="shop-icon">${item.icon}</div>
        <div class="shop-info">
          <div class="shop-name">${item.name}</div>
          <div class="shop-desc">${item.desc}</div>
          <div class="shop-price">${isPermanent ? '✓ Dimiliki' : `Rp ${price}`}</div>
        </div>
        <button class="shop-buy ${!canAfford || isPermanent ? 'disabled' : ''}" 
                ${!canAfford || isPermanent ? 'disabled' : ''}>
          ${isPermanent ? '✓' : 'Beli'}
        </button>
      `;

      if (!isPermanent && canAfford) {
        el.querySelector('.shop-buy').addEventListener('click', () => this.buy(item.id));
      }
      this.listEl.appendChild(el);
    });
  }

  toggle() {
    if (!this.panel) return;
    const isHidden = this.panel.classList.contains('hidden');
    if (isHidden) {
      this.panel.classList.remove('hidden');
      this.panel.classList.add('panel-enter');
      this.render();
    } else {
      this.panel.classList.add('hidden');
      this.panel.classList.remove('panel-enter');
    }
  }

  _updateHUD() {
    const el = document.getElementById('hud-money');
    if (el) el.textContent = this.money;
    if (this.moneyEl) this.moneyEl.textContent = this.money;
  }

  render() {
    if (!this.listEl) return;
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
