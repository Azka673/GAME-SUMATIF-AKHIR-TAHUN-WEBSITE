/** NPC Sekolah — murid, guru, jadwal, petunjuk lokasi barang hilang */
import { ITEM_META, SCHOOL_ITEMS, ROOMS } from './world.js';

const STUDENT_NAMES = ['Rina', 'Budi', 'Sari', 'Andi', 'Dewi', 'Fajar', 'Putri', 'Hendra', 'Alya', 'Rizky', 'Nadia', 'Kevin'];
const WALKER_NAMES = ['Dimas', 'Elina', 'Galih', 'Hana', 'Irfan', 'Jihan', 'Kirana', 'Lutfi', 'Mira', 'Niko', 'Olin', 'Prita', 'Qori', 'Rafi', 'Sinta', 'Tyo', 'Umi', 'Vino', 'Wulan', 'Yoga'];
const TEACHER_NAMES = ['Bu Ani', 'Pak Budi', 'Bu Siti', 'Pak Rudi', 'Bu Maya'];

const STUDENT_COLORS = ['#ff88aa', '#88ccff', '#88ffaa', '#ffcc88', '#cc88ff', '#ffaa66', '#66ddff'];

function pickRoom(floor) {
  const rooms = ROOMS.filter(r => r.floor === floor && r.type !== 'toilet' && !r.id.startsWith('koridor'));
  return rooms[Math.floor(Math.random() * rooms.length)];
}

function buildNPCTemplates() {
  const npcs = [];
  let id = 0;

  TEACHER_NAMES.forEach((name, i) => {
    const floor = i % 3;
    const room = pickRoom(floor);
    const oy = floor * 900;
    npcs.push({
      id: `teacher_${id++}`,
      name,
      role: 'guru',
      isTeacher: true,
      floor,
      homeRoom: room.id,
      x: room.x + room.w / 2,
      y: room.y + oy + room.h / 2,
      color: '#ffd700',
      lostItems: [],
      canGiveQuest: true,
      hasQuest: true,
    });
  });

  STUDENT_NAMES.forEach((name, i) => {
    const floor = i % 3;
    const room = pickRoom(floor);
    const oy = floor * 900;
    const itemType = SCHOOL_ITEMS[i % SCHOOL_ITEMS.length];
    const witnessRoom = pickRoom(floor);
    npcs.push({
      id: `student_${id++}`,
      name,
      role: 'murid',
      isTeacher: false,
      floor,
      homeRoom: room.id,
      x: room.x + 40 + Math.random() * (room.w - 80),
      y: room.y + oy + 40 + Math.random() * (room.h - 80),
      color: STUDENT_COLORS[i % STUDENT_COLORS.length],
      lostItems: [itemType],
      lastSeenRoom: witnessRoom.id,
      canBeWitness: true,
      hasQuest: true,
      canSit: room.type === 'classroom',
    });
  });

  WALKER_NAMES.forEach((name, i) => {
    const floor = i % 3;
    const room = pickRoom(floor);
    const oy = floor * 900;
    const isClass = room.type === 'classroom';
    npcs.push({
      id: `walker_${id++}`,
      name,
      role: 'murid',
      isTeacher: false,
      floor,
      homeRoom: room.id,
      x: room.x + 30 + Math.random() * (room.w - 60),
      y: room.y + oy + 30 + Math.random() * (room.h - 60),
      color: STUDENT_COLORS[(i + 5) % STUDENT_COLORS.length],
      lostItems: [],
      hasQuest: false,
      canGiveQuest: false,
      canBeWitness: Math.random() > 0.5,
      canSit: isClass,
    });
  });

  return npcs;
}

export class NPCManager {
  constructor(world) {
    this.world = world;
    this.npcs = [];
    this.lostItemsWorld = [];
    this._initNPCs();
    this._spawnInitialItems(4);
  }

  _initNPCs() {
    buildNPCTemplates().forEach(t => this.npcs.push(new NPC(t, this.world)));
  }

