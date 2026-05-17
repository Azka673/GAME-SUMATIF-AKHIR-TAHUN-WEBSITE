/** Skill tree — dibuka dengan naik level (XP dari tugas) */
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
        { id: 'scanClue', name: 'Pindai Petunjuk', minLevel: 1, cost: 0, desc: 'Sorot barang hilang' },
        { id: 'seeTrail', name: 'Jejak Barang', minLevel: 3, cost: 1, desc: 'Lihat jejak di koridor' },
        { id: 'fastAnalysis', name: 'Analisis Cepat', minLevel: 5, cost: 2, desc: 'Petunjuk pemilik instan' },
      ],
      courier: [
        { id: 'stamina', name: 'Stamina+', minLevel: 2, cost: 1, desc: '+25 stamina maks' },
        { id: 'courierSpeed', name: 'Lari Cepat', minLevel: 4, cost: 1, desc: '+15% kecepatan' },
        { id: 'carryCapacity', name: 'Tas Besar', minLevel: 3, cost: 1, desc: '+5 slot inventori' },
        { id: 'slide', name: 'Slide', minLevel: 6, cost: 2, desc: 'Gerakan slide (C)' },
      ],
      tech: [
        { id: 'droneScanner', name: 'Drone Sekolah', minLevel: 4, cost: 2, desc: 'Item di minimap' },
        { id: 'hacking', name: 'Akses CCTV', minLevel: 5, cost: 1, desc: 'CCTV jarak jauh' },
        { id: 'grapple', name: 'Grapple', minLevel: 8, cost: 2, desc: 'Grappling hook (G)' },
      ],
      spirit: [
        { id: 'doubleJump', name: 'Double Jump', minLevel: 2, cost: 1, desc: 'Lompat ganda' },
        { id: 'dreamTime', name: 'Waktu Mimpi+', minLevel: 7, cost: 2, desc: '+15 detik dream' },
        { id: 'seeSpirit', name: 'Mata Roh', minLevel: 9, cost: 2, desc: 'Lihat echo tersembunyi' },
      ],
    };
  }

  onLevelUp() {
    this.points += 1;
    if (this.pointsEl) this.pointsEl.textContent = `${this.points} pt`;
    this.game.ui?.notify(`+1 Skill Point! Tekan K untuk buka skill.`, 'success');
    this.render();
  }

  unlock(branch, skillId) {
    const skill = this.tree[branch]?.find(s => s.id === skillId);
    if (!skill || this.skills[skillId]) return false;

    const lv = this.game.level?.level ?? 1;
    if (lv < skill.minLevel) {
      this.game.ui?.notify(`Butuh Level ${skill.minLevel}! (Kamu: ${lv})`, 'warning');
      return false;
    }
    if (this.points < skill.cost) {
      this.game.ui?.notify(`Butuh ${skill.cost} skill point!`, 'warning');
      return false;
    }

    this.points -= skill.cost;
    this.skills[skillId] = true;
    if (skillId === 'stamina') this.game.player.maxStamina += 25;
    if (skillId === 'carryCapacity') this.game.inventory.maxSlots += 5;
    this.game.ui?.notify(`Skill dibuka: ${skill.name}`, 'success');
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
    const lv = this.game.level?.level ?? 1;
    if (this.pointsEl) this.pointsEl.textContent = `${this.points} pt | Lv.${lv}`;

    this.branchesEl.innerHTML = '';
    for (const [branch, skills] of Object.entries(this.tree)) {
      const div = document.createElement('div');
      div.className = 'skill-branch';
      div.innerHTML = `<h4>${branch.toUpperCase()}</h4>`;

      skills.forEach(s => {
        const row = document.createElement('div');
        row.className = 'skill-node' + (this.skills[s.id] ? ' unlocked' : '');
        const locked = lv < s.minLevel;
        row.innerHTML = `
          <span>${s.name} <small>(Lv.${s.minLevel}${s.cost ? `, ${s.cost}pt` : ''})</small></span>
          <button ${this.skills[s.id] || locked ? 'disabled' : ''}>
            ${this.skills[s.id] ? 'OK' : locked ? 'LOCK' : 'Buka'}
          </button>
        `;
        if (!this.skills[s.id] && !locked) {
          row.querySelector('button')?.addEventListener('click', () => this.unlock(branch, s.id));
        }
        div.appendChild(row);
      });
      this.branchesEl.appendChild(div);
    }
  }
}
