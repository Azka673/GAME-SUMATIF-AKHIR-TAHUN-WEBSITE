/** Skill tree — Detective, Courier, Tech, Spirit */
export class SkillTree {
  constructor(game) {
    this.game = game;
    this.points = 0;
    this.skills = {};
    this.panel = document.getElementById('skill-panel');
    this.branchesEl = document.getElementById('skill-branches');
    this.pointsEl = document.getElementById('skill-points');

    this.tree = {
      detective: [
        { id: 'scanClue', name: 'Scan Clue', cost: 1, desc: 'Highlight nearby clues' },
        { id: 'seeTrail', name: 'See Trail', cost: 2, desc: 'See item drop trails' },
        { id: 'fastAnalysis', name: 'Fast Analysis', cost: 3, desc: 'Instant owner hints' },
      ],
      courier: [
        { id: 'stamina', name: 'Stamina+', cost: 1, desc: '+20 max stamina' },
        { id: 'courierSpeed', name: 'Speed+', cost: 2, desc: '+10% move speed' },
        { id: 'carryCapacity', name: 'Carry+', cost: 2, desc: '+5 inventory slots' },
        { id: 'slide', name: 'Slide', cost: 2, desc: 'Unlock slide (C)' },
      ],
      tech: [
        { id: 'droneScanner', name: 'Drone Scanner', cost: 2, desc: 'Reveal items on minimap' },
        { id: 'portalStabilizer', name: 'Portal Stabilizer', cost: 3, desc: 'Reduce timeline errors' },
        { id: 'hacking', name: 'Hacking', cost: 2, desc: 'Access CCTV remotely' },
        { id: 'grapple', name: 'Grapple Hook', cost: 3, desc: 'Grapple (G)' },
      ],
      spirit: [
        { id: 'seeSpirit', name: 'See Spirits', cost: 1, desc: 'See hidden spirits' },
        { id: 'dreamTime', name: 'Dream Time+', cost: 2, desc: '+10s in dreams' },
        { id: 'resistCorruption', name: 'Resist Corruption', cost: 3, desc: 'Resist timeline damage' },
        { id: 'doubleJump', name: 'Double Jump', cost: 2, desc: 'Double jump unlocked' },
        { id: 'wallRun', name: 'Wall Run', cost: 3, desc: 'Wall run ability' },
      ],
    };
  }

  addPoints(n) {
    this.points += n;
    if (this.pointsEl) this.pointsEl.textContent = this.points;
  }

  unlock(branch, skillId) {
    const skill = this.tree[branch]?.find(s => s.id === skillId);
    if (!skill || this.skills[skillId]) return false;
    if (this.points < skill.cost) {
      this.game.ui?.notify('Not enough skill points!', 'warning');
      return false;
    }
    this.points -= skill.cost;
    this.skills[skillId] = true;
    if (skillId === 'stamina') this.game.player.maxStamina += 20;
    if (skillId === 'carryCapacity') this.game.inventory.maxSlots += 5;
    this.game.ui?.notify(`Unlocked: ${skill.name}`, 'success');
    this.render();
    return true;
  }

  toggle() {
    if (!this.panel) return;
    const open = !this.panel.classList.contains('hidden');
    if (open) this.panel.classList.add('hidden');
    else { this.panel.classList.remove('hidden'); this.render(); }
  }

  render() {
    if (!this.branchesEl) return;
    if (this.pointsEl) this.pointsEl.textContent = this.points;
    this.branchesEl.innerHTML = '';

    for (const [branch, skills] of Object.entries(this.tree)) {
      const div = document.createElement('div');
      div.className = 'skill-branch';
      div.innerHTML = `<h4>${branch.toUpperCase()}</h4>`;
      skills.forEach(s => {
        const row = document.createElement('div');
        row.className = 'skill-node' + (this.skills[s.id] ? ' unlocked' : '');
        const unlocked = this.skills[s.id];
        row.innerHTML = `
          <span>${s.name} (${s.cost}pt)</span>
          <button ${unlocked ? 'disabled' : ''}>${unlocked ? '✓' : 'Unlock'}</button>
        `;
        row.querySelector('button')?.addEventListener('click', () => this.unlock(branch, s.id));
        div.appendChild(row);
      });
      this.branchesEl.appendChild(div);
    }
  }
}
