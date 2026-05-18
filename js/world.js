/** Sekolah Echo — peta 3 lantai, ruangan, tangga, detail interior */
export const WORLD_W = 2000;
export const FLOOR_H = 900;
export const WORLD_H = FLOOR_H * 3;
export const TILE = 40;
export const FLOORS = 3;

export const SCHOOL_ITEMS = [
  'student_id', 'phone', 'bag', 'keys', 'notebook', 'calculator',
  'usb_drive', 'lunch_box', 'sports_jersey', 'glasses', 'earbuds',
  'family_photo', 'old_doll', 'memory_crystal',
];

export const ITEM_META = {
  student_id: { icon: '🪪', rarity: 'normal', echo: 'neutral', name: 'Kartu Pelajar' },
  phone: { icon: '📱', rarity: 'normal', echo: 'mysterious', name: 'HP Siswa' },
  bag: { icon: '🎒', rarity: 'normal', echo: 'neutral', name: 'Tas Sekolah' },
  keys: { icon: '🔑', rarity: 'normal', echo: 'happy', name: 'Kunci Loker' },
  notebook: { icon: '📓', rarity: 'normal', echo: 'sad', name: 'Buku Catatan' },
  calculator: { icon: '🔢', rarity: 'normal', echo: 'neutral', name: 'Kalkulator' },
  usb_drive: { icon: '💾', rarity: 'normal', echo: 'mysterious', name: 'Flashdisk' },
  lunch_box: { icon: '🍱', rarity: 'normal', echo: 'happy', name: 'Kotak Bekal' },
  sports_jersey: { icon: '👕', rarity: 'normal', echo: 'happy', name: 'Jersey Olahraga' },
  glasses: { icon: '👓', rarity: 'normal', echo: 'sad', name: 'Kacamata' },
  earbuds: { icon: '🎧', rarity: 'normal', echo: 'neutral', name: 'Earphone' },
  family_photo: { icon: '🖼️', rarity: 'emotional', echo: 'sad', name: 'Foto Keluarga', dream: true },
  old_doll: { icon: '🧸', rarity: 'emotional', echo: 'sad', name: 'Boneka Kenangan', dream: true },
  memory_crystal: { icon: '🔮', rarity: 'supernatural', echo: 'mysterious', name: 'Kristal Memori' },
};