  _spawnInitialItems(count) {
    for (let i = 0; i < count; i++) this._spawnLostItem(true);
  }

  _spawnLostItem(forceOwner = false) {
    const type = SCHOOL_ITEMS[Math.floor(Math.random() * SCHOOL_ITEMS.length)];
    const owner = forceOwner
      ? this.npcs.find(n => n.hasQuest && n.lostItems?.includes(type) && !n.hasLostItem)
      : this.npcs.find(n => n.hasQuest && !n.isTeacher && !n.hasLostItem && Math.random() < 0.35);

    const floor = owner?.floor ?? Math.floor(Math.random() * 3);
    const hintRoomId = owner?.lastSeenRoom || pickRoom(floor).id;
    const spawn = this.world.getRandomSpawnPoint(floor, hintRoomId);

    const item = {
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      x: spawn.x,
      y: spawn.y,
      floor,
      roomId: spawn.roomId,
      meta: ITEM_META[type],
      ownerId: owner?.id || null,
      lastSeenRoom: hintRoomId,
      found: false,
    };

    if (owner) {
      owner.hasLostItem = true;
      owner.lostItemId = item.id;
      owner.panicking = true;
      owner.lastSeenRoom = hintRoomId;
    }

    this.lostItemsWorld.push(item);
    return item;
  }

  update(dt, gameHour, gameState) {
    this.npcs.forEach(npc => npc.update(dt, this.world, gameState.floor));

    if (Math.random() < 0.0015 * dt * 60) this._spawnLostItem();
    this.lostItemsWorld = this.lostItemsWorld.filter(i => !i.found);
  }

  getNearbyNPC(x, y, floor, range = 70) {
    return this.npcs.find(n => {
      if (n.floor !== floor) return false;
      return Math.hypot(n.x - x, n.y - y) < range;
    });
  }

  getNearbyItem(x, y, floor, range = 50) {
    return this.lostItemsWorld.find(i => {
      if (i.floor !== floor || i.found) return false;
      return Math.hypot(i.x - x, i.y - y) < range;
    });
  }

  getWitnessesForItem(item) {
    return this.npcs.filter(n =>
      n.floor === item.floor && n.canBeWitness && n.id !== item.ownerId
    );
  }

