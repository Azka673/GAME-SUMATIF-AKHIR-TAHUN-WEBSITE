/**
 * Enhanced Item System with Rarity, Lore & Effects
 */

export const ITEM_TEMPLATES = {
  book: {
    name: 'Buku Tugas',
    icon: '📚',
    rarity: 'normal',
    value: 80,
    lore: 'Catatan penting untuk tugas minggu ini.',
    owners: ['Bu Siti', 'Pak Hasan'],
  },
  phone: {
    name: 'Smartphone',
    icon: '📱',
    rarity: 'emotional',
    value: 150,
    lore: 'Ponsel yang sangat berharga untuk berkomunikasi dengan keluarga.',
    owners: ['Andi', 'Siti'],
  },
  key: {
    name: 'Kunci Loker',
    icon: '🔑',
    rarity: 'normal',
    value: 60,
    lore: 'Kunci untuk loker pribadi di sekolah.',
    owners: ['Budi', 'Rini'],
  },
  flashdisk: {
    name: 'Flashdisk 16GB',
    icon: '💾',
    rarity: 'supernatural',
    value: 200,
    lore: 'Berisi proyek rahasia yang tidak boleh diketahui orang lain...',
    owners: ['Guru IT', 'Murid Kelas 3'],
  },
  wallet: {
    name: 'Dompet Kulit',
    icon: '👛',
    rarity: 'emotional',
    value: 120,
    lore: 'Dompet berisi kenangan berharga dan uang tabungan.',
    owners: ['Ibu Kepala Sekolah'],
  },
  idcard: {
    name: 'Kartu Pelajar',
    icon: '🎫',
    rarity: 'normal',
    value: 100,
    lore: 'Identitas sebagai siswa sekolah.',
    owners: ['Semua Siswa'],
  },
  letter: {
    name: 'Surat Misterius',
    icon: '💌',
    rarity: 'dangerous',
    value: 300,
    lore: 'Surat dengan pesan tersembunyi... siapa pengirimnya?',
    owners: ['???'],
  },
};

export class Item {
  constructor(type, options = {}) {
    const template = ITEM_TEMPLATES[type] || ITEM_TEMPLATES.book;
    this.type = type;
    this.id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = options.name || template.name;
    this.icon = options.icon || template.icon;
    this.rarity = options.rarity || template.rarity;
    this.value = options.value || template.value;
    this.lore = options.lore || template.lore;
    this.ownerNames = options.ownerNames || template.owners;
    this.ownerId = options.ownerId || null;
    this.found = options.found || false;
    this.foundTime = null;
    this.lastSeenRoom = options.lastSeenRoom || 'lobby';
    this.floor = options.floor || 0;
    
    // Position
    this.x = options.x || 0;
    this.y = options.y || 0;
    
    // Visual
    this.glowIntensity = 0;
    this.glowDirection = 1;
    
    // Metadata
    this.meta = {
      name: this.name,
      rarity: this.rarity,
      owner: this.ownerNames?.[0] || 'Unknown',
      story: this.lore,
    };
  }

  getRarityColor() {
    const colors = {
      'normal': '#aaaaaa',
      'emotional': '#ff6b9d',
      'supernatural': '#b24dff',
      'dangerous': '#ff3333',
    };
    return colors[this.rarity] || colors.normal;
  }

  getRarityGlow() {
    const glows = {
      'normal': '0 0 8px rgba(170, 170, 170, 0.5)',
      'emotional': '0 0 12px rgba(255, 107, 157, 0.6)',
      'supernatural': '0 0 15px rgba(178, 77, 255, 0.7)',
      'dangerous': '0 0 15px rgba(255, 51, 51, 0.8)',
    };
    return glows[this.rarity] || glows.normal;
  }

  update(dt) {
    // Pulse glow animation
    this.glowIntensity += this.glowDirection * dt * 2;
    if (this.glowIntensity >= 1) {
      this.glowIntensity = 1;
      this.glowDirection = -1;
    } else if (this.glowIntensity <= 0) {
      this.glowIntensity = 0;
      this.glowDirection = 1;
    }
  }

  draw(ctx, cameraX, cameraY) {
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;

    ctx.save();
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Glow effect
    const glowSize = 15 + this.glowIntensity * 10;
    ctx.shadowColor = this.getRarityColor();
    ctx.shadowBlur = glowSize;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw icon
    ctx.fillText(this.icon, screenX, screenY);

    // Rarity indicator
    const rarityRadius = 5 + this.glowIntensity * 2;
    ctx.fillStyle = this.getRarityColor();
    ctx.beginPath();
    ctx.arc(screenX + 8, screenY - 8, rarityRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  getDescription() {
    return `
      ${this.name}
      Rarity: ${this.rarity.toUpperCase()}
      Owner: ${this.meta.owner}
      Value: Rp ${this.value}
      
      "${this.lore}"
    `.trim();
  }
}

export class ItemManager {
  constructor() {
    this.items = [];
    this.generateWorldItems();
  }

  generateWorldItems() {
    const rooms = [
      { name: 'Kelas 2-A', floor: 0, positions: [[100, 150], [300, 200]] },
      { name: 'Kelas 2-B', floor: 0, positions: [[500, 150], [700, 200]] },
      { name: 'Kantin', floor: 0, positions: [[900, 400]] },
      { name: 'Perpustakaan', floor: 1, positions: [[200, 300], [600, 350]] },
      { name: 'Lab Komputer', floor: 1, positions: [[800, 250]] },
      { name: 'Ruang OSIS', floor: 2, positions: [[400, 200], [600, 300]] },
    ];

    const itemTypes = Object.keys(ITEM_TEMPLATES);
    let itemCount = 0;

    rooms.forEach(room => {
      room.positions.forEach(pos => {
        const type = itemTypes[itemCount % itemTypes.length];
        const owner = ITEM_TEMPLATES[type].owners[Math.floor(Math.random() * ITEM_TEMPLATES[type].owners.length)];

        const item = new Item(type, {
          x: pos[0] + Math.random() * 20,
          y: pos[1] + Math.random() * 20,
          floor: room.floor,
          lastSeenRoom: room.name,
          ownerId: null,
          ownerNames: [owner],
        });

        this.items.push(item);
        itemCount++;
      });
    });
  }

  getItemAt(x, y, floor, radius = 30) {
    return this.items.find(item =>
      item.floor === floor &&
      !item.found &&
      Math.hypot(item.x - x, item.y - y) < radius
    );
  }

  getAllItemsAt(floor) {
    return this.items.filter(item => item.floor === floor && !item.found);
  }

  markFound(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.found = true;
      item.foundTime = Date.now();
    }
  }

  update(dt) {
    this.items.forEach(item => {
      if (!item.found) item.update(dt);
    });
  }

  draw(ctx, cameraX, cameraY, floor) {
    this.items
      .filter(item => item.floor === floor && !item.found)
      .forEach(item => item.draw(ctx, cameraX, cameraY));
  }
}
