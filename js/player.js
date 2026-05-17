/** Player entity — The Returner */
import { WORLD_W, WORLD_H } from './world.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 28;
    this.h = 36;
    this.vx = 0;
    this.vy = 0;
    this.speed = 220;
    this.sprintMult = 1.65;
    this.facing = 'down';
    this.stamina = 100;
    this.maxStamina = 100;
    this.onGround = true;
    this.jumpCount = 0;
    this.maxJumps = 2;
    this.sliding = false;
    this.wallRunning = false;
    this.onVehicle = null;
    this.animFrame = 0;
    this.color = '#00f5ff';
    this.trail = [];
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.stamina = this.maxStamina;
    this.onGround = true;
    this.jumpCount = 0;
    this.sliding = false;
    this.onVehicle = null;
  }

  getCenter() {
    return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
  }

  update(dt, input, movement, world, skills) {
    const mods = movement.getModifiers(this, input, skills);
    let speed = this.speed * mods.speedMult;
    if (input.sprint && this.stamina > 0 && mods.canSprint) {
      speed *= this.sprintMult;
      this.stamina = Math.max(0, this.stamina - 25 * dt);
    } else if (this.stamina < this.maxStamina) {
      this.stamina = Math.min(this.maxStamina, this.stamina + 15 * dt);
    }

    this.vx = 0;
    this.vy = 0;
    if (input.left) { this.vx = -speed; this.facing = 'left'; }
    if (input.right) { this.vx = speed; this.facing = 'right'; }
    if (input.up) { this.vy = -speed; this.facing = 'up'; }
    if (input.down) { this.vy = speed; this.facing = 'down'; }

    if (this.vx && this.vy) {
      this.vx *= 0.707;
      this.vy *= 0.707;
    }

    if (mods.grappling) {
      this.vy = -180;
      this.onGround = false;
    }

    if (input.jump && this.jumpCount < (skills.doubleJump ? 2 : 1) && mods.canJump) {
      if (this.onGround || this.jumpCount > 0) {
        this.vy = -mods.jumpForce;
        this.onGround = false;
        this.jumpCount++;
      }
    }

    if (this.sliding) {
      this.vx *= 1.4;
      this.h = 22;
      this.y += 14;
    } else {
      this.h = 36;
    }

    let nx = this.x + this.vx * dt;
    let ny = this.y + this.vy * dt;

    if (!world.collides(nx, this.y, this.w, this.h)) this.x = nx;
    else this.vx = 0;

    if (!world.collides(this.x, ny, this.w, this.h)) {
      this.y = ny;
      this.onGround = false;
    } else {
      if (this.vy > 0) this.onGround = true;
      this.vy = 0;
      this.jumpCount = 0;
    }

    if (this.onGround && !input.jump) this.jumpCount = 0;

    this.x = Math.max(0, Math.min(WORLD_W - this.w, this.x));
    this.y = Math.max(0, Math.min(WORLD_H - this.h, this.y));

    if (this.vx || this.vy) this.animFrame += dt * 10;

    this.trail.push({ x: this.x + this.w / 2, y: this.y + this.h / 2, a: 1 });
    if (this.trail.length > 8) this.trail.shift();
    this.trail.forEach(t => t.a -= dt * 2);
    this.trail = this.trail.filter(t => t.a > 0);
  }

  draw(ctx, camera) {
    const cx = this.x - camera.x;
    const cy = this.y - camera.y;

    for (const t of this.trail) {
      ctx.globalAlpha = t.a * 0.3;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(t.x - camera.x, t.y - camera.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const bob = Math.sin(this.animFrame) * 2;
    ctx.fillStyle = '#0a1520';
    ctx.fillRect(cx - 2, cy - 2 + bob, this.w + 4, this.h + 4);
    ctx.fillStyle = this.color;
    ctx.fillRect(cx, cy + bob, this.w, this.h);
    ctx.fillStyle = '#fff';
    const eyeX = this.facing === 'left' ? cx + 6 : this.facing === 'right' ? cx + 18 : cx + 12;
    const eyeY = this.facing === 'up' ? cy + 8 : cy + 12;
    ctx.fillRect(eyeX, eyeY + bob, 4, 4);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy + bob, this.w, this.h);
  }
}