/** Ruangan per lantai — player bisa masuk semua area */
export const ROOMS = [
  // Lantai 1
  { id: 'lobby', floor: 0, x: 720, y: 620, w: 560, h: 260, name: 'Lobby & Pintu Masuk', type: 'hall', color: '#2a3048', accent: '#88aaff' },
  { id: 'kantin', floor: 0, x: 40, y: 80, w: 520, h: 380, name: 'Kantin', type: 'cafeteria', color: '#3a2820', accent: '#ffaa66' },
  { id: 'kelas_1a', floor: 0, x: 40, y: 500, w: 300, h: 280, name: 'Kelas 1-A', type: 'classroom', color: '#1e2838', accent: '#66ccff' },
  { id: 'kelas_1b', floor: 0, x: 360, y: 500, w: 300, h: 280, name: 'Kelas 1-B', type: 'classroom', color: '#1e2838', accent: '#66ccff' },
  { id: 'perpus_bawah', floor: 0, x: 1240, y: 80, w: 380, h: 320, name: 'Perpustakaan', type: 'library', color: '#28201a', accent: '#ccaa66' },
  { id: 'uks', floor: 0, x: 1240, y: 430, w: 280, h: 200, name: 'UKS', type: 'medical', color: '#1a3028', accent: '#66ffaa' },
  { id: 'kantor_guru_1', floor: 0, x: 1540, y: 80, w: 420, h: 220, name: 'Kantor Guru', type: 'office', color: '#2a2040', accent: '#cc88ff' },
  { id: 'gym', floor: 0, x: 1540, y: 330, w: 420, h: 450, name: 'Gor Olahraga', type: 'gym', color: '#1a2830', accent: '#44ff88' },
  { id: 'toilet_1', floor: 0, x: 700, y: 80, w: 160, h: 140, name: 'Toilet Lantai 1', type: 'toilet', color: '#222228', accent: '#aaa' },
  // Lantai 2
  { id: 'koridor_2', floor: 1, x: 680, y: 80, w: 640, h: 120, name: 'Koridor Utama Lantai 2', type: 'hall', color: '#252a38', accent: '#88aaff' },
  { id: 'kelas_2a', floor: 1, x: 40, y: 220, w: 300, h: 280, name: 'Kelas 2-A', type: 'classroom', color: '#1e2838', accent: '#66ccff' },
  { id: 'kelas_2b', floor: 1, x: 360, y: 220, w: 300, h: 280, name: 'Kelas 2-B', type: 'classroom', color: '#1e2838', accent: '#66ccff' },
  { id: 'kelas_2c', floor: 1, x: 40, y: 540, w: 300, h: 280, name: 'Kelas 2-C', type: 'classroom', color: '#1e2838', accent: '#66ccff' },
  { id: 'lab_ipa', floor: 1, x: 1240, y: 220, w: 360, h: 300, name: 'Lab IPA', type: 'lab', color: '#1a2830', accent: '#44ffcc' },
  { id: 'lab_komputer', floor: 1, x: 1240, y: 540, w: 360, h: 280, name: 'Lab Komputer', type: 'lab', color: '#1a2038', accent: '#00f5ff' },
  { id: 'lab_bahasa', floor: 1, x: 1620, y: 220, w: 340, h: 280, name: 'Lab Bahasa', type: 'lab', color: '#281a30', accent: '#ff88cc' },
  { id: 'ruang_guru_2', floor: 1, x: 1620, y: 540, w: 340, h: 280, name: 'Ruang Guru', type: 'office', color: '#2a2040', accent: '#cc88ff' },
  { id: 'osis', floor: 1, x: 360, y: 540, w: 280, h: 280, name: 'Ruang OSIS', type: 'office', color: '#302818', accent: '#ffcc44' },
  { id: 'toilet_2', floor: 1, x: 700, y: 540, w: 160, h: 140, name: 'Toilet Lantai 2', type: 'toilet', color: '#222228', accent: '#aaa' },
  // Lantai 3
  { id: 'koridor_3', floor: 2, x: 680, y: 80, w: 640, h: 120, name: 'Koridor Utama Lantai 3', type: 'hall', color: '#252a38', accent: '#88aaff' },
  { id: 'kelas_3a', floor: 2, x: 40, y: 220, w: 300, h: 280, name: 'Kelas 3-A', type: 'classroom', color: '#1e2838', accent: '#66ccff' },
  { id: 'kelas_3b', floor: 2, x: 360, y: 220, w: 300, h: 280, name: 'Kelas 3-B', type: 'classroom', color: '#1e2838', accent: '#66ccff' },
  { id: 'seni', floor: 2, x: 40, y: 540, w: 300, h: 280, name: 'Ruang Seni', type: 'art', color: '#301a28', accent: '#ff66aa' },
  { id: 'musik', floor: 2, x: 360, y: 540, w: 300, h: 280, name: 'Ruang Musik', type: 'music', color: '#1a1830', accent: '#aa66ff' },
  { id: 'perpus_atas', floor: 2, x: 1240, y: 220, w: 380, h: 300, name: 'Perpustakaan Atas', type: 'library', color: '#28201a', accent: '#ccaa66' },
  { id: 'kepsek', floor: 2, x: 1240, y: 540, w: 360, h: 280, name: 'Ruang Kepala Sekolah', type: 'office', color: '#302818', accent: '#ffd700' },
  { id: 'rooftop', floor: 2, x: 1620, y: 220, w: 340, h: 600, name: 'Akses Rooftop', type: 'outdoor', color: '#1a2838', accent: '#88ddff' },
  { id: 'toilet_3', floor: 2, x: 700, y: 540, w: 160, h: 140, name: 'Toilet Lantai 3', type: 'toilet', color: '#222228', accent: '#aaa' },
];

