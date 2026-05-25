/** Minimap sekolah — M = perbesar / perkecil */
import { WORLD_W, FLOOR_H, ROOMS } from './world.js';

export class Minimap {
  constructor(game) {
    this.game = game;
    this.canvas = document.getElementById('minimap-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.container = document.getElementById('minimap-container');
    this.visible = true;
    this.zoomIndex = 1;
    this.zoomLevels = [
      { w: 120, h: 90, label: 'Kecil', class: 'minimap-small' },
      { w: 180, h: 140, label: 'Normal', class: '' },
      { w: 300, h: 220, label: 'Besar', class: 'minimap-large' },
      { w: 420, h: 300, label: 'XL', class: 'minimap-xl' },
    ];
    this._applyZoom();
  }

  cycleZoom() {
    this.zoomIndex = (this.zoomIndex + 1) % this.zoomLevels.length;
    this._applyZoom();
    const z = this.zoomLevels[this.zoomIndex];
    this.game.ui?.notify(`Peta: ${z.label}`, 'info');
  }

  _applyZoom() {
    const z = this.zoomLevels[this.zoomIndex];
    if (this.canvas) {
      this.canvas.width = z.w;
      this.canvas.height = z.h;
    }
    if (this.container) {
      this.container.classList.remove('minimap-small', 'minimap-large', 'minimap-xl');
      if (z.class) this.container.classList.add(z.class);
    }
  }

  toggle() {
    this.visible = !this.visible;
    this.container?.classList.toggle('minimap-hidden', !this.visible);
  }

  draw() {
    if (!this.ctx || !this.canvas || !this.visible) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const floor = this.game.player.floor;
    const sx = w / WORLD_W;
    const sy = h / FLOOR_H;
    const foy = this.game.world.floorOffset(floor);

    ctx.fillStyle = '#0a1020';
    ctx.fillRect(0, 0, w, h);

    ROOMS.filter(r => r.floor === floor).forEach(room => {
      ctx.fillStyle = room.color;
      ctx.fillRect(room.x * sx, room.y * sy, room.w * sx, room.h * sy);
      ctx.strokeStyle = room.accent;
      ctx.lineWidth = 1;
      ctx.strokeRect(room.x * sx, room.y * sy, room.w * sx, room.h * sy);
    });

    ctx.fillStyle = '#2a3350';
    (this.game.world.hallways || []).filter(hl => hl.floor === floor).forEach(hl => {
      const ly = (hl.y - foy) * sy;
      ctx.fillRect(hl.x * sx, ly, hl.w * sx, hl.h * sy);
    });

    const px = this.game.player.x * sx;
    const py = (this.game.player.y - foy) * sy;
    ctx.fillStyle = '#00f5ff';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    this.game.npcManager?.npcs.filter(n => n.floor === floor).forEach(n => {
      ctx.fillStyle = n.hasQuest ? (n.panicking ? '#ff6666' : '#ffd700') : '#88ff88';
      ctx.fillRect(n.x * sx - 2, (n.y - foy) * sy - 2, 4, 4);
    });

    this.game.npcManager?.lostItemsWorld.filter(i => i.floor === floor && !i.found).forEach(item => {
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(item.x * sx, (item.y - foy) * sy, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 10px Orbitron, sans-serif';
    ctx.fillText(`LANTAI ${floor + 1}`, 6, 14);
    ctx.fillStyle = '#888';
    ctx.font = '9px Rajdhani, sans-serif';
    ctx.fillText(this.zoomLevels[this.zoomIndex].label, 6, h - 6);
  }
}
