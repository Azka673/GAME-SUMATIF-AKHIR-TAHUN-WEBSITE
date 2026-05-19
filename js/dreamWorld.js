/** Dream world exploration */
export class DreamWorld {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.dreamType = null;
    this.overlay = document.getElementById('dream-overlay');
    this.titleEl = document.getElementById('dream-title');
    this.puzzles = [];
    this.timer = 0;
    this.maxTime = 60;
  }

  enter(item) {
    if (!item?.meta?.dream && !['family_photo', 'old_doll', 'last_letter', 'memory_crystal'].includes(item?.type)) {
      this.game.ui?.notify('This item has no dream resonance.', 'warning');
      return;
    }
    this.active = true;
    this.timer = this.maxTime + (this.game.skillTree?.skills?.dreamTime || 0) * 10;
    const types = ['inverted', 'sky_ocean', 'zero_gravity', 'eye_forest'];
    this.dreamType = types[Math.floor(Math.random() * types.length)];
    this.overlay?.classList.remove('hidden');
    if (this.titleEl) this.titleEl.textContent = `DREAM: ${this.dreamType.replace('_', ' ').toUpperCase()}`;

    this.game.dreamMode = true;
    this.game.player.color = '#ff66cc';
    this._setupPuzzles();
    this.game.quests?.startQuest('dream_rescue', { itemId: item.id });
    this.game.ui?.notify('Dream Entry activated! Find memory fragments.', 'success');
    this.game.audio?.playDream();
  }

  exit() {
    this.active = false;
    this.game.dreamMode = false;
    this.game.player.color = '#00f5ff';
    this.overlay?.classList.add('hidden');
    this.game.audio?.playAmbient();
  }

  _setupPuzzles() {
    this.puzzles = [];
    for (let i = 0; i < 3; i++) {
      this.puzzles.push({
        x: 400 + Math.random() * 800,
        y: 300 + Math.random() * 600,
        collected: false,
        type: ['memory', 'emotion', 'clue'][i],
      });
    }
  }

  update(dt) {
    if (!this.active) return;
    this.timer -= dt;
    if (this.timer <= 0) {
      this.game.ui?.notify('Dream fading...', 'warning');
      this.exit();
    }

    const p = this.game.player.getCenter();
    this.puzzles.forEach(pz => {
      if (!pz.collected && Math.hypot(p.x - pz.x, p.y - pz.y) < 40) {
        pz.collected = true;
        this.game.reputation?.addClue(`Dream fragment: ${pz.type}`);
        this.game.ui?.notify(`Found dream ${pz.type}!`, 'success');
      }
    });

    if (this.puzzles.every(p => p.collected)) {
      this.game.ui?.notify('Dream complete! Memory restored.', 'success');
      this.game.reputation?.change(15);
      this.exit();
    }
  }

  draw(ctx, camera) {
    if (!this.active) return;
    ctx.save();
    if (this.dreamType === 'inverted') ctx.filter = 'invert(0.85) hue-rotate(180deg)';
    if (this.dreamType === 'sky_ocean') {
      const grd = ctx.createLinearGradient(0, 0, 0, camera.h);
      grd.addColorStop(0, 'rgba(0,100,200,0.2)');
      grd.addColorStop(1, 'rgba(100,0,200,0.2)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, camera.w, camera.h);
    }

    this.puzzles.forEach(pz => {
      if (pz.collected) return;
      ctx.fillStyle = '#ff66cc';
      ctx.beginPath();
      ctx.arc(pz.x - camera.x, pz.y - camera.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText('✦', pz.x - camera.x - 4, pz.y - camera.y + 4);
    });
    ctx.restore();
  }
}