export class World {
  constructor() {
    this.rooms = ROOMS.map(r => ({ ...r, worldY: r.y + r.floor * FLOOR_H }));
    this.walls = this._buildWalls();
    this.stairs = this._buildStairs();
    this.decorations = this._buildDecorations();
    this.seats = this._buildSeats();
    this.cctvPoints = [
      { x: 900, y: 700, floor: 0, room: 'lobby' },
      { x: 300, y: 250, floor: 0, room: 'kantin' },
      { x: 1420, y: 380, floor: 1, room: 'lab_ipa' },
      { x: 1420, y: 680, floor: 1, room: 'lab_komputer' },
    ];
    this.hallways = this._buildHallways();
  }

  floorOffset(floor) {
    return floor * FLOOR_H;
  }

  _buildHallways() {
    const halls = [];
    for (let f = 0; f < FLOORS; f++) {
      const oy = this.floorOffset(f);
      halls.push(
        { floor: f, x: 660, y: oy + 200, w: 680, h: 100 },
        { floor: f, x: 940, y: oy + 200, w: 120, h: 500 },
        { floor: f, x: 660, y: oy + 480, w: 680, h: 100 },
      );
    }
    return halls;
  }

  _buildWalls() {
    const walls = [];
    const W = 24;
    for (let f = 0; f < FLOORS; f++) {
      const oy = this.floorOffset(f);
      walls.push({ floor: f, x: 0, y: oy, w: WORLD_W, h: W });
      walls.push({ floor: f, x: 0, y: oy + FLOOR_H - W, w: WORLD_W, h: W });
      walls.push({ floor: f, x: 0, y: oy, w: W, h: FLOOR_H });
      walls.push({ floor: f, x: WORLD_W - W, y: oy, w: W, h: FLOOR_H });
    }

    const doorGaps = (room, side) => {
      const oy = this.floorOffset(room.floor);
      const rx = room.x, ry = room.y + oy, rw = room.w, rh = room.h;
      const gap = 70;
      if (side === 'top') return { x: rx + rw / 2 - gap / 2, y: ry - W, w: gap, h: W };
      if (side === 'bottom') return { x: rx + rw / 2 - gap / 2, y: ry + rh, w: gap, h: W };
      if (side === 'left') return { x: rx - W, y: ry + rh / 2 - gap / 2, w: W, h: gap };
      if (side === 'right') return { x: rx + rw, y: ry + rh / 2 - gap / 2, w: W, h: gap };
      return null;
    };

    return walls;
  }

  _buildStairs() {
    return [
      { floor: 0, x: 930, y: 380, w: 140, h: 100, toFloor: 1, label: 'Naik ke Lantai 2' },
      { floor: 1, x: 930, y: 380 + FLOOR_H, w: 140, h: 100, toFloor: 0, label: 'Turun ke Lantai 1' },
      { floor: 1, x: 930, y: 180 + FLOOR_H, w: 140, h: 80, toFloor: 2, label: 'Naik ke Lantai 3' },
      { floor: 2, x: 930, y: 380 + FLOOR_H * 2, w: 140, h: 100, toFloor: 1, label: 'Turun ke Lantai 2' },
    ];
  }

