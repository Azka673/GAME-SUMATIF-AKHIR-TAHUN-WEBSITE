/** World map, zones, collision, day/night lighting */
export const WORLD_W = 4800;
export const WORLD_H = 3600;
export const TILE = 32;

export const ZONES = {
  downtown:    { id: 'downtown',    name: 'Downtown',       x: 0,    y: 0,    w: 1200, h: 900,  color: '#1a2540', accent: '#00f5ff', type: 'urban' },
  market:      { id: 'market',      name: 'Busy Market',    x: 1200, y: 0,    w: 900,  h: 800,  color: '#2a1a20', accent: '#ffaa44', type: 'urban' },
  school:      { id: 'school',      name: 'City School',    x: 2100, y: 0,    w: 800,  h: 700,  color: '#1a2a30', accent: '#88ccff', type: 'urban' },
  park:        { id: 'park',        name: 'City Park',      x: 0,    y: 900,  w: 1000, h: 800,  color: '#0a2818', accent: '#44ff88', type: 'nature' },
  alley:       { id: 'alley',       name: 'Mystery Alley',  x: 1000, y: 900,  w: 600,  h: 600,  color: '#120818', accent: '#b24dff', type: 'dark' },
  subway:      { id: 'subway',      name: 'Underground',    x: 1600, y: 800,  w: 700,  h: 500,  color: '#0a0a18', accent: '#ffee44', type: 'indoor' },
  harbor:      { id: 'harbor',      name: 'Harbor',         x: 2900, y: 0,    w: 900,  h: 700,  color: '#0a1830', accent: '#4488ff', type: 'water' },
  forest:      { id: 'forest',      name: 'Edge Forest',    x: 0,    y: 1700, w: 1100, h: 900,  color: '#081808', accent: '#228844', type: 'nature' },
  monsterArea: { id: 'monsterArea', name: 'Hidden Den',     x: 1100, y: 1700, w: 700,  h: 600,  color: '#180818', accent: '#ff2244', type: 'danger' },
  portalZone:  { id: 'portalZone',  name: 'Time Portal',    x: 1800, y: 1500, w: 600,  h: 500,  color: '#1a0830', accent: '#cc44ff', type: 'portal' },
  dreamGate:   { id: 'dreamGate',   name: 'Dream Gate',     x: 2400, y: 1400, w: 500,  h: 400,  color: '#200830', accent: '#ff66cc', type: 'dream' },
  eastCity:    { id: 'eastCity',    name: 'East District',  x: 2300, y: 700,  w: 1200, h: 800,  color: '#1a2035', accent: '#66aaff', type: 'urban' },
  northPlaza:  { id: 'northPlaza',  name: 'North Plaza',    x: 2900, y: 700,  w: 800,  h: 600,  color: '#202028', accent: '#ffffff', type: 'urban' },
};

export const ITEM_TYPES = {
  normal: ['wallet', 'phone', 'bag', 'keys'],
  emotional: ['family_photo', 'old_doll', 'last_letter'],
  supernatural: ['time_watch', 'spirit_mask', 'monster_core', 'memory_crystal'],
  dangerous: ['timeline_artifact', 'secret_data', 'portal_core'],
};

export const ITEM_META = {
  wallet: { icon: '👛', rarity: 'normal', echo: 'sad', name: 'Lost Wallet' },
  phone: { icon: '📱', rarity: 'normal', echo: 'mysterious', name: 'Cracked Phone' },
  bag: { icon: '🎒', rarity: 'normal', echo: 'neutral', name: 'School Bag' },
  keys: { icon: '🔑', rarity: 'normal', echo: 'happy', name: 'House Keys' },
  family_photo: { icon: '🖼️', rarity: 'emotional', echo: 'sad', name: 'Family Photo', dream: true },
  old_doll: { icon: '🧸', rarity: 'emotional', echo: 'sad', name: 'Old Doll', dream: true },
  last_letter: { icon: '✉️', rarity: 'emotional', echo: 'sad', name: 'Last Letter', dream: true },
  time_watch: { icon: '⌚', rarity: 'supernatural', echo: 'mysterious', name: 'Time Reversal Watch', timeline: true },
  spirit_mask: { icon: '🎭', rarity: 'supernatural', echo: 'mysterious', name: 'Spirit Mask' },
  monster_core: { icon: '💎', rarity: 'supernatural', echo: 'dangerous', name: 'Monster Core' },
  memory_crystal: { icon: '🔮', rarity: 'supernatural', echo: 'mysterious', name: 'Memory Crystal', dream: true },
  timeline_artifact: { icon: '⚡', rarity: 'dangerous', echo: 'dangerous', name: 'Timeline Artifact', timeline: true },
  secret_data: { icon: '💾', rarity: 'dangerous', echo: 'mysterious', name: 'Classified Data' },
  portal_core: { icon: '🌀', rarity: 'dangerous', echo: 'dangerous', name: 'Portal Core', timeline: true },
  briefcase: { icon: '💼', rarity: 'normal', echo: 'neutral', name: 'Business Briefcase' },
  gold_scale: { icon: '🐉', rarity: 'supernatural', echo: 'happy', name: 'Golden Dragon Scale' },
  future_device: { icon: '🛸', rarity: 'dangerous', echo: 'mysterious', name: 'Future Device', timeline: true },
};

