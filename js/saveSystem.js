/** LocalStorage save system */
const SAVE_KEY = 'echoWorlds_save';

export class SaveSystem {
  constructor(game) {
    this.game = game;
  }

  save() {
    const data = {
      version: 2,
      timestamp: Date.now(),
      player: {
        x: this.game.player.x,
        y: this.game.player.y,
        floor: this.game.player.floor,
      },
      hour: this.game.hour,
      day: this.game.day,
      reputation: this.game.reputation?.value ?? 50,
      inventory: this.game.inventory?.items ?? [],
      skills: this.game.skillTree?.skills ?? {},
      skillPoints: this.game.skillTree?.points ?? 0,
      level: this.game.level?.toJSON?.() ?? { level: 1, xp: 0, xpToNext: 100 },
      quests: {
        active: this.game.quests?.active ?? [],
        completed: this.game.quests?.completed ?? [],
      },
      clues: this.game.reputation?.clues ?? [],
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Save failed', e);
      return false;
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      this.game.player.x = data.player?.x ?? 960;
      this.game.player.y = data.player?.y ?? 720;
      this.game.player.floor = data.player?.floor ?? 0;
      this.game.hour = data.hour ?? 8;
      this.game.day = data.day ?? 1;
      if (this.game.reputation) this.game.reputation.value = data.reputation ?? 50;
      if (this.game.inventory) this.game.inventory.items = data.inventory ?? [];
      if (this.game.skillTree) {
        this.game.skillTree.skills = data.skills ?? { scanClue: true };
        this.game.skillTree.points = data.skillPoints ?? 0;
      }
      if (this.game.level) this.game.level.fromJSON(data.level);
      if (this.game.quests) {
        this.game.quests.active = data.quests?.active ?? [];
        this.game.quests.completed = data.quests?.completed ?? [];
        this.game.quests._updateHUD();
      }
      if (this.game.reputation) this.game.reputation.clues = data.clues ?? [];
      this.game.world.currentFloor = this.game.player.floor;
      return true;
    } catch (e) {
      console.warn('Load failed', e);
      return false;
    }
  }

  hasSave() {
    return !!localStorage.getItem(SAVE_KEY);
  }
}