  _buildDecorations() {
    const dec = [];
    ROOMS.forEach(room => {
      const oy = this.floorOffset(room.floor);
      const cx = room.x + room.w / 2;
      const cy = room.y + oy + room.h / 2;

      if (room.type === 'classroom') {
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 4; col++) {
            const dx = room.x + 36 + col * 58;
            const dy = room.y + oy + 58 + row * 58;
            dec.push({ floor: room.floor, x: dx, y: dy, type: 'desk', color: room.accent });
            dec.push({ floor: room.floor, x: dx + 4, y: dy + 30, type: 'chair', color: room.accent });
          }
        }
        dec.push({ floor: room.floor, x: room.x + room.w / 2 - 45, y: room.y + oy + 28, type: 'board', color: room.accent });
        dec.push({ floor: room.floor, x: room.x + 12, y: room.y + oy + room.h - 35, type: 'plant', color: '#44ff88' });
        dec.push({ floor: room.floor, x: room.x + room.w - 40, y: room.y + oy + 40, type: 'window', color: '#88ddff' });
        dec.push({ floor: room.floor, x: room.x + room.w - 90, y: room.y + oy + 50, type: 'poster', color: '#ff88cc' });
      }
      if (room.type === 'cafeteria') {
        for (let i = 0; i < 8; i++) {
          dec.push({ floor: room.floor, x: room.x + 60 + (i % 4) * 110, y: room.y + oy + 80 + Math.floor(i / 4) * 120, type: 'table' });
        }
      }
      if (room.type === 'lab') {
        for (let i = 0; i < 4; i++) {
          dec.push({ floor: room.floor, x: room.x + 50 + i * 80, y: room.y + oy + room.h - 100, type: 'lab_table' });
        }
        dec.push({ floor: room.floor, x: room.x + room.w - 80, y: room.y + oy + 50, type: 'cabinet' });
      }
      if (room.type === 'library') {
        for (let i = 0; i < 6; i++) {
          dec.push({ floor: room.floor, x: room.x + 30 + i * 55, y: room.y + oy + 50, type: 'bookshelf' });
          dec.push({ floor: room.floor, x: room.x + 30 + i * 55, y: room.y + oy + room.h - 80, type: 'bookshelf' });
        }
      }
      if (room.type === 'gym') {
        dec.push({ floor: room.floor, x: cx - 60, y: cy, type: 'hoop' });
        dec.push({ floor: room.floor, x: room.x + 80, y: room.y + oy + 100, type: 'bench_gym' });
      }
      if (room.type === 'hall' || room.id.startsWith('koridor')) {
        for (let i = 0; i < 5; i++) {
          dec.push({ floor: room.floor, x: 700 + i * 120, y: room.y + oy + (room.h || 80) / 2, type: 'locker' });
        }
      }
    });
    return dec;
  }

  _buildSeats() {
    const seats = [];
    ROOMS.filter(r => r.type === 'classroom').forEach(room => {
      const oy = this.floorOffset(room.floor);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          seats.push({
            floor: room.floor,
            roomId: room.id,
            x: room.x + 40 + col * 58,
            y: room.y + oy + 72 + row * 58,
          });
        }
      }
    });
    return seats;
  }

  getSeatsInRoom(roomId, floor) {
    return (this.seats || []).filter(s => s.roomId === roomId && s.floor === floor);
  }

  getRoomAt(x, y, floor) {
    const oy = this.floorOffset(floor);
    for (const room of this.rooms) {
      if (room.floor !== floor) continue;
      const ry = room.y + oy;
      if (x >= room.x && x < room.x + room.w && y >= ry && y < ry + room.h) return room;
    }
    for (const h of this.hallways) {
      if (h.floor !== floor) continue;
      if (x >= h.x && x < h.x + h.w && y >= h.y && y < h.y + h.h) {
        return { id: 'hallway', name: `Koridor Lantai ${floor + 1}`, type: 'hall', floor, color: '#252a38', accent: '#88aaff' };
      }
    }
    return { id: 'unknown', name: `Area Lantai ${floor + 1}`, type: 'void', floor, color: '#1a1a22', accent: '#666' };
  }

  getZoneAt(x, y, floor = 0) {
    return this.getRoomAt(x, y, floor);
  }

  getRoomById(id) {
    return this.rooms.find(r => r.id === id);
  }

  collides(x, y, w, h, floor) {
    for (const wall of this.walls) {
      if (wall.floor !== floor) continue;
      if (x + w > wall.x && x < wall.x + wall.w && y + h > wall.y && y < wall.y + wall.h) return true;
    }
    return false;
  }

  getStairAt(x, y, floor) {
    return this.stairs.find(s =>
      s.floor === floor &&
      x >= s.x && x <= s.x + s.w &&
      y >= s.y && y <= s.y + s.h
    );
  }

  getRandomSpawnPoint(floor, roomId = null) {
    let room;
    if (roomId) room = this.getRoomById(roomId);
    else {
      const floorRooms = ROOMS.filter(r => r.floor === floor && r.type !== 'hall' && !r.id.startsWith('koridor') && r.type !== 'toilet');
      room = floorRooms[Math.floor(Math.random() * floorRooms.length)];
    }
    if (!room) return { x: 500, y: this.floorOffset(floor) + 400 };
    const oy = this.floorOffset(room.floor);
    return {
      x: room.x + 40 + Math.random() * (room.w - 80),
      y: room.y + oy + 40 + Math.random() * (room.h - 80),
      roomId: room.id,
    };
  }

  getLightLevel() {
    return 1;
  }

  draw(ctx, camera, gameState) {
    const { x: cx, y: cy, w: cw, h: ch } = camera;
    const floor = gameState.floor ?? 0;
    const oy = this.floorOffset(floor);

    ctx.fillStyle = '#12141c';
    ctx.fillRect(0, 0, cw, ch);

    const floorRooms = this.rooms.filter(r => r.floor === floor);
    floorRooms.forEach(room => {
      const rx = room.x - cx;
      const ry = room.y + oy - cy;
      if (rx + room.w < 0 || rx > cw || ry + room.h < 0 || ry > ch) return;

      const grd = ctx.createLinearGradient(rx, ry, rx + room.w, ry + room.h);
      grd.addColorStop(0, room.color);
      grd.addColorStop(1, this._tintColor(room.color, 25));
      ctx.fillStyle = grd;
      ctx.fillRect(rx, ry, room.w, room.h);

      const tileSize = 40;
      ctx.strokeStyle = room.accent + '22';
      ctx.lineWidth = 1;
      for (let tx = 0; tx < room.w; tx += tileSize) {
        for (let ty = 0; ty < room.h; ty += tileSize) {
          ctx.strokeRect(rx + tx, ry + ty, tileSize, tileSize);
        }
      }

      ctx.strokeStyle = room.accent + '55';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx + 2, ry + 2, room.w - 4, room.h - 4);

      ctx.fillStyle = room.accent + 'cc';
      ctx.font = 'bold 13px Rajdhani, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(room.name, rx + 12, ry + 22);

      if (room.type === 'classroom') {
        ctx.fillStyle = room.accent + '44';
        ctx.fillRect(rx + room.w / 2 - 50, ry + 8, 100, 8);
      }
    });

    (this.hallways || []).filter(h => h.floor === floor).forEach(h => {
      const hx = h.x - cx, hy = h.y - cy;
      ctx.fillStyle = '#252a42';
      ctx.fillRect(hx, hy, h.w, h.h);
      ctx.strokeStyle = '#5a6a99';
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(hx, hy, h.w, h.h);
      ctx.setLineDash([]);
    });

    (this.walls || []).filter(w => w.floor === floor).forEach(w => {
      if (w.x + w.w < cx || w.x > cx + cw) return;
      ctx.fillStyle = '#2a2e3a';
      ctx.fillRect(w.x - cx, w.y - cy, w.w, w.h);
      ctx.strokeStyle = '#4a5068';
      ctx.strokeRect(w.x - cx, w.y - cy, w.w, w.h);
    });

    (this.decorations || []).filter(d => d.floor === floor).forEach(d => {
      const dx = d.x - cx, dy = d.y - cy;
      if (dx < -50 || dx > cw + 50) return;
      this._drawDecoration(ctx, d, dx, dy);
    });

    (this.stairs || []).filter(s => s.floor === floor).forEach(s => {
      const sx = s.x - cx, sy = s.y - cy;
      const pulse = 0.7 + Math.sin(Date.now() * 0.004) * 0.3;
      ctx.fillStyle = `rgba(0, 245, 255, ${0.15 * pulse})`;
      ctx.fillRect(sx, sy, s.w, s.h);
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, s.w, s.h);
      ctx.fillStyle = '#00f5ff';
      ctx.font = '11px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.toFloor > floor ? '▲ NAIK' : '▼ TURUN', sx + s.w / 2, sy + s.h / 2 + 4);
    });

    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(12, 12, 180, 36);
    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 14px Orbitron, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`LANTAI ${floor + 1}`, 24, 36);
  }

  _tintColor(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, ((n >> 16) & 255) + amt);
    const g = Math.min(255, ((n >> 8) & 255) + amt);
    const b = Math.min(255, (n & 255) + amt);
    return `rgb(${r},${g},${b})`;
  }

  _drawDecoration(ctx, d, dx, dy) {
    const ac = d.color || '#88aaff';
    switch (d.type) {
      case 'desk':
        ctx.fillStyle = '#4a3828';
        ctx.fillRect(dx, dy + 20, 44, 14);
        ctx.fillStyle = '#6a5040';
        ctx.fillRect(dx, dy, 44, 22);
        ctx.fillStyle = ac + '55';
        ctx.fillRect(dx + 4, dy + 4, 36, 14);
        break;
      case 'chair':
        ctx.fillStyle = '#3a4a6a';
        ctx.fillRect(dx, dy + 14, 28, 6);
        ctx.fillStyle = ac + '88';
        ctx.fillRect(dx + 4, dy, 20, 16);
        ctx.fillStyle = '#2a3550';
        ctx.fillRect(dx + 2, dy + 18, 4, 10);
        ctx.fillRect(dx + 22, dy + 18, 4, 10);
        break;
      case 'plant':
        ctx.fillStyle = '#2a4a30';
        ctx.fillRect(dx, dy + 18, 22, 14);
        ctx.fillStyle = d.color || '#44ff88';
        ctx.beginPath();
        ctx.arc(dx + 11, dy + 10, 14, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'window':
        ctx.fillStyle = '#aaddff';
        ctx.fillRect(dx, dy, 28, 40);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(dx, dy, 28, 40);
        ctx.strokeRect(dx + 14, dy, 1, 40);
        ctx.strokeRect(dx, dy + 20, 28, 1);
        break;
      case 'poster':
        ctx.fillStyle = d.color || '#ff88cc';
        ctx.fillRect(dx, dy, 36, 48);
        ctx.fillStyle = '#fff';
        ctx.font = '8px sans-serif';
        ctx.fillText('ECHO', dx + 6, dy + 28);
        break;
      case 'board':
        ctx.fillStyle = '#1a4030';
        ctx.fillRect(dx, dy, 80, 50);
        ctx.fillStyle = '#fff3';
        ctx.font = '10px sans-serif';
        ctx.fillText('Papan Tulis', dx + 8, dy + 28);
        break;
      case 'table':
        ctx.fillStyle = '#5a4030';
        ctx.fillRect(dx, dy, 50, 50);
        ctx.fillStyle = '#8a6040';
        ctx.beginPath();
        ctx.arc(dx + 25, dy + 20, 18, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'lab_table':
        ctx.fillStyle = '#2a3848';
        ctx.fillRect(dx, dy, 70, 40);
        ctx.fillStyle = '#00f5ff44';
        ctx.fillRect(dx + 10, dy + 8, 20, 20);
        ctx.fillRect(dx + 40, dy + 8, 20, 20);
        break;
      case 'bookshelf':
        ctx.fillStyle = '#4a3828';
        ctx.fillRect(dx, dy, 40, 60);
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = ['#c44', '#4a4', '#44c', '#cc4'][i];
          ctx.fillRect(dx + 4, dy + 6 + i * 13, 32, 10);
        }
        break;
      case 'locker':
        ctx.fillStyle = '#3a4050';
        ctx.fillRect(dx, dy, 28, 50);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(dx + 20, dy + 24, 4, 4);
        break;
      case 'hoop':
        ctx.strokeStyle = '#ff6644';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(dx, dy, 25, 0, Math.PI * 2);
        ctx.stroke();
        break;
      default:
        ctx.fillStyle = '#444';
        ctx.fillRect(dx, dy, 20, 20);
    }
  }
}
