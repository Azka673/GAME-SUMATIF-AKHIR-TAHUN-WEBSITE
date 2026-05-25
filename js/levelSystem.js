/** Level & XP — naik level dari menyelesaikan tugas pengembalian barang */
export class LevelSystem {
  constructor(game) {
    this.game = game;
    this.level = 1;
    this.xp = 0;
    this.xpToNext = 100;
    this.totalReturns = 0;
  }

  xpForReturn(item) {
    const base = 40;
    const rarityBonus = { normal: 0, emotional: 25, supernatural: 40, dangerous: 60 };
    return base + (rarityBonus[item.meta?.rarity] || 0);
  }

  addXp(amount, reason = '') {
    this.xp += amount;
    if (reason) this.game.ui?.notify(`+${amount} XP — ${reason}`, 'success');
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.levelUp();
    }
    this._updateHUD();
  }

  levelUp() {
    this.level++;
    this.xpToNext = Math.floor(80 + this.level * 45);
    this.game.skillTree?.onLevelUp(this.level);
    this.game.ui?.notify(`LEVEL UP! Kamu sekarang Level ${this.level}`, 'success');
    this.game.audio?.playQuest();
  }

  onItemReturned(item) {
    this.totalReturns++;
    this.addXp(this.xpForReturn(item), 'Barang dikembalikan');
  }

  _updateHUD() {
    const lv = document.getElementById('hud-level');
    const xpBar = document.getElementById('xp-fill');
    const xpText = document.getElementById('hud-xp');
    if (lv) lv.textContent = this.level;
    if (xpText) xpText.textContent = `${this.xp}/${this.xpToNext}`;
    if (xpBar) xpBar.style.width = `${(this.xp / this.xpToNext) * 100}%`;
  }

  toJSON() {
    return { level: this.level, xp: this.xp, xpToNext: this.xpToNext, totalReturns: this.totalReturns };
  }

  fromJSON(data) {
    if (!data) return;
    this.level = data.level ?? 1;
    this.xp = data.xp ?? 0;
    this.xpToNext = data.xpToNext ?? 100;
    this.totalReturns = data.totalReturns ?? 0;
    this._updateHUD();
  }
}
