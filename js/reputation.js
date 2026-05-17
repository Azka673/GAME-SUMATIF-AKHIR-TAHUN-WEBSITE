/** Reputation & detective clues */
export class ReputationSystem {
  constructor(game) {
    this.game = game;
    this.value = 50;
    this.clues = [];
    this.hudRep = document.getElementById('hud-rep');
    this.clueList = document.getElementById('clue-list');
  }

  change(amount) {
    this.value = Math.max(0, Math.min(100, this.value + amount));
    this._updateHUD();
    if (amount > 0) this.game.ui?.notify(`Reputation +${amount}`, 'success');
    else if (amount < 0) this.game.ui?.notify(`Reputation ${amount}`, 'danger');

    if (this.value >= 80) this.game.ui?.notify('Citizens trust you! Rare quests unlocked.', 'success');
    if (this.value <= 20) this.game.ui?.notify('Police are watching you...', 'danger');
  }

  addClue(text) {
    if (this.clues.includes(text)) return;
    this.clues.push(text);
    this.game.ui?.notify(`Clue discovered: ${text}`, 'success');
    this.renderClues();
  }

  _updateHUD() {
    if (this.hudRep) {
      this.hudRep.textContent = this.value;
      this.hudRep.style.color = this.value >= 60 ? '#00ff88' : this.value >= 30 ? '#ffd700' : '#ff3333';
    }
  }

  renderClues() {
    if (!this.clueList) return;
    this.clueList.innerHTML = '';
    this.clues.forEach(c => {
      const el = document.createElement('div');
      el.className = 'clue-item';
      el.textContent = c;
      this.clueList.appendChild(el);
    });
  }
}
