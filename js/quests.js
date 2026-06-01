/** Quest system — tugas guru & murid */
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
        title: 'Cari Barang Hilang',
        desc: `Bantu ${data.npcName || 'murid'} menemukan barangnya. Tanya petunjuk ke murid lain!`,
        data,
        reward: { rep: 8 },
      },
      teacher_task: {
        id: 'teacher_task',
        title: 'Tugas Guru',
        desc: `${data.teacherName || 'Guru'} meminta kamu mengembalikan barang hilang di sekolah.`,
        data,
        reward: { rep: 5 },
      },
      investigate_owner: {
        id: 'investigate_owner',
        title: 'Cari Pemilik',
        desc: 'Tanya murid: "Terakhir kali terlihat di mana?" untuk menemukan pemilik.',
        data,
        reward: { rep: 5 },
      },
    };

    const q = quests[id];
    if (!q) return;
    if (this.active.find(a => a.id === id && a.data?.npcId === data.npcId)) return;
    this.active.push({ ...q, progress: 0 });
    this._updateHUD();
  }

  completeQuest(id) {
    const idx = this.active.findIndex(q => q.id === id);
    if (idx < 0) return;
    const q = this.active.splice(idx, 1)[0];
    this.completed.push(q.id);
    if (q.reward?.rep) this.game.reputation?.change(q.reward.rep);
    this.game.ui?.notify(`Tugas selesai: ${q.title}`, 'success');
    this._updateHUD();
  }

  onItemReturned(item, npc) {
    this.completeQuest('find_lost');
    this.completeQuest('teacher_task');
    this.game.level?.onItemReturned(item);
  }

  _updateHUD() {
    if (!this.questText) return;
    if (this.active.length) {
      this.questText.textContent = this.active[0].desc;
    } else {
      this.questText.textContent = 'Jelajahi sekolah. Bantu guru & murid menemukan barang hilang.';
    }
  }
}
