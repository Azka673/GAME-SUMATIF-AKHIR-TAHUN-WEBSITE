/** Weather effects — rain, fog, storm */
export class WeatherSystem {
  constructor(game) {
    this.game = game;
    this.type = 'clear';
    this.particles = [];
    this.effectsCanvas = document.getElementById('effects-canvas');
    this.ctx = this.effectsCanvas?.getContext('2d');
  }

  setWeather(type) {
    this.type = type;
    document.body.classList.remove('rain-overlay', 'fog-overlay');
    if (type === 'rain' || type === 'storm') document.body.classList.add('rain-overlay');
    if (type === 'fog') document.body.classList.add('fog-overlay');
    this.particles = [];
    const count = type === 'storm' ? 200 : type === 'rain' ? 150 : type === 'fog' ? 80 : 0;
    for (let i = 0; i < count; i++) {
      this.particles.push(this._createParticle(type));
    }
  }

  _createParticle(type) {
    const w = window.innerWidth, h = window.innerHeight;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      speed: type === 'rain' ? 8 + Math.random() * 12 : 0.5 + Math.random(),
      len: type === 'rain' ? 10 + Math.random() * 20 : 30 + Math.random() * 50,
      alpha: 0.2 + Math.random() * 0.4,
    };
  }

  resize() {
    if (this.effectsCanvas) {
      this.effectsCanvas.width = window.innerWidth;
      this.effectsCanvas.height = window.innerHeight;
    }
  }

  update(dt) {
    if (this.type === 'clear') return;
    const w = this.effectsCanvas?.width || window.innerWidth;
    const h = this.effectsCanvas?.height || window.innerHeight;
    this.particles.forEach(p => {
      if (this.type === 'rain' || this.type === 'storm') {
        p.y += p.speed;
        p.x += 2;
        if (p.y > h) { p.y = -10; p.x = Math.random() * w; }
      } else if (this.type === 'fog') {
        p.x += p.speed * 0.3;
        if (p.x > w) p.x = -p.len;
      }
    });
  }

  draw() {
    if (!this.ctx || this.type === 'clear') {
      this.ctx?.clearRect(0, 0, this.effectsCanvas.width, this.effectsCanvas.height);
      return;
    }
    const ctx = this.ctx;
    const w = this.effectsCanvas.width;
    const h = this.effectsCanvas.height;
    ctx.clearRect(0, 0, w, h);

    if (this.type === 'rain' || this.type === 'storm') {
      ctx.strokeStyle = this.type === 'storm' ? 'rgba(150,200,255,0.5)' : 'rgba(150,180,220,0.35)';
      ctx.lineWidth = 1;
      this.particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 3, p.y + p.len);
        ctx.stroke();
      });
      if (this.type === 'storm') {
        if (Math.random() < 0.01) {
          ctx.fillStyle = 'rgba(255,255,200,0.15)';
          ctx.fillRect(0, 0, w, h);
        }
      }
    } else if (this.type === 'fog') {
      this.particles.forEach(p => {
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.len);
        grd.addColorStop(0, 'rgba(200,210,230,0.08)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(p.x - p.len, p.y - p.len, p.len * 2, p.len * 2);
      });
    }
    ctx.globalAlpha = 1;
  }
}
