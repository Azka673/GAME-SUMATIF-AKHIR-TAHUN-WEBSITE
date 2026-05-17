/** Dynamic world events */
export class EventSystem {
  constructor(game) {
    this.game = game;
    this.activeEvent = null;
    this.eventTimer = 0;
    this.cooldown = 30;
    this.events = [
      { id: 'heavy_rain', name: 'Heavy Rain', duration: 45, weather: 'rain', effect: 'Items may wash away — hurry!' },
      { id: 'storm', name: 'Power Storm', duration: 30, weather: 'storm', effect: 'Power out. CCTV offline.' },
      { id: 'fog', name: 'Mysterious Fog', duration: 40, weather: 'fog', effect: 'Monsters more active.' },
      { id: 'festival', name: 'City Festival', duration: 60, weather: 'clear', effect: 'Many NPCs, more lost items!' },
      { id: 'concert', name: 'Neon Concert', duration: 50, weather: 'clear', effect: 'Crowds in downtown.' },
      { id: 'train_accident', name: 'Subway Incident', duration: 25, weather: 'clear', effect: 'Rare items near subway.' },
      { id: 'portal_leak', name: 'Portal Leak', duration: 35, weather: 'clear', effect: 'Timeline distortion active!', glitch: true },
      { id: 'shadow_invasion', name: 'Shadow Invasion', duration: 40, weather: 'fog', effect: 'Shadow monsters in streets!', monsters: true },
      { id: 'time_distortion', name: 'Time Distortion', duration: 30, weather: 'clear', effect: 'Clock runs irregularly.', timeWarp: true },
      { id: 'meteor_shower', name: 'Memory Meteor Shower', duration: 35, weather: 'clear', effect: 'Memory crystals falling!', crystals: true },
    ];
  }

  update(dt) {
    this.cooldown -= dt;
    if (this.activeEvent) {
      this.eventTimer -= dt;
      if (this.eventTimer <= 0) this._endEvent();
    } else if (this.cooldown <= 0 && Math.random() < 0.0008) {
      this._triggerRandom();
    }
  }

  _triggerRandom() {
    const ev = this.events[Math.floor(Math.random() * this.events.length)];
    this.activeEvent = ev;
    this.eventTimer = ev.duration;
    this.cooldown = 60 + Math.random() * 60;
    this.game.weather?.setWeather(ev.weather);
    this.game.ui?.notify(`EVENT: ${ev.name} — ${ev.effect}`, 'warning');

    if (ev.glitch) document.getElementById('timeline-glitch')?.classList.remove('hidden');
    if (ev.monsters) this.game.monsters?.spawnWave(5);
    if (ev.crystals) this.game.npcManager?._spawnRandomLostItem();
    if (ev.timeWarp) this.game.timeScale = 2 + Math.random() * 2;

    document.body.classList.toggle('festival-glow', ev.id === 'festival');
  }

  _endEvent() {
    if (this.activeEvent?.glitch) document.getElementById('timeline-glitch')?.classList.add('hidden');
    if (this.activeEvent?.timeWarp) this.game.timeScale = 1;
    document.body.classList.remove('festival-glow');
    this.game.weather?.setWeather('clear');
    this.activeEvent = null;
    this.game.ui?.notify('Event ended.', 'success');
  }
}
