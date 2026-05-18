/** Player entity — adventure top-down movement */
import { WORLD_W, FLOOR_H } from './world.js';

export class Player {
  constructor(x, y, floor = 0) {
    this.x = x;
    this.y = y;
    this.floor = floor;
    this.w = 28;
    this.h = 36;
    this.speed = 260;
    this.sprintMult = 1.55;
    this.facing = 'down';
    this.stamina = 100;
    this.maxStamina = 100;
    this.sliding = false;
    this.animFrame = 0;
    this.isMoving = false;
    this.color = '#00f5ff';
    this.trail = [];
  }

  reset(x, y, floor = 0) {
    this.x = x;
    this.y = y;
    this.floor = floor;
    this.stamina = this.maxStamina;
    this.sliding = false;
    this.trail = [];
  }

  getCenter() {
    return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
  }

  update(dt, input, movement, world, skillTree = null) {
    const skills = skillTree?.skills || {};
    const mods = movement.getModifiers(this, input, skills);
    let speed = this.speed * (mods.speedMult || 1) * (skillTree?.getSpeedMult?.() || 1);

    if (input.sprint && this.stamina > 0) {
      speed *= this.sprintMult;
      this.stamina = Math.max(0, this.stamina - 20 * dt);
    } else if (this.stamina < this.maxStamina) {
      this.stamina = Math.min(this.maxStamina, this.stamina + 18 * dt);
    }

    let dx = 0;
    let dy = 0;
    if (input.left) { dx -= 1; this.facing = 'left'; }
    if (input.right) { dx += 1; this.facing = 'right'; }
    if (input.up) { dy -= 1; this.facing = 'up'; }
    if (input.down) { dy += 1; this.facing = 'down'; }

    if (dx && dy) {
      dx *= 0.707;
      dy *= 0.707;
    }

    this.isMoving = dx !== 0 || dy !== 0;

    const floor = world.currentFloor ?? this.floor ?? 0;
    const oy = world.floorOffset(floor);

    if (this.isMoving) {
      const stepX = dx * speed * dt;
      const stepY = dy * speed * dt;

      let nx = this.x + stepX;
      if (!world.collides(nx, this.y, this.w, this.h, floor)) {
        this.x = nx;
      } else {
        nx = this.x + stepX * 0.5;
        if (!world.collides(nx, this.y, this.w, this.h, floor)) this.x = nx;
      }

      let ny = this.y + stepY;
      if (!world.collides(this.x, ny, this.w, this.h, floor)) {
        this.y = ny;
      } else {
        ny = this.y + stepY * 0.5;
        if (!world.collides(this.x, ny, this.w, this.h, floor)) this.y = ny;
      }

      this.animFrame += dt * 12;
    }

    const margin = 20;
    this.x = Math.max(margin, Math.min(WORLD_W - this.w - margin, this.x));
    this.y = Math.max(oy + margin, Math.min(oy + FLOOR_H - this.h - margin, this.y));
    this.floor = floor;

    if (this.isMoving) {
      this.trail.push({ x: this.x + this.w / 2, y: this.y + this.h / 2, a: 1 });
      if (this.trail.length > 10) this.trail.shift();
    }
    this.trail.forEach(t => { t.a -= dt * 2.5; });
    this.trail = this.trail.filter(t => t.a > 0);
  }

  draw(ctx, camera) {
    const cx = this.x - camera.x;
    const cy = this.y - camera.y;

    for (const t of this.trail) {
      ctx.globalAlpha = t.a * 0.35;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(t.x - camera.x, t.y - camera.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const bob = this.isMoving ? Math.sin(this.animFrame) * 2.5 : 0;
    const sw = this.w;
    const sh = this.h;

    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(cx + sw / 2, cy + sh + 2, sw / 2.2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0a1520';
    ctx.fillRect(cx - 2, cy - 2 + bob, sw + 4, sh + 4);
    ctx.fillStyle = this.color;
    ctx.fillRect(cx, cy + bob, sw, sh);

    ctx.fillStyle = '#1a2840';
    ctx.fillRect(cx + 4, cy + 8 + bob, sw - 8, sh - 14);

    ctx.fillStyle = '#fff';
    const eyeOff = { left: 6, right: 16, up: 10, down: 14 };
    let ex = cx + 12;
    let ey = cy + eyeOff.down;
    if (this.facing === 'left') ex = cx + eyeOff.left;
    if (this.facing === 'right') ex = cx + eyeOff.right;
    if (this.facing === 'up') ey = cy + eyeOff.up;
    ctx.fillRect(ex, ey + bob, 4, 4);
    ctx.fillRect(ex + 8, ey + bob, 4, 4);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy + bob, sw, sh);

    if (this.isMoving) {
      ctx.fillStyle = 'rgba(0,245,255,0.5)';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      const dirs = { up: '▲', down: '▼', left: '◀', right: '▶' };
      ctx.fillText(dirs[this.facing] || '', cx + sw / 2, cy - 6);
    }
  }
}
