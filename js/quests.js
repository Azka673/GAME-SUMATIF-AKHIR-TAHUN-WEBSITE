/** Quest system */
export class QuestSystem {
  constructor(game) {
    this.game = game;
    this.active = [];
    this.completed = [];
    this.questText = document.getElementById('quest-text');
  }

  startQuest(id, data = {}) {
    const quests = {
      find_lost: {
        id: 'find_lost',
        title: 'Find Lost Item',
        desc: `Locate and return the lost item for ${data.npcId}`,
        data,
        reward: { rep: 10, skillPoints: 1 },
      },
      investigate_owner: {
        id: 'investigate_owner',
        title: 'Identify the Owner',
        desc: 'Use clues and NPC interviews to find the true owner',
        data,
        reward: { rep: 15, skillPoints: 2 },
      },
      cctv_check: {
        id: 'cctv_check',
        title: 'Check CCTV',
        desc: 'Review security footage near the item location',
        data,
        reward: { rep: 5 },
      },
      timeline_fix: {
        id: 'timeline_fix',
        title: 'Timeline Restoration',
        desc: 'Return the artifact to the correct timeline',
        data,
        reward: { rep: 25, skillPoints: 3 },
      },
      dream_rescue: {
        id: 'dream_rescue',
        title: 'Dream Entry',
        desc: 'Enter the owner\'s dream and recover lost memories',
        data,
        reward: { rep: 20, skillPoints: 2 },
      },
    };

    const q = quests[id];
    if (!q || this.active.find(a => a.id === id && a.data?.npcId === data.npcId)) return;
    this.active.push({ ...q, progress: 0 });
    this._updateHUD();
  }

  completeQuest(id) {
    const idx = this.active.findIndex(q => q.id === id);
    if (idx < 0) return;
    const q = this.active.splice(idx, 1)[0];
    this.completed.push(q.id);
    const r = q.reward || {};
    if (r.rep) this.game.reputation?.change(r.rep);
    if (r.skillPoints) this.game.skillTree?.addPoints(r.skillPoints);
    this.game.ui?.notify(`Quest complete: ${q.title}`, 'success');
    this._updateHUD();
  }

  onItemReturned(item, npc) {
    this.completeQuest('find_lost');
    if (item.meta?.timeline) this.completeQuest('timeline_fix');
    if (item.meta?.dream) this.completeQuest('dream_rescue');
    this.startQuest('investigate_owner', { completed: true });
  }

  _updateHUD() {
    if (!this.questText) return;
    if (this.active.length) {
      this.questText.textContent = this.active[0].desc;
    } else {
      this.questText.textContent = 'Explore the city. Help NPCs find lost items.';
    }
  }
}
