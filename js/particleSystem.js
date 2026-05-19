/**
 * Particle System — Neon Effects and Visual Polish
 */

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.pool = [];
  }

  spawn(x, y, options = {}) {
    const {
      color = '#00f5ff',
      size = 4,
      lifetime = 1,
      velocity = { x: 0, y: 0 },
      acceleration = { x: 0, y: 0 },
      type = 'glow' // glow, spark, drift, pulse
    } = options;

    const particle = this.pool.pop() || {};
    Object.assign(particle, {
      x, y,
      color,
      size,
      lifetime,
      maxLifetime: lifetime,
      velocity,
      acceleration,
      type,
      alpha: 1
    });

    this.particles.push(particle);
  }

  spawnGlowBurst(x, y, count = 12, colors = ['#00f5ff', '#ff2d95', '#b24dff']) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 40 + Math.random() * 60;
      this.spawn(x, y, {
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
        lifetime: 0.8 + Math.random() * 0.5,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        type: 'glow'
      });
    }
  }

  spawnItemPickup(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      this.spawn(x, y, {
        color: '#ffd700',
        size: 2 + Math.random() * 3,
        lifetime: 0.6,
        velocity: {
          x: Math.cos(angle) * (30 + Math.random() * 40),
          y: Math.sin(angle) * (30 + Math.random() * 40) - 20
        },
        acceleration: { x: 0, y: 60 },
        type: 'spark'
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      p.lifetime -= dt;
      if (p.lifetime <= 0) {
        this.pool.push(this.particles.splice(i, 1)[0]);
        continue;
      }

      p.velocity.x += p.acceleration.x * dt;
      p.velocity.y += p.acceleration.y * dt;
      p.x += p.velocity.x * dt;
      p.y += p.velocity.y * dt;

      p.alpha = p.lifetime / p.maxLifetime;

      switch (p.type) {
        case 'pulse':
          p.size = (2 - p.alpha) * 8;
          break;
        case 'glow':
          p.alpha *= 0.8;
          break;
      }
    }
  }

  draw(ctx, cameraX, cameraY) {
    ctx.save();
    this.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.type === 'glow' ? 15 : 5;
      
      ctx.beginPath();
      ctx.arc(p.x - cameraX, p.y - cameraY, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  clear() {
    this.particles = [];
    this.pool = [];
  }
}
