/**
 * Lost & Found: Echo Worlds
 * Main game orchestrator — The Returners
 */
import { World, WORLD_W, WORLD_H } from './world.js';
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
import { MonsterSystem } from './monsterSystem.js';
import { ReputationSystem } from './reputation.js';
import { SkillTree } from './skillTree.js';
import { AudioManager } from './audio.js';
import { UIManager } from './ui.js';
import { MainMenu } from './mainMenu.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.running = false;
    this.paused = false;
    this.hour = 8;
    this.day = 1;
    this.timeScale = 1;
    this.dreamMode = false;
    this.lastTime = 0;
    this.camera = { x: 0, y: 0, w: 0, h: 0 };

    this.input = {
      up: false, down: false, left: false, right: false,
      sprint: false, jump: false, interact: false,
      slide: false, grapple: false,
    };

    this.world = new World();
    this.player = new Player(600, 400);
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
    this.monsters = new MonsterSystem(this);
    this.reputation = new ReputationSystem(this);
    this.skillTree = new SkillTree(this);
    this.audio = new AudioManager();
    this.ui = new UIManager(this);
    this.menu = new MainMenu(this);

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

      switch (e.code) {
        case 'KeyI': this.inventory.toggle(); break;
        case 'KeyK': this.skillTree.toggle(); break;
        case 'KeyM': this.minimap.toggle(); break;
        case 'KeyT': this.timeline.openPortal(); break;
        case 'KeyD': {
          const item = this.inventory.getSelected();
          if (item) this.dream.enter(item);
          break;
        }
        case 'KeyQ': {
          const item = this.inventory.getSelected();
          if (item) this.inventory.triggerEcho(item);
          break;
        }
        case 'KeyF': this._checkCCTV(); break;
        case 'KeyB': this.ui.toggleInvestigate(); break;
        case 'Escape':
          this.inventory.close();
          this.skillTree.panel?.classList.add('hidden');
          break;
      }
    });

    window.addEventListener('keyup', e => {
      if (keyMap[e.code]) this.input[keyMap[e.code]] = false;
    });

    this.canvas?.addEventListener('click', () => {
      if (this.audio.ctx?.state === 'suspended') this.audio.ctx.resume();
    });
  }

  start(loadSave = false) {
    this.running = true;
    this.audio.init();
    this.audio.playAmbient();

    if (loadSave && this.save.load()) {
      this.ui.notify('Save loaded!', 'success');
    } else {
      this.player.reset(600, 400);
      this.hour = 8;
      this.day = 1;
      this.reputation.value = 50;
      this.skillTree.points = 2;
      this.ui.notify('Welcome, Returner. Find lost items across Echo Worlds.', 'success');
      for (let i = 0; i < 5; i++) this.npcManager._spawnRandomLostItem();
    }

    this.reputation._updateHUD();
    this.quests._updateHUD();
    this.lastTime = performance.now();
    requestAnimationFrame(t => this.loop(t));

    setInterval(() => this.save.save(), 60000);
  }

  loop(timestamp) {
    if (!this.running) return;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    if (!this.paused && !this.dialogue.active) {
      this.update(dt);
    }
    this.render();
    requestAnimationFrame(t => this.loop(t));
  }

  update(dt) {
    const scaledDt = dt * this.timeScale;

    this.hour += scaledDt * 0.05;
    if (this.hour >= 24) {
      this.hour = 0;
      this.day++;
      this.ui.notify(`Day ${this.day} begins...`, 'success');
    }

    const panelOpen = !document.getElementById('inventory-panel')?.classList.contains('hidden')
      || !document.getElementById('skill-panel')?.classList.contains('hidden');

    if (!panelOpen && !this.dialogue.active) {
      this.player.update(scaledDt, this.input, this.movement, this.world, this.skillTree.skills);
    }

    this.npcManager.update(scaledDt, this.hour, { hour: this.hour });
    this.monsters.update(scaledDt, this.hour);
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

  _updateCamera() {
    const px = this.player.x + this.player.w / 2;
    const py = this.player.y + this.player.h / 2;
    this.camera.x = Math.max(0, Math.min(WORLD_W - this.camera.w, px - this.camera.w / 2));
    this.camera.y = Math.max(0, Math.min(WORLD_H - this.camera.h, py - this.camera.h / 2));
  }

  _handleInteract() {
    const center = this.player.getCenter();

    const item = this.npcManager.getNearbyItem(center.x, center.y, 55);
    if (item) {
      item.found = true;
      this.inventory.addItem(item);
      this.audio.playPickup();
      if (item.ownerId) {
        const owner = this.npcManager.npcs.find(n => n.id === item.ownerId);
        if (owner) {
          owner.panicking = false;
          owner.hasLostItem = false;
          this.reputation.addClue(`Item belongs to ${owner.name}`);
        }
      } else {
        this.quests.startQuest('investigate_owner', { itemId: item.id });
      }
      return;
    }

    const npc = this.npcManager.getNearbyNPC(center.x, center.y, 70);
    if (npc) {
      this.audio.playInteract();
      this.dialogue.open(npc);
      return;
    }

    const monster = this.monsters.getNearby(center.x, center.y, 60);
    if (monster) {
      this.dialogue.open(monster);
      return;
    }

    const held = this.inventory.getSelected();
    if (held && npc) {
      this._tryReturnItem(held, npc);
    }
  }

  _tryReturnItem(item, npc) {
    const isOwner = npc.lostItems?.includes(item.type) || item.ownerId === npc.id;
    if (npc.isFake) {
      this.timeline.wrongReturn(item, npc);
      return;
    }
    if (isOwner) {
      this.inventory.removeItem(item.id);
      npc.panicking = false;
      this.reputation.change(10);
      this.timeline.correctReturn(item, npc);
      this.quests.onItemReturned(item, npc);
      this.audio.playQuest();
      this.ui.notify(`Returned ${item.meta?.name} to ${npc.name}!`, 'success');
    } else {
      this.ui.notify(`${npc.name} says this isn't theirs...`, 'warning');
      this.reputation.addClue(`${npc.name} denied owning ${item.meta?.name}`);
    }
  }

  _checkCCTV() {
    const center = this.player.getCenter();
    const cctv = this.world.cctvPoints.find(c =>
      Math.hypot(c.x - center.x, c.y - center.y) < 100
    );
    if (cctv) {
      const item = this.npcManager.lostItemsWorld.find(i => !i.found);
      if (item) {
        this.reputation.addClue(`CCTV: suspicious activity near (${Math.floor(item.x)}, ${Math.floor(item.y)})`);
        this.ui.notify('CCTV footage analyzed.', 'success');
      } else {
        this.ui.notify('CCTV shows nothing unusual.', 'info');
      }
    } else if (this.skillTree.skills.hacking) {
      this.ui.notify('Remote hack: scanning area...', 'success');
      this.npcManager._spawnRandomLostItem();
    } else {
      this.ui.notify('Find a CCTV camera nearby (marked zones).', 'warning');
    }
  }

  triggerMemoryEcho(item, echoType) {
    const overlay = document.getElementById('echo-overlay');
    const echoText = document.getElementById('echo-text');
    const echoClue = document.getElementById('echo-clue');
    const echoes = {
      sad: { text: '...I never got to say goodbye.', clue: 'Rain begins to fall...', mood: 'echo-sad' },
      happy: { text: 'Best day of my life!', clue: 'Flowers bloom around you.', mood: 'echo-happy' },
      mysterious: { text: 'The timeline... it\'s fracturing.', clue: 'Shadows flicker at the edge of vision.', mood: 'echo-mysterious' },
      dangerous: { text: 'DO NOT OPEN. Containment breach.', clue: 'Reality trembles.', mood: 'echo-dangerous' },
      neutral: { text: 'Just another ordinary object.', clue: 'A faint warmth remains.', mood: '' },
    };
    const e = echoes[echoType] || echoes.neutral;
    document.body.className = e.mood;
    if (echoText) echoText.textContent = e.text;
    if (echoClue) echoClue.textContent = e.clue;
    overlay?.classList.remove('hidden');
    this.audio.playEcho();

    if (item.ownerId) {
      const owner = this.npcManager.npcs.find(n => n.id === item.ownerId);
      if (owner) this.reputation.addClue(`Echo reveals owner: ${owner.name}`);
    }

    setTimeout(() => {
      overlay?.classList.add('hidden');
      document.body.className = '';
    }, 4000);
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const cam = this.camera;

    ctx.fillStyle = '#080810';
    ctx.fillRect(0, 0, cam.w, cam.h);

    this.world.draw(ctx, cam, { hour: this.hour });
    this.npcManager.draw(ctx, cam, this.hour);
    this.monsters.draw(ctx, cam);
    this.player.draw(ctx, cam);
    this.dream.draw(ctx, cam);
    this.timeline.drawOverlay(ctx, cam);

    this.weather.draw();

    if (this.skillTree.skills.scanClue) {
      this.npcManager.lostItemsWorld.forEach(item => {
        if (item.found) return;
        ctx.strokeStyle = '#ffd70088';
        ctx.beginPath();
        ctx.arc(item.x - cam.x, item.y - cam.y, 30, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
  }
}

const game = new Game();
game.init();
