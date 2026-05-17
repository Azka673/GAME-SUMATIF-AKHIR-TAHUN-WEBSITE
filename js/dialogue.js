/** Dialogue system */
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
  }

  open(npc, context = {}) {
    this.active = true;
    this.currentNPC = npc;
    this.box?.classList.remove('hidden');
    if (this.nameEl) this.nameEl.textContent = npc.name || '???';
    if (this.portrait) this.portrait.style.background = `linear-gradient(135deg, ${npc.color || '#666'}, #0a1520)`;

    const dlg = npc.getDialogue(context);
    const choices = [...(dlg.choices || [])];
    const matchItem = this.game.inventory?.items.find(i =>
      i.ownerId === npc.id || npc.lostItems?.includes(i.type)
    );
    if (matchItem) {
      choices.unshift({ text: `Return ${matchItem.meta?.name}`, action: 'return_item', itemId: matchItem.id });
    }
    if (this.textEl) this.textEl.textContent = dlg.text;
    this._renderChoices(choices);
  }

  close() {
    this.active = false;
    this.currentNPC = null;
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
    switch (choice.action) {
      case 'close':
        this.close();
        break;
      case 'accept_quest':
        this.game.quests?.startQuest('find_lost', { npcId: npc.id, itemType: npc.lostItems?.[0] });
        this.game.ui?.notify(`Quest: Find ${npc.name}'s lost item`, 'success');
        this.close();
        break;
      case 'clue':
        this.game.reputation?.addClue(`${npc.name} was last seen near ${npc.home?.x}, ${npc.home?.y}`);
        if (this.textEl) this.textEl.textContent = `I think I dropped it somewhere near my usual spot...`;
        break;
      case 'ask_proof':
        if (npc.isFake) {
          this.game.ui?.notify('They couldn\'t describe the item. Suspicious!', 'warning');
          this.game.reputation?.change(-5);
        }
        break;
      case 'fake_give':
        this.game.reputation?.change(-15);
        this.game.ui?.notify('You may have given the item to the wrong person...', 'danger');
        this.close();
        break;
      case 'lost_check':
        if (npc.panicking) {
          if (this.textEl) this.textEl.textContent = `Yes! Please find my ${npc.lostItems?.[0]}!`;
        } else {
          if (this.textEl) this.textEl.textContent = 'Not right now, thankfully.';
        }
        break;
      case 'area_info':
        const zone = this.game.world.getZoneAt(npc.x, npc.y);
        if (this.textEl) this.textEl.textContent = `This is the ${zone.name} area. ${zone.type === 'danger' ? 'Be careful at night.' : 'Pretty peaceful.'}`;
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