export class World {
  constructor() {
    this.obstacles = this._buildObstacles();
    this.decorations = this._buildDecorations();
    this.portals = [
      { x: 2050, y: 1720, r: 60, type: 'time', label: 'Time Portal' },
      { x: 2620, y: 1580, r: 50, type: 'dream', label: 'Dream Gate' },
    ];
    this.cctvPoints = [
      { x: 400, y: 300, zone: 'downtown' },
      { x: 1500, y: 200, zone: 'market' },
      { x: 1750, y: 1000, zone: 'alley' },
      { x: 3200, y: 400, zone: 'harbor' },
    ];
  }

  _buildObstacles() {
    const obs = [];
    ZONES.school && obs.push({ x: 2300, y: 100, w: 400, h: 80 });
    obs.push({ x: 500, y: 1100, w: 200, h: 150 });
    obs.push({ x: 1300, y: 1050, w: 120, h: 200 });
    obs.push({ x: 3000, y: 500, w: 300, h: 100 });
    obs.push({ x: 200, y: 2000, w: 400, h: 80 });
    obs.push({ x: 1400, y: 1900, w: 250, h: 60 });
    return obs;
  }

  _buildDecorations() {
    const dec = [];
    for (let i = 0; i < 80; i++) {
      dec.push({
        x: Math.random() * WORLD_W,
        y: Math.random() * WORLD_H,
        type: ['tree', 'lamp', 'bench', 'neon'][Math.floor(Math.random() * 4)],
        size: 12 + Math.random() * 20,
      });
    }
    return dec;
  }

  getZoneAt(x, y) {
    for (const z of Object.values(ZONES)) {
      if (x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h) return z;
    }
    return { id: 'unknown', name: 'Unknown', color: '#111', accent: '#666', type: 'void' };
  }

  collides(x, y, w, h) {
    for (const o of this.obstacles) {
      if (x + w > o.x && x < o.x + o.w && y + h > o.y && y < o.y + o.h) return true;
    }
    if (x < 0 || y < 0 || x + w > WORLD_W || y + h > WORLD_H) return true;
    return false;
  }

  getLightLevel(gameHour) {
    if (gameHour >= 6 && gameHour < 18) return 1;
    if (gameHour >= 18 && gameHour < 20) return 0.7 - (gameHour - 18) * 0.15;
    if (gameHour >= 20 || gameHour < 5) return 0.35;
    return 0.35 + (gameHour - 5) * 0.1;
  }

  draw(ctx, camera, gameState) {
    const { x: cx, y: cy, w: cw, h: ch } = camera;
    const light = this.getLightLevel(gameState.hour);

    for (const zone of Object.values(ZONES)) {
      if (zone.x + zone.w < cx || zone.x > cx + cw || zone.y + zone.h < cy || zone.y > cy + ch) continue;
      ctx.fillStyle = zone.color;
      ctx.fillRect(zone.x - cx, zone.y - cy, zone.w, zone.h);
      ctx.strokeStyle = zone.accent + '33';
      ctx.lineWidth = 2;
      ctx.strokeRect(zone.x - cx + 1, zone.y - cy + 1, zone.w - 2, zone.h - 2);
      ctx.fillStyle = zone.accent + '88';
      ctx.font = '14px Orbitron, sans-serif';
      ctx.fillText(zone.name, zone.x - cx + 16, zone.y - cy + 28);
    }

    for (const o of this.obstacles) {
      if (o.x + o.w < cx || o.x > cx + cw) continue;
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(o.x - cx, o.y - cy, o.w, o.h);
      ctx.strokeStyle = '#334';
      ctx.strokeRect(o.x - cx, o.y - cy, o.w, o.h);
    }

    for (const d of this.decorations) {
      if (d.x < cx - 50 || d.x > cx + cw + 50) continue;
      const dx = d.x - cx, dy = d.y - cy;
      if (d.type === 'tree') {
        ctx.fillStyle = '#1a4030';
        ctx.beginPath();
        ctx.arc(dx, dy, d.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.type === 'lamp') {
        ctx.fillStyle = gameState.hour >= 18 || gameState.hour < 6 ? '#ffee88' : '#445';
        ctx.fillRect(dx - 2, dy - 20, 4, 24);
        ctx.beginPath();
        ctx.arc(dx, dy - 22, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.type === 'neon') {
        ctx.fillStyle = ZONES.downtown.accent;
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.003) * 0.3;
        ctx.fillRect(dx, dy, 40, 6);
        ctx.globalAlpha = 1;
      }
    }

    for (const p of this.portals) {
      const pulse = 0.5 + Math.sin(Date.now() * 0.004) * 0.3;
      const grd = ctx.createRadialGradient(p.x - cx, p.y - cy, 0, p.x - cx, p.y - cy, p.r);
      grd.addColorStop(0, p.type === 'time' ? 'rgba(180,68,255,0.6)' : 'rgba(255,100,200,0.5)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x - cx, p.y - cy, p.r * pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    if (light < 1) {
      ctx.fillStyle = `rgba(5, 5, 25, ${1 - light})`;
      ctx.fillRect(0, 0, cw, ch);
    }
  }
}
