/** Time travel & timeline effects */
export class TimelineSystem {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.era = 'present';
    this.eras = ['past', 'present', 'future', 'alternate'];
    this.distortionLevel = 0;
    this.glitchEl = document.getElementById('timeline-glitch');
  }

  openPortal() {
    const p = this.game.player.getCenter();
    const portal = this.game.world.portals.find(pt => Math.hypot(p.x - pt.x, p.y - pt.y) < pt.r);
    if (!portal || portal.type !== 'time') {
      this.game.ui?.notify('Find a Time Portal (purple glow in portal zone)', 'warning');
      return;
    }
    this.active = !this.active;
    if (this.active) {
      this.era = this.eras[(this.eras.indexOf(this.era) + 1) % this.eras.length];
      this.game.ui?.notify(`Timeline shift: ${this.era.toUpperCase()}`, 'warning');
      this.glitchEl?.classList.remove('hidden');
      this.game.audio?.playGlitch();
    } else {
      this.era = 'present';
      this.glitchEl?.classList.add('hidden');
      this.game.audio?.playAmbient();
    }
  }

  wrongReturn(item, npc) {
    this.distortionLevel += 20;
    this.game.ui?.notify('TIMELINE ERROR — Wrong owner!', 'danger');
    if (this.distortionLevel > 50) {
      this._applyDistortion();
    }
    this.game.reputation?.change(-20);
  }

  correctReturn(item, npc) {
    if (item.meta?.timeline) {
      this.distortionLevel = Math.max(0, this.distortionLevel - 15);
      this.game.ui?.notify('Timeline stabilized.', 'success');
    }
  }

  _applyDistortion() {
    const effects = [
      'An NPC vanished from this timeline...',
      'Buildings shifted overnight...',
      'The weather turned unnatural...',
      'Shadow monsters appear in the city!',
    ];
    const e = effects[Math.floor(Math.random() * effects.length)];
    this.game.ui?.notify(e, 'danger');
    if (e.includes('monsters')) this.game.monsters?.spawnWave(3);
    this.game.weather?.setWeather('fog');
    this.distortionLevel = 0;
  }

  getWorldModifier() {
    if (!this.active) return 1;
    switch (this.era) {
      case 'past': return 0.8;
      case 'future': return 1.2;
      case 'alternate': return 1.5;
      default: return 1;
    }
  }

  drawOverlay(ctx, camera) {
    if (!this.active) return;
    ctx.fillStyle = `rgba(180, 68, 255, ${0.05 + Math.sin(Date.now() * 0.005) * 0.03})`;
    ctx.fillRect(0, 0, camera.w, camera.h);
  }
}
