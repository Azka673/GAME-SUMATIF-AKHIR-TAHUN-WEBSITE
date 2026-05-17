/** NPC AI — schedules, wandering, lost items, panic */
import { ITEM_META, ZONES } from './world.js';

const NPC_TEMPLATES = [
  { name: 'Mika', role: 'child', zone: 'park', home: { x: 200, y: 1000 }, color: '#ff88aa', lostItems: ['old_doll'] },
  { name: 'Mr. Chen', role: 'business', zone: 'downtown', home: { x: 400, y: 200 }, color: '#4488ff', lostItems: ['briefcase'] },
  { name: 'Luna', role: 'student', zone: 'school', home: { x: 2400, y: 150 }, color: '#88ffcc', lostItems: ['bag', 'keys'] },
  { name: 'Grandma Yuki', role: 'elder', zone: 'market', home: { x: 1400, y: 300 }, color: '#ccaa88', lostItems: ['family_photo'] },
  { name: 'Kai', role: 'traveler', zone: 'portalZone', home: { x: 2000, y: 1600 }, color: '#cc66ff', lostItems: ['future_device', 'time_watch'] },
  { name: 'Shadow', role: 'monster', zone: 'monsterArea', home: { x: 1300, y: 1900 }, color: '#662244', lostItems: ['gold_scale', 'monster_core'], nightOnly: true },
  { name: 'Spirit Mei', role: 'spirit', zone: 'alley', home: { x: 1100, y: 1000 }, color: '#aa88ff', lostItems: ['spirit_mask', 'family_photo'] },
  { name: 'Captain Rex', role: 'harbor', zone: 'harbor', home: { x: 3100, y: 300 }, color: '#44aacc', lostItems: ['keys', 'wallet'] },
  { name: 'Dr. Nova', role: 'scientist', zone: 'eastCity', home: { x: 2600, y: 900 }, color: '#00ffaa', lostItems: ['memory_crystal', 'secret_data'] },
  { name: 'Fake Owner', role: 'deceiver', zone: 'market', home: { x: 1500, y: 400 }, color: '#ff4444', lostItems: [], isFake: true },
];

export class NPCManager {
  constructor(world) {
    this.world = world;
    this.npcs = [];
    this.lostItemsWorld = [];
    this._initNPCs();
  }

  _initNPCs() {
    NPC_TEMPLATES.forEach((t, i) => {
      const zone = ZONES[t.zone] || ZONES.downtown;
      const x = t.home?.x || zone.x + 100 + i * 80;
      const y = t.home?.y || zone.y + 100;
      this.npcs.push(new NPC({ ...t, x, y, id: `npc_${i}` }));
    });
  }

  update(dt, gameHour, gameState) {
    const isNight = gameHour >= 20 || gameHour < 6;
    this.npcs.forEach(npc => {
      if (npc.nightOnly && !isNight) return;
      npc.update(dt, gameHour, this.world);
    });

    if (Math.random() < 0.002 * dt * 60) this._spawnRandomLostItem();
    this._updateLostItems(dt);
  }

  _spawnRandomLostItem() {
    const types = Object.keys(ITEM_META);
    const type = types[Math.floor(Math.random() * types.length)];
    const zoneKeys = Object.keys(ZONES);
    const z = ZONES[zoneKeys[Math.floor(Math.random() * zoneKeys.length)]];
    const item = {
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      x: z.x + 50 + Math.random() * (z.w - 100),
      y: z.y + 50 + Math.random() * (z.h - 100),
      meta: ITEM_META[type],
      ownerId: null,
      found: false,
    };
    const owner = this.npcs.find(n => n.lostItems?.includes(type) && !n.hasLostItem);
    if (owner) {
      owner.hasLostItem = true;
      owner.lostItemId = item.id;
      owner.panicking = true;
      item.ownerId = owner.id;
    }
    this.lostItemsWorld.push(item);
  }

  _updateLostItems(dt) {
    this.lostItemsWorld = this.lostItemsWorld.filter(i => !i.found);
  }

  getNearbyNPC(x, y, range = 80) {
    return this.npcs.find(n => {
      const dx = n.x - x, dy = n.y - y;
      return Math.hypot(dx, dy) < range;
    });
  }

  getNearbyItem(x, y, range = 50) {
    return this.lostItemsWorld.find(i => {
      const dx = i.x - x, dy = i.y - y;
      return Math.hypot(dx, dy) < range && !i.found;
    });
  }

