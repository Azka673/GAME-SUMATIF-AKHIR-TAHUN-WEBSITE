/** UI manager — HUD sekolah */
export class UIManager {
  constructor(game) {
    this.game = game;
    this.hudTime = document.getElementById('hud-time');
    this.hudDay = document.getElementById('hud-day');
    this.hudZone = document.getElementById('hud-zone');
    this.staminaFill = document.getElementById('stamina-fill');
    this.notifications = document.getElementById('notifications');
    this.investigatePanel = document.getElementById('investigate-panel');
  }

  updateHUD() {
    const h = Math.floor(this.game.hour);
    const m = Math.floor((this.game.hour % 1) * 60);
    if (this.hudTime) this.hudTime.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    if (this.hudDay) this.hudDay.textContent = this.game.day;

    const room = this.game.world.getRoomAt(
      this.game.player.x,
      this.game.player.y,
      this.game.player.floor
    );
    if (this.hudZone) {
      this.hudZone.textContent = `${room.name} · Lt.${this.game.player.floor + 1}`;
    }

    if (this.staminaFill) {
      const pct = (this.game.player.stamina / this.game.player.maxStamina) * 100;
      this.staminaFill.style.width = `${pct}%`;
    }

    this.game.level?._updateHUD();
  }

  notify(message, type = 'info') {
    if (!this.notifications) return;
    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.textContent = message;
    this.notifications.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  toggleInvestigate() {
    this.investigatePanel?.classList.toggle('hidden');
    if (!this.investigatePanel?.classList.contains('hidden')) {
      this.game.reputation?.renderClues();
    }
  }
}
