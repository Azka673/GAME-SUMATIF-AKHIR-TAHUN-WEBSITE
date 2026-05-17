/** Minimap system */
import { WORLD_W, WORLD_H, ZONES } from './world.js';

export class Minimap {
  constructor(game) {
    this.game = game;
    this.canvas = document.getElementById('minimap-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.container = document.getElementById('minimap-container');
    this.visible = true;
    this.scale = 180 / WORLD_W;
  }

  toggle() {
    this.visible = !this.visible;
    this.container?.classList.toggle('collapsed', !this.visible);
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const s = this.scale * (h / (WORLD_H / WORLD_W));

    ctx.fillStyle = '#0a1020';
    ctx.fillRect(0, 0, w, h);

    for (const zone of Object.values(ZONES)) {
      ctx.fillStyle = zone.color;
      ctx.fillRect(zone.x * s, zone.y * s * 0.75, zone.w * s, zone.h * s * 0.75);
    }

    const px = this.game.player.x * s;
    const py = this.game.player.y * s * 0.75;
    ctx.fillStyle = '#00f5ff';
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();

    this.game.npcManager?.npcs.forEach(npc => {
      if (npc.nightOnly && this.game.hour >= 6 && this.game.hour < 20) return;
      ctx.fillStyle = '#88ff88';
      ctx.fillRect(npc.x * s - 1, npc.y * s * 0.75 - 1, 3, 3);
    });

    this.game.npcManager?.lostItemsWorld.forEach(item => {
      if (item.found) return;
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(item.x * s - 1, item.y * s * 0.75 - 1, 3, 3);
    });

    this.game.world.portals.forEach(p => {
      ctx.fillStyle = '#b24dff';
      ctx.beginPath();
      ctx.arc(p.x * s, p.y * s * 0.75, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    if (this.game.eventSystem?.activeEvent) {
      ctx.strokeStyle = '#ff3333';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, w - 4, h - 4);
    }
  }
}
