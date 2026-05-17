/** UI manager — HUD, notifications, panels */
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
    if (this.hudTime) this.hudTime.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    if (this.hudDay) this.hudDay.textContent = this.game.day;
    const zone = this.game.world.getZoneAt(this.game.player.x, this.game.player.y);
    if (this.hudZone) this.hudZone.textContent = zone.name;

    if (this.staminaFill) {
      const pct = (this.game.player.stamina / this.game.player.maxStamina) * 100;
      this.staminaFill.style.width = `${pct}%`;
    }

    const isNight = this.game.hour >= 20 || this.game.hour < 6;
    document.getElementById('game-container')?.classList.toggle('night-vignette', isNight);
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
