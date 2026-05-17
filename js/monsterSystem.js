/** Monsters & spirit world (night) */
export class MonsterSystem {
  constructor(game) {
    this.game = game;
    this.monsters = [];
    this.templates = [
      { name: 'Baby Dragon', icon: '🐉', color: '#ff8844', lostItem: 'gold_scale', speed: 50 },
      { name: 'Lonely Spirit', icon: '👻', color: '#aaaaff', lostItem: 'family_photo', speed: 40 },
      { name: 'Slime', icon: '🟢', color: '#44ff44', lostItem: 'monster_core', speed: 30 },
      { name: 'Shadow', icon: '👤', color: '#222244', lostItem: 'memory_crystal', speed: 70 },
      { name: 'Sea Guardian', icon: '🌊', color: '#4488cc', lostItem: 'portal_core', speed: 35 },
    ];
  }

  update(dt, hour) {
    const isNight = hour >= 20 || hour < 6;
    this.monsters.forEach(m => {
      m.update(dt, this.game.player, isNight);
    });
    if (isNight && this.monsters.length < 8 && Math.random() < 0.001) {
      this._spawnMonster();
    }
    if (!isNight && this.monsters.length > 2) {
      this.monsters = this.monsters.slice(0, 2);
    }
  }

  spawnWave(count) {
    for (let i = 0; i < count; i++) this._spawnMonster();
  }

  _spawnMonster() {
    const t = this.templates[Math.floor(Math.random() * this.templates.length)];
    const zone = this.game.world.getZoneAt(this.game.player.x, this.game.player.y);
    this.monsters.push(new Monster({
      ...t,
      x: this.game.player.x + (Math.random() - 0.5) * 400,
      y: this.game.player.y + (Math.random() - 0.5) * 400,
      hasLostItem: Math.random() < 0.4,
    }));
  }

  getNearby(x, y, range = 60) {
    return this.monsters.find(m => Math.hypot(m.x - x, m.y - y) < range);
  }

  draw(ctx, camera) {
    this.monsters.forEach(m => m.draw(ctx, camera));
  }
}

class Monster {
  constructor(data) {
    Object.assign(this, data);
    this.w = 32;
    this.h = 32;
    this.vx = 0;
    this.vy = 0;
    this.wanderTimer = 0;
  }

  update(dt, player, isNight) {
    if (!isNight) return;
    this.wanderTimer -= dt;
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 200 && dist > 40) {
      this.x += (dx / dist) * this.speed * dt * 0.5;
      this.y += (dy / dist) * this.speed * dt * 0.5;
    } else if (this.wanderTimer <= 0) {
      this.x += (Math.random() - 0.5) * 80;
      this.y += (Math.random() - 0.5) * 80;
      this.wanderTimer = 2 + Math.random() * 3;
    }
  }

  draw(ctx, camera) {
    const cx = this.x - camera.x;
    const cy = this.y - camera.y;
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.icon, cx, cy);
    if (this.hasLostItem) {
      ctx.fillStyle = '#ffd700';
      ctx.font = '12px sans-serif';
      ctx.fillText('?', cx + 15, cy - 15);
    }
    ctx.fillStyle = this.color;
    ctx.font = '9px sans-serif';
    ctx.fillText(this.name, cx, cy + 20);
  }

  getDialogue() {
    return {
      text: this.hasLostItem
        ? `*${this.name} looks sad* I lost my precious ${this.lostItem}...`
        : `*${this.name} stares mysteriously*`,
      choices: [
        { text: 'I\'ll help find your item', action: 'accept_quest' },
        { text: 'Stay back!', action: 'close' },
      ],
    };
  }
}
