/** Dialogue system — tugas guru, petunjuk murid */
import { ITEM_META } from './world.js';

export class DialogueSystem {
  constructor(game) {
    this.game = game;
    this.box = document.getElementById('dialogue-box');
    this.nameEl = document.getElementById('dialogue-name');
    this.textEl = document.getElementById('dialogue-text');
    this.choicesEl = document.getElementById('dialogue-choices');
    this.portrait = document.getElementById('dialogue-portrait');
    this.active = false;
    this.currentNPC = null;
    this.context = {};
  }

  open(npc, context = {}) {
    this.active = true;
    this.currentNPC = npc;
    this.context = context;
    this.box?.classList.remove('hidden');
    if (this.nameEl) this.nameEl.textContent = `${npc.name}${npc.isTeacher ? ' (Guru)' : ' (Murid)'}`;
    if (this.portrait) this.portrait.style.background = `linear-gradient(135deg, ${npc.color || '#666'}, #0a1520)`;

    const dlg = npc.getDialogue(context);
    const choices = [...(dlg.choices || [])];
    const matchItem = this.game.inventory?.items.find(i =>
      i.ownerId === npc.id || npc.lostItems?.includes(i.type)
    );
    if (matchItem) {
      choices.unshift({ text: `Kembalikan ${matchItem.meta?.name}`, action: 'return_item', itemId: matchItem.id });
    }

    // Typewriter effect: display text word by word
    if (this.textEl) this._typewriteText(dlg.text);
    this._renderChoices(choices);
  }

  _typewriteText(text) {
    if (!this.textEl) return;
    this.textEl.textContent = '';
    const words = text.split(' ');
    let wordIndex = 0;
    const typeNextWord = () => {
      if (wordIndex < words.length) {
        this.textEl.textContent += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
        wordIndex++;
        setTimeout(typeNextWord, 500);
      }
    };
    typeNextWord();
  }

  close() {
    this.active = false;
    this.currentNPC = null;
    this.context = {};
    this.box?.classList.add('hidden');
  }

  _renderChoices(choices) {
    if (!this.choicesEl) return;
    this.choicesEl.innerHTML = '';
    choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'dialogue-choice';
      btn.textContent = c.text;
      btn.addEventListener('click', () => this._handleChoice(c));
      this.choicesEl.appendChild(btn);
    });
  }

  _handleChoice(choice) {
    const npc = this.currentNPC;
    const world = this.game.world;

    switch (choice.action) {
      case 'close':
        this.close();
        break;

      case 'accept_quest':
        this.game.quests?.startQuest('find_lost', {
          npcId: npc.id,
          itemType: npc.lostItems?.[0],
          npcName: npc.name,
        });
        this.game.ui?.notify(`Tugas: Cari barang ${npc.name}`, 'success');
        this.close();
        break;

      case 'location_clue': {
        const room = world.getRoomById(npc.lastSeenRoom);
        const hint = room?.name || 'koridor';
        this.game.reputation?.addClue(`${npc.name}: terakhir kali di ${hint} (Lantai ${npc.floor + 1})`);
        if (this.textEl) {
          this.textEl.textContent = `Terakhir kali aku melihat barang itu di ${hint}. Coba cek di sana!`;
        }
        break;
      }

      case 'teacher_quest':
        this.game.quests?.startQuest('teacher_task', { teacherId: npc.id, teacherName: npc.name });
        this.game.ui?.notify(`Tugas dari ${npc.name}: kembalikan barang hilang di sekolah!`, 'success');
        this.close();
        break;

      case 'teacher_hint': {
        const items = this.game.npcManager.lostItemsWorld.filter(i => !i.found && i.floor === npc.floor);
        if (items.length) {
          const it = items[0];
          const room = world.getRoomById(it.lastSeenRoom);
          this.game.reputation?.addClue(`Guru ${npc.name}: cek ${room?.name || 'area'} lantai ${it.floor + 1}`);
          if (this.textEl) this.textEl.textContent = `Ada laporan barang hilang. Coba periksa ${room?.name || 'sekitar koridor'}.`;
        } else {
          if (this.textEl) this.textEl.textContent = 'Belum ada laporan baru. Terus berkeliling ya.';
        }
        break;
      }

      case 'ask_witness': {
        const activeItem = this.game.npcManager.lostItemsWorld.find(i => !i.found);
        if (activeItem) {
          this.open(npc, { askingWitness: true, item: activeItem });
        } else {
          if (this.textEl) this.textEl.textContent = 'Belum ada barang hilang yang perlu dicari sekarang.';
        }
        break;
      }

      case 'add_witness_clue': {
        const item = choice.item;
        const room = world.getRoomById(item.lastSeenRoom);
        this.game.reputation?.addClue(
          `${npc.name}: "Terakhir kali aku melihat barang itu di ${room?.name}" (Lantai ${item.floor + 1})`
        );
        this.close();
        break;
      }

      case 'lost_check':
        if (npc.panicking) {
          const itemName = ITEM_META[npc.lostItems?.[0]]?.name || 'barang';
          if (this.textEl) this.textEl.textContent = `Iya! Tolong carikan ${itemName}! Terakhir di ${npc.getLastSeenClue()}.`;
        } else {
          if (this.textEl) this.textEl.textContent = 'Untungnya aku tidak kehilangan apa-apa hari ini.';
        }
        break;

      case 'return_item': {
        const item = this.game.inventory.items.find(i => i.id === choice.itemId);
        if (item) this.game._tryReturnItem(item, npc);
        this.close();
        break;
      }

      default:
        this.close();
    }
  }
}
