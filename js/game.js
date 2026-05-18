/**
 * Lost & Found: Echo Worlds — Sekolah 3 Lantai
 */
import { World, WORLD_W, WORLD_H, FLOOR_H, FLOORS } from './world.js';
import { Player } from './player.js';
import { MovementSystem } from './movement.js';
import { NPCManager } from './npc.js';
import { Inventory } from './inventory.js';
import { DialogueSystem } from './dialogue.js';
import { QuestSystem } from './quests.js';
import { Minimap } from './minimap.js';
import { SaveSystem } from './saveSystem.js';
import { EventSystem } from './eventSystem.js';
import { WeatherSystem } from './weather.js';
import { DreamWorld } from './dreamWorld.js';
import { TimelineSystem } from './timelineSystem.js';
import { ReputationSystem } from './reputation.js';
import { SkillTree } from './skillTree.js';
import { LevelSystem } from './levelSystem.js';
import { AudioManager } from './audio.js';
import { UIManager } from './ui.js';
import { MainMenu } from './mainMenu.js';
import { Shop } from './shop.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.running = false;
    this.paused = false;
    this.hour = 8;
    this.day = 1;
    this.timeScale = 1;
    this.lastTime = 0;
    this.camera = { x: 0, y: 0, w: 0, h: 0 };
    this.onStairCooldown = 0;

    this.input = {
      up: false, down: false, left: false, right: false,
      sprint: false, jump: false, interact: false,
      slide: false, grapple: false,
    };

    this.world = new World();
    this.world.currentFloor = 0;
    this.player = new Player(960, 720, 0);
    this.movement = new MovementSystem();
    this.npcManager = new NPCManager(this.world);
    this.inventory = new Inventory(this);
    this.dialogue = new DialogueSystem(this);
    this.quests = new QuestSystem(this);
    this.minimap = new Minimap(this);
    this.save = new SaveSystem(this);
    this.events = new EventSystem(this);
    this.weather = new WeatherSystem(this);
    this.dream = new DreamWorld(this);
    this.timeline = new TimelineSystem(this);
    this.reputation = new ReputationSystem(this);
    this.skillTree = new SkillTree(this);
    this.level = new LevelSystem(this);
    this.audio = new AudioManager();
    this.ui = new UIManager(this);
    this.menu = new MainMenu(this);
    this.shop = new Shop(this);
  }

  async init() {
    this._resize();
    window.addEventListener('resize', () => this._resize());
    this._bindInput();
    await this.menu.showLoading();
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.camera.w = window.innerWidth;
    this.camera.h = window.innerHeight;
    if (this.canvas) {
      this.canvas.width = this.camera.w * dpr;
      this.canvas.height = this.camera.h * dpr;
      this.canvas.style.width = this.camera.w + 'px';
      this.canvas.style.height = this.camera.h + 'px';
      this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    this.weather.resize();
  }

  _bindInput() {
    const keyMap = {
      KeyW: 'up', ArrowUp: 'up',
      KeyS: 'down', ArrowDown: 'down',
      KeyA: 'left', ArrowLeft: 'left',
      KeyD: 'right', ArrowRight: 'right',
      ShiftLeft: 'sprint', ShiftRight: 'sprint',
      Space: 'jump',
      KeyE: 'interact',
      KeyC: 'slide',
      KeyG: 'grapple',
    };

    window.addEventListener('keydown', e => {
      if (keyMap[e.code]) this.input[keyMap[e.code]] = true;
      if (this.dialogue.active && e.code === 'Escape') this.dialogue.close();
      if (!this.running) return;

      // Pause dengan ESC
      if (e.code === 'Escape') {
        if (this.paused) {
          this.resumeGame();
        } else {
          this.pauseGame();
        }
        return;
      }

      // Tutup panel jika pause belum active
      if (this.paused) return;

      switch (e.code) {
        case 'KeyI': this.inventory.toggle(); break;
        case 'KeyK': this.skillTree.toggle(); break;
        case 'KeyM': this.minimap.cycleZoom(); break;
        case 'KeyP': this.shop.toggle(); break;
        case 'KeyQ': {
          const item = this.inventory.getSelected();
          if (item) this.inventory.triggerEcho(item);
          break;
        }
        case 'KeyF': this._checkCCTV(); break;
        case 'KeyB': this.ui.toggleInvestigate(); break;
      }
    });

    window.addEventListener('keyup', e => {
      if (keyMap[e.code]) this.input[keyMap[e.code]] = false;
    });

    this.canvas?.addEventListener('click', () => {
      this.canvas?.focus();
      if (this.audio.ctx?.state === 'suspended') this.audio.ctx.resume();
    });
  }

  start(loadSave = false) {
    this.running = true;
    this.audio.init();
    this.audio.playAmbient();

    if (loadSave && this.save.load()) {
      this.ui.notify('Save dimuat!', 'success');
    } else {
      this.player.reset(960, 720, 0);
      this.hour = 8;
      this.day = 1;
      this.reputation.value = 50;
      this.level.level = 1;
      this.level.xp = 0;
      this.level.xpToNext = 100;
      this.skillTree.points = 0;
      this.skillTree.skills = { scanClue: true };
      this.ui.notify('Selamat datang di Echo Academy! Cari barang hilang & naik level.', 'success');
    }

    this.world.currentFloor = this.player.floor;
    this.canvas?.focus();
    this.reputation._updateHUD();
    this.level._updateHUD();
    this.quests._updateHUD();
    this.lastTime = performance.now();
    requestAnimationFrame(t => this.loop(t));
    setInterval(() => this.save.save(), 60000);
    this._setupPauseUI();
  }

  _setupPauseUI() {
    const pauseMenu = document.getElementById('pause-menu');
    document.getElementById('btn-resume')?.addEventListener('click', () => this.resumeGame());
    document.getElementById('btn-save-exit')?.addEventListener('click', () => this.saveAndExit());
    document.getElementById('btn-pause-settings')?.addEventListener('click', () => this.showPauseSettings());
  }

  pauseGame() {
    if (this.paused || this.dialogue.active) return;
    this.paused = true;
    this.timeScale = 0;
    const pauseMenu = document.getElementById('pause-menu');
    if (pauseMenu) {
      pauseMenu.classList.remove('hidden');
      document.getElementById('btn-resume')?.focus();
    }
    this.audio.pause();
  }

  resumeGame() {
    if (!this.paused) return;
    this.paused = false;
    this.timeScale = 1;
    const pauseMenu = document.getElementById('pause-menu');
    if (pauseMenu) pauseMenu.classList.add('hidden');
    this.canvas?.focus();
    this.audio.resume();
  }

  saveAndExit() {
    this.running = false;
    this.paused = false;
    
    // Save game
    this.save.save();
    this.ui?.notify('Game Tersimpan!', 'success');
    
    // Return to menu
    document.getElementById('game-container')?.classList.add('hidden');
    document.getElementById('pause-menu')?.classList.add('hidden');
    document.getElementById('main-menu')?.classList.add('active');
    this.inventory.close();
    this.skillTree.panel?.classList.add('hidden');
    this.shop.panel?.classList.add('hidden');
  }

  showPauseSettings() {
    document.getElementById('settings-modal')?.classList.remove('hidden');
  }

  loop(timestamp) {
    if (!this.running) return;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;
    if (!this.dialogue.active) this.update(dt);
    this.render();
    requestAnimationFrame(t => this.loop(t));
  }

  update(dt) {
    const scaledDt = dt * this.timeScale;
    this.hour += scaledDt * 0.03;
    if (this.hour >= 24) { this.hour = 0; this.day++; }

    this.onStairCooldown = Math.max(0, this.onStairCooldown - dt);
    this.world.currentFloor = this.player.floor;

    const panelOpen = !document.getElementById('inventory-panel')?.classList.contains('hidden')
      || !document.getElementById('skill-panel')?.classList.contains('hidden')
      || !document.getElementById('shop-panel')?.classList.contains('hidden');

    if (!panelOpen) {
      this.player.update(scaledDt, this.input, this.movement, this.world, this.skillTree);
      this._checkStairs();
    }

    this.npcManager.update(scaledDt, this.hour, { hour: this.hour, floor: this.player.floor });
    this.events.update(scaledDt);
    this.weather.update(scaledDt);
    this.dream.update(scaledDt);

    this._updateCamera();
    this.ui.updateHUD();
    this.minimap.draw();

    if (this.input.interact) {
      this.input.interact = false;
      this._handleInteract();
    }
  }

  _checkStairs() {
    if (this.onStairCooldown > 0) return;
    const c = this.player.getCenter();
    const stair = this.world.getStairAt(c.x, c.y, this.player.floor);
    if (!stair) return;

    const targetFloor = stair.toFloor;
    if (targetFloor < 0 || targetFloor >= FLOORS) return;

    this.player.floor = targetFloor;
    this.world.currentFloor = targetFloor;
    const dest = this.world.stairs.find(s => s.floor === targetFloor && s.toFloor !== targetFloor);
    if (dest) {
      this.player.x = dest.x + dest.w / 2 - this.player.w / 2;
      this.player.y = dest.y + dest.h / 2;
    }
    this.onStairCooldown = 0.8;
    this.ui.notify(stair.label || `Lantai ${targetFloor + 1}`, 'success');
  }

  _updateCamera() {
    const px = this.player.x + this.player.w / 2;
    const py = this.player.y + this.player.h / 2;
    const foy = this.world.floorOffset(this.player.floor);

    this.camera.x = Math.max(0, Math.min(WORLD_W - this.camera.w, px - this.camera.w / 2));
    this.camera.y = Math.max(foy, Math.min(foy + FLOOR_H - this.camera.h, py - this.camera.h / 2));
  }

  _handleInteract() {
    const center = this.player.getCenter();
    const floor = this.player.floor;

    const item = this.npcManager.getNearbyItem(center.x, center.y, floor, 55);
    if (item) {
      item.found = true;
      this.inventory.addItem(item);
      this.audio.playPickup();
      if (item.ownerId) {
        const owner = this.npcManager.npcs.find(n => n.id === item.ownerId);
        if (owner) {
          owner.panicking = false;
          owner.hasLostItem = false;
          const room = this.world.getRoomById(item.lastSeenRoom);
          this.reputation.addClue(`Barang milik ${owner.name} — terakhir di ${room?.name || '?'}`);
        }
      } else {
        this.quests.startQuest('investigate_owner', { itemId: item.id });
        const room = this.world.getRoomById(item.lastSeenRoom);
        this.reputation.addClue(`Barang ditemukan di ${room?.name || 'sekolah'} (Lantai ${floor + 1})`);
      }
      return;
    }

    const npc = this.npcManager.getNearbyNPC(center.x, center.y, floor, 65);
    if (npc) {
      this.audio.playInteract();
      this.dialogue.open(npc);
      return;
    }

    const stair = this.world.getStairAt(center.x, center.y, floor);
    if (stair) {
      this.ui.notify('Berjalan ke tangga... (' + (stair.label || '') + ')', 'info');
    }
  }

  _tryReturnItem(item, npc) {
    const isOwner = npc.lostItems?.includes(item.type) || item.ownerId === npc.id;
    if (isOwner) {
      this.inventory.removeItem(item.id);
      npc.panicking = false;
      npc.hasLostItem = false;
      const repGain = 12 + (this.skillTree.skills.charisma ? 5 : 0);
      this.reputation.change(repGain);
      this.quests.onItemReturned(item, npc);
      this.level.onItemReturned(item);
      let pay = 60 + Math.floor(Math.random() * 40);
      if (this.skillTree.skills.questReward) pay += 25;
      this.shop.addMoney(pay, `tugas selesai (${npc.name})`);
      this.audio.playQuest();
      this.ui.notify(`Berhasil mengembalikan ${item.meta?.name} ke ${npc.name}!`, 'success');
    } else {
      this.ui.notify(`${npc.name}: "Ini bukan barangku..."`, 'warning');
      this.reputation.addClue(`${npc.name} menolak — bukan pemilik ${item.meta?.name}`);
    }
  }

  _checkCCTV() {
    const center = this.player.getCenter();
    const floor = this.player.floor;
    const cctv = this.world.cctvPoints.find(c =>
      c.floor === floor && Math.hypot(c.x - center.x, c.y - center.y) < 120
    );

    if (cctv || this.skillTree.skills.hacking) {
      const items = this.npcManager.lostItemsWorld.filter(i => !i.found);
      if (items.length) {
        const it = items[Math.floor(Math.random() * items.length)];
        const room = this.world.getRoomById(it.lastSeenRoom);
        this.reputation.addClue(`CCTV: barang terlihat di ${room?.name} (Lantai ${it.floor + 1})`);
        this.ui.notify('Rekaman CCTV: petunjuk lokasi ditambahkan!', 'success');
      } else {
        this.ui.notify('CCTV: tidak ada aktivitas mencurigakan.', 'info');
      }
    } else {
      this.ui.notify('CCTV ada di Lobby, Kantin, dan Lab.', 'warning');
    }
  }

  triggerMemoryEcho(item, echoType) {
    const overlay = document.getElementById('echo-overlay');
    const echoText = document.getElementById('echo-text');
    const echoClue = document.getElementById('echo-clue');
    const room = this.world.getRoomById(item.lastSeenRoom);
    const echoes = {
      sad: { text: '...kenangan di sekolah ini masih terasa.', clue: `Echo menuju ${room?.name || 'koridor'}...`, mood: 'echo-sad' },
      happy: { text: 'Hari yang menyenangkan bersama teman-teman!', clue: 'Suara tawa memenuhi koridor.', mood: 'echo-happy' },
      mysterious: { text: 'Ada sesuatu yang aneh di balik barang ini...', clue: 'Bayangan bergerak di ujung koridor.', mood: 'echo-mysterious' },
      neutral: { text: 'Barang sehari-hari di sekolah.', clue: room ? `Terakhir terasa di ${room.name}` : '', mood: '' },
    };
    const e = echoes[echoType] || echoes.neutral;
    document.body.className = e.mood;
    if (echoText) echoText.textContent = e.text;
    if (echoClue) echoClue.textContent = e.clue;
    overlay?.classList.remove('hidden');
    this.audio.playEcho();
    setTimeout(() => { overlay?.classList.add('hidden'); document.body.className = ''; }, 4000);
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const cam = this.camera;

    ctx.fillStyle = '#0e1018';
    ctx.fillRect(0, 0, cam.w, cam.h);

    this.world.draw(ctx, cam, { hour: this.hour, floor: this.player.floor });
    this.npcManager.draw(ctx, cam, this.hour, this.player.floor);
    this.player.draw(ctx, cam);
    this.dream.draw(ctx, cam);
    this.weather.draw();

    if (this.skillTree.skills.scanClue) {
      this.npcManager.lostItemsWorld
        .filter(i => i.floor === this.player.floor && !i.found)
        .forEach(item => {
          ctx.strokeStyle = '#ffd700aa';
          ctx.beginPath();
          ctx.arc(item.x - cam.x, item.y - cam.y, 28, 0, Math.PI * 2);
          ctx.stroke();
        });
    }

    if (this.skillTree.skills.fastAnalysis) {
      const near = this.npcManager.getNearbyItem(
        this.player.getCenter().x, this.player.getCenter().y, this.player.floor, 200
      );
      if (near?.ownerId) {
        const owner = this.npcManager.npcs.find(n => n.id === near.ownerId);
        if (owner) {
          ctx.fillStyle = '#00f5ff';
          ctx.font = '12px Rajdhani, sans-serif';
          ctx.fillText(`Pemilik: ${owner.name}`, 20, cam.h - 30);
        }
      }
    }
  }
}

const game = new Game();
game.init();