  draw(ctx, camera, gameHour) {
    const isNight = gameHour >= 20 || gameHour < 6;
    this.npcs.forEach(npc => {
      if (npc.nightOnly && !isNight) return;
      npc.draw(ctx, camera);
    });

    this.lostItemsWorld.forEach(item => {
      if (item.found) return;
      const ix = item.x - camera.x, iy = item.y - camera.y;
      const pulse = 0.8 + Math.sin(Date.now() * 0.005 + item.x) * 0.2;
      ctx.font = `${20 * pulse}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(item.meta?.icon || '?', ix, iy);
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ix, iy - 8, 18 * pulse, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}

class NPC {
  constructor(data) {
    Object.assign(this, data);
    this.w = 24;
    this.h = 30;
    this.vx = 0;
    this.vy = 0;
    this.targetX = data.x;
    this.targetY = data.y;
    this.state = 'idle';
    this.stateTimer = 0;
    this.schedulePhase = 0;
    this.hasLostItem = false;
    this.panicking = false;
    this.dialogueIndex = 0;
    this.trust = 50;
  }

  update(dt, hour, world) {
    this.stateTimer -= dt;

    if (this.panicking) {
      this.state = 'panic';
      this._wander(dt, 1.8);
      return;
    }

    const phase = Math.floor(hour / 6) % 4;
    if (phase !== this.schedulePhase) {
      this.schedulePhase = phase;
      this._pickScheduleTarget(hour);
    }

    switch (this.state) {
      case 'idle':
        if (this.stateTimer <= 0) {
          this.state = ['walk', 'work', 'eat', 'talk'][Math.floor(Math.random() * 4)];
          this.stateTimer = 2 + Math.random() * 4;
          if (this.state === 'walk') this._pickWanderTarget(world);
        }
        break;
      case 'walk':
      case 'work':
        this._moveToward(dt, 60);
        if (Math.hypot(this.targetX - this.x, this.targetY - this.y) < 10) {
          this.state = 'idle';
          this.stateTimer = 1;
        }
        break;
      case 'eat':
      case 'talk':
        if (this.stateTimer <= 0) this.state = 'idle';
        break;
    }
  }

  _pickScheduleTarget(hour) {
    if (hour >= 6 && hour < 12) {
      this.targetX = this.home.x + 30;
      this.targetY = this.home.y;
    } else if (hour >= 12 && hour < 18) {
      this.targetX = this.x + (Math.random() - 0.5) * 200;
      this.targetY = this.y + (Math.random() - 0.5) * 200;
    } else {
      this.targetX = this.home.x;
      this.targetY = this.home.y;
    }
  }

  _pickWanderTarget(world) {
    for (let i = 0; i < 10; i++) {
      this.targetX = this.home.x + (Math.random() - 0.5) * 300;
      this.targetY = this.home.y + (Math.random() - 0.5) * 300;
      if (!world.collides(this.targetX, this.targetY, this.w, this.h)) break;
    }
  }

  _wander(dt, speedMult = 1) {
    if (Math.random() < 0.05) {
      this.targetX = this.x + (Math.random() - 0.5) * 150;
      this.targetY = this.y + (Math.random() - 0.5) * 150;
    }
    this._moveToward(dt, 80 * speedMult);
  }

  _moveToward(dt, speed) {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return;
    this.x += (dx / dist) * speed * dt;
    this.y += (dy / dist) * speed * dt;
  }

  draw(ctx, camera) {
    const cx = this.x - camera.x;
    const cy = this.y - camera.y;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(cx + 12, cy + 15, 14, 0, Math.PI * 2);
    ctx.fill();
    if (this.panicking) {
      ctx.fillStyle = '#ff3333';
      ctx.font = '16px sans-serif';
      ctx.fillText('!', cx + 8, cy - 8);
    }
    ctx.fillStyle = '#fff';
    ctx.font = '10px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, cx + 12, cy - 12);
    if (this.state === 'talk') {
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(cx + 20, cy - 20, 20, 12);
      ctx.fillStyle = '#000';
      ctx.font = '8px sans-serif';
      ctx.fillText('...', cx + 26, cy - 11);
    }
  }

  getDialogue(context) {
    if (this.isFake) {
      return { text: "That's mine! Give it here!", choices: [
        { text: 'Hand over item (risky)', action: 'fake_give' },
        { text: 'Ask for proof', action: 'ask_proof' },
        { text: 'Leave', action: 'close' },
      ]};
    }
    if (this.panicking) {
      return { text: `Please help! I lost my ${this.lostItems?.[0] || 'something'}!`, choices: [
        { text: 'I\'ll find it', action: 'accept_quest' },
        { text: 'Any clues?', action: 'clue' },
        { text: 'Later', action: 'close' },
      ]};
    }
    const lines = [
      `Hello, Returner. I'm ${this.name}, a ${this.role} around here.`,
      'The city has been strange lately. Items vanish into thin air.',
      'Have you heard about the time portals opening at night?',
    ];
    return { text: lines[this.dialogueIndex % lines.length], choices: [
      { text: 'Any lost items?', action: 'lost_check' },
      { text: 'Tell me about this area', action: 'area_info' },
      { text: 'Goodbye', action: 'close' },
    ]};
  }
}
