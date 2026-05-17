/** Minimap sekolah — per lantai */
import { WORLD_W, FLOOR_H, ROOMS } from './world.js';

export class Minimap {
  constructor(game) {
    this.game = game;
    this.canvas = document.getElementById('minimap-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.container = document.getElementById('minimap-container');
    this.visible = true;
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
    const floor = this.game.player.floor;
    const sx = w / WORLD_W;
    const sy = h / FLOOR_H;

    ctx.fillStyle = '#0a1020';
    ctx.fillRect(0, 0, w, h);

    ROOMS.filter(r => r.floor === floor).forEach(room => {
      ctx.fillStyle = room.color;
      ctx.fillRect(room.x * sx, room.y * sy, room.w * sx, room.h * sy);
      ctx.strokeStyle = room.accent + '66';
      ctx.strokeRect(room.x * sx, room.y * sy, room.w * sx, room.h * sy);
    });

    ctx.fillStyle = '#1e2230';
    this.game.world.hallways.filter(hl => hl.floor === floor).forEach(hl => {
      const ly = (hl.y - this.game.world.floorOffset(floor)) * sy;
      ctx.fillRect(hl.x * sx, ly, hl.w * sx, hl.h * sy);
    });

    const px = this.game.player.x * sx;
    const py = (this.game.player.y - this.game.world.floorOffset(floor)) * sy;
    ctx.fillStyle = '#00f5ff';
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();

    this.game.npcManager?.npcs.filter(n => n.floor === floor).forEach(n => {
      ctx.fillStyle = n.isTeacher ? '#ffd700' : '#88ff88';
      ctx.fillRect(n.x * sx - 1, (n.y - this.game.world.floorOffset(floor)) * sy - 1, 3, 3);
    });

    this.game.npcManager?.lostItemsWorld.filter(i => i.floor === floor && !i.found).forEach(item => {
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(item.x * sx - 1, (item.y - this.game.world.floorOffset(floor)) * sy - 1, 4, 4);
    });

    ctx.fillStyle = '#00f5ff';
    ctx.font = '10px Orbitron, sans-serif';
    ctx.fillText(`L${floor + 1}`, 4, 12);
  }
}