  draw(ctx, camera, gameHour, floor) {
    this.npcs.filter(n => n.floor === floor).forEach(npc => npc.draw(ctx, camera));

    this.lostItemsWorld.filter(i => i.floor === floor && !i.found).forEach(item => {
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
  constructor(data, world) {
    Object.assign(this, data);
    this.world = world;
    this.w = 22;
    this.h = 28;
    this.targetX = data.x;
    this.targetY = data.y;
    this.state = 'idle';
    this.stateTimer = 0;
    this.hasLostItem = false;
    this.panicking = false;
    this.dialogueIndex = 0;
    this.walkBounds = this._getWalkBounds();
    this.hasQuest = data.hasQuest ?? false;
    this.canSit = data.canSit ?? (this.world.getRoomById(this.homeRoom)?.type === 'classroom');
    this.sitting = false;
    this.seatTarget = null;
    this.animFrame = 0;
    this.facing = 'down';
    this._setEmoji();
  }

  _setEmoji() {
    if (this.isTeacher) {
      this.emoji = '👨‍🏫';
    } else if (this.role === 'murid') {
      const emojis = ['👦', '👧', '👨', '👩', '🧑'];
      this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
    } else {
      this.emoji = '🧑';
    }
  }

  _getWalkBounds() {
    const room = this.world.getRoomById(this.homeRoom);
    if (!room) return { minX: this.x - 100, maxX: this.x + 100, minY: this.y - 100, maxY: this.y + 100 };
    const oy = this.world.floorOffset(this.floor);
    return {
      minX: room.x + 20,
      maxX: room.x + room.w - 20,
      minY: room.y + oy + 20,
      maxY: room.y + oy + room.h - 20,
    };
  }

  update(dt, world, playerFloor) {
    if (this.floor !== playerFloor) return;
    this.stateTimer -= dt;

    if (this.panicking) {
      this.state = 'panic';
      this._wanderHall(dt, 1.6);
      return;
    }

    switch (this.state) {
      case 'idle':
        if (this.stateTimer <= 0) {
          if (this.canSit && Math.random() < 0.35) {
            this._trySit();
          } else {
            this.sitting = false;
            this.state = Math.random() > 0.35 ? 'walk' : 'talk';
            this.stateTimer = 2 + Math.random() * 4;
            if (this.state === 'walk') this._pickWanderTarget();
          }
        }
        break;
      case 'sit':
        if (this.stateTimer <= 0) {
          this.sitting = false;
          this.state = 'walk';
          this.stateTimer = 1;
          this._pickWanderTarget();
        }
        break;
      case 'walk':
        this._moveToward(dt, this.isTeacher ? 48 : 62);
        if (Math.hypot(this.targetX - this.x, this.targetY - this.y) < 8) {
          this.state = 'idle';
          this.stateTimer = 1;
        }
        break;
      case 'talk':
        if (this.stateTimer <= 0) this.state = 'idle';
        break;
    }
  }

  _trySit() {
    const seats = this.world.getSeatsInRoom(this.homeRoom, this.floor);
    if (!seats.length) return;
    const seat = seats[Math.floor(Math.random() * seats.length)];
    this.x = seat.x;
    this.y = seat.y;
    this.sitting = true;
    this.state = 'sit';
    this.stateTimer = 4 + Math.random() * 6;
  }

  _pickWanderTarget() {
    const b = this.walkBounds;
    for (let i = 0; i < 8; i++) {
      this.targetX = b.minX + Math.random() * (b.maxX - b.minX);
      this.targetY = b.minY + Math.random() * (b.maxY - b.minY);
      if (!this.world.collides(this.targetX, this.targetY, this.w, this.h, this.floor)) break;
    }
  }

  _wanderHall(dt, mult = 1) {
    if (Math.random() < 0.04) this._pickWanderTarget();
    this._moveToward(dt, 70 * mult);
  }

  _moveToward(dt, speed) {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) {
      this.facing = 'idle';
      return;
    }
    
    // Determine facing direction
    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = dx > 0 ? 'right' : 'left';
    } else {
      this.facing = dy > 0 ? 'down' : 'up';
    }
    
    this.animFrame += dt * 10;
    
    const nx = this.x + (dx / dist) * speed * dt;
    const ny = this.y + (dy / dist) * speed * dt;
    if (!this.world.collides(nx, this.y, this.w, this.h, this.floor)) this.x = nx;
    if (!this.world.collides(this.x, ny, this.w, this.h, this.floor)) this.y = ny;
  }

  draw(ctx, camera) {
    const cx = this.x - camera.x;
    const cy = this.y - camera.y;
    const sitOff = this.sitting ? 8 : 0;

    if (this.hasQuest && this.panicking) {
      ctx.fillStyle = '#ff333366';
      ctx.beginPath();
      ctx.arc(cx + 11, cy + 10, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = this.isTeacher ? '#ffd70033' : '#00000033';
    ctx.beginPath();
    ctx.ellipse(cx + 11, cy + 30, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.sitting) {
      ctx.fillStyle = this.color;
      ctx.fillRect(cx, cy + sitOff, 22, 18);
      ctx.beginPath();
      ctx.arc(cx + 11, cy + sitOff - 4, 11, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(cx + 11, cy + 14, this.isTeacher ? 16 : 13, 0, Math.PI * 2);
      ctx.fill();
      if (this.isTeacher) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(cx + 4, cy + 2, 14, 6);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(cx + 2, cy + 4, 18, 8);
      }
    }

    // Draw emoji with walking animation
    const bob = !this.sitting && this.facing !== 'idle' ? Math.sin(this.animFrame * 0.3) * 2 : 0;
    ctx.font = this.sitting ? '24px sans-serif' : '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, cx + 11, cy + 10 - sitOff + bob);
    
    // Walking direction indicator
    if (!this.sitting && this.facing !== 'idle') {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      const dirs = { up: '▲', down: '▼', left: '◀', right: '▶' };
      ctx.fillText(dirs[this.facing] || '', cx + 11, cy - 6 + bob);
    }

    if (this.hasQuest && !this.panicking) {
      ctx.fillStyle = '#ffd700';
      ctx.font = '10px sans-serif';
      ctx.fillText('?', cx + 18, cy - 4);
    }

    if (this.panicking) {
      ctx.fillStyle = '#ff3333';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('!', cx + 8, cy - 6);
    }

    ctx.fillStyle = '#fff';
    ctx.font = `${this.isTeacher ? 11 : 10}px Rajdhani, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(this.name, cx + 11, cy - 10);

    if (this.state === 'talk') {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillRect(cx + 18, cy - 22, 24, 14);
      ctx.fillStyle = '#222';
      ctx.font = '9px sans-serif';
      ctx.fillText('...', cx + 24, cy - 12);
    }
  }

  getLastSeenClue() {
    const room = this.world.getRoomById(this.lastSeenRoom);
    return room?.name || 'koridor sekolah';
  }

  getDialogue(context = {}) {
    const itemName = this.lostItems?.[0] ? (ITEM_META[this.lostItems[0]]?.name || this.lostItems[0]) : 'barang';

    if (this.panicking) {
      return {
        text: `Tolong! Aku kehilangan ${itemName}... Terakhir kali aku ingat ada di dekat ${this.getLastSeenClue()}.`,
        choices: [
          { text: 'Aku akan cari!', action: 'accept_quest' },
          { text: 'Ada petunjuk lain?', action: 'location_clue' },
          { text: 'Nanti ya', action: 'close' },
        ],
      };
    }

    if (!this.hasQuest && !this.isTeacher) {
      return {
        text: `Hai, aku ${this.name}. Lagi istirahat nih, tidak ada tugas untukmu.`,
        choices: [
          { text: 'Tanya petunjuk lokasi', action: 'ask_witness' },
          { text: 'Sampai jumpa', action: 'close' },
        ],
      };
    }

    if (this.isTeacher && this.canGiveQuest) {
      return {
        text: `Selamat datang, Returner. Saya ${this.name}. Banyak barang hilang di sekolah ini — tolong bantu kembalikan ke pemiliknya.`,
        choices: [
          { text: 'Terima tugas mencari barang', action: 'teacher_quest' },
          { text: 'Ada barang hilang di area ini?', action: 'teacher_hint' },
          { text: 'Terima kasih, Pak/Bu', action: 'close' },
        ],
      };
    }

    if (context.askingWitness && context.item) {
      const room = this.world.getRoomById(context.item.lastSeenRoom);
      return {
        text: `Hmm... terakhir kali aku melihat barang itu di ${room?.name || 'suatu tempat'} di lantai ${(context.item.floor || 0) + 1}.`,
        choices: [
          { text: 'Terima kasih infonya!', action: 'add_witness_clue', item: context.item },
          { text: 'Oke', action: 'close' },
        ],
      };
    }

    const lines = [
      `Hai! Aku ${this.name}, murid kelas. Kamu dari organisasi Returners ya?`,
      `Di sekolah ini sering ada barang hilang. Kadang di ${this.getLastSeenClue()}.`,
      `Coba tanya ke teman yang panik — mereka biasanya tahu petunjuknya.`,
    ];
    return {
      text: lines[this.dialogueIndex % lines.length],
      choices: [
        { text: 'Ada yang kehilangan barang?', action: 'lost_check' },
        { text: 'Tanya petunjuk lokasi', action: 'ask_witness' },
        { text: 'Sampai jumpa', action: 'close' },
      ],
    };
  }
}
