/** Skill tree — upgrade kemampuan player (dari level up) */
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
        { id: 'scanClue', name: 'Pindai Petunjuk', minLevel: 1, cost: 0, desc: 'Sorot barang hilang di peta', icon: '🔍' },
        { id: 'seeTrail', name: 'Jejak Barang', minLevel: 2, cost: 1, desc: 'Radius petunjuk +30%', icon: '👣' },
        { id: 'fastAnalysis', name: 'Analisis Cepat', minLevel: 4, cost: 2, desc: 'Tampilkan nama pemilik dekat barang', icon: '⚡' },
        { id: 'moneyBonus', name: 'Bonus Uang', minLevel: 3, cost: 2, desc: '+15% uang dari tugas', icon: '💰' },
      ],
      courier: [
        { id: 'stamina', name: 'Stamina+', minLevel: 2, cost: 1, desc: '+30 stamina maks', icon: '❤️' },
        { id: 'courierSpeed', name: 'Lari Cepat', minLevel: 3, cost: 1, desc: '+18% kecepatan jalan', icon: '⚡' },
        { id: 'carryCapacity', name: 'Tas Besar', minLevel: 3, cost: 1, desc: '+4 slot inventori', icon: '📦' },
        { id: 'sprintMaster', name: 'Master Sprint', minLevel: 5, cost: 2, desc: 'Sprint boros stamina lebih sedikit', icon: '🏃' },
      ],
      tech: [
        { id: 'droneScanner', name: 'Drone Sekolah', minLevel: 4, cost: 2, desc: 'Semua item di minimap besar', icon: '🤖' },
        { id: 'hacking', name: 'Akses CCTV', minLevel: 5, cost: 1, desc: 'CCTV dari mana saja (F)', icon: '📹' },
        { id: 'shopDiscount', name: 'Diskon Toko', minLevel: 4, cost: 2, desc: 'Harga shop -10%', icon: '💳' },
      ],
      social: [
        { id: 'charisma', name: 'Charisma', minLevel: 2, cost: 1, desc: '+5 rep saat kembalikan barang', icon: '✨' },
        { id: 'npcRadar', name: 'Radar NPC', minLevel: 3, cost: 1, desc: 'NPC quest tandai emas di peta', icon: '📍' },
        { id: 'questReward', name: 'Hadiah Tugas+', minLevel: 5, cost: 2, desc: '+25 uang per tugas selesai', icon: '🎁' },
      ],
    };
  }

  onLevelUp() {
    this.points += 1;
    if (this.pointsEl) this.pointsEl.textContent = `${this.points} pt`;
    this.game.ui?.notify('+1 Skill Point! Tekan K untuk upgrade.', 'success');
    this.render();
  }

  applySkillEffects(skillId) {
    const p = this.game.player;
    const inv = this.game.inventory;
    switch (skillId) {
      case 'stamina':
        p.maxStamina += 30;
        p.stamina = p.maxStamina;
        this.game.ui?.notify('Stamina maksimal bertambah!', 'success');
        break;
      case 'carryCapacity':
        inv.maxSlots += 4;
        this.game.ui?.notify('Slot inventori bertambah!', 'success');
        break;
      case 'courierSpeed':
        p.speed = Math.floor(p.speed * 1.18);
        this.game.ui?.notify('Kecepatan berlari meningkat!', 'success');
        break;
      case 'sprintMaster':
        // Sprint stamina drain reduced by 20%
        this.game.ui?.notify('Sprint lebih efisien!', 'success');
        break;
      case 'moneyBonus':
      case 'questReward':
      case 'scanClue':
      case 'seeTrail':
      case 'fastAnalysis':
      case 'droneScanner':
      case 'hacking':
      case 'shopDiscount':
      case 'charisma':
      case 'npcRadar':
        this.game.ui?.notify(`Skill aktif: ${skillId}`, 'success');
        break;
    }
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
    this.applySkillEffects(skillId);
    this.game.ui?.notify(`Skill aktif: ${skill.name}`, 'success');
    this.render();
    return true;
  }

  getSpeedMult() {
    return this.skills.courierSpeed ? 1.18 : 1;
  }

  toggle() {
    if (!this.panel) return;
    const open = !this.panel.classList.contains('hidden');
    if (open) {
      this.panel.classList.add('hidden');
      this.panel.classList.remove('panel-enter');
    } else {
      this.panel.classList.remove('hidden');
      this.panel.classList.add('panel-enter');
      this.render();
    }
  }

  render() {
    if (!this.branchesEl) return;
    const lv = this.game.level?.level ?? 1;
    if (this.pointsEl) this.pointsEl.textContent = `${this.points} pt | Lv.${lv}`;

    this.branchesEl.innerHTML = '';
    for (const [branch, skills] of Object.entries(this.tree)) {
      const div = document.createElement('div');
      div.className = 'skill-branch';
      const branchIcons = { detective: '🔍', courier: '🏃', tech: '🤖', social: '✨' };
      div.innerHTML = `<h4>${branchIcons[branch]} ${branch.toUpperCase()}</h4>`;

      skills.forEach(s => {
        const row = document.createElement('div');
        row.className = 'skill-node' + (this.skills[s.id] ? ' unlocked' : '');
        const locked = lv < s.minLevel;
        const canUnlock = !this.skills[s.id] && !locked && this.points >= s.cost;
        
        row.innerHTML = `
          <div class="skill-detail">
            <span class="skill-icon">${s.icon}</span>
            <strong>${s.name}</strong>
            <small>Lv.${s.minLevel}${s.cost ? ` · ${s.cost}pt` : ''}</small>
            <small class="skill-desc">${s.desc}</small>
          </div>
          <button class="skill-btn ${this.skills[s.id] ? 'unlocked' : locked ? 'locked' : canUnlock ? 'available' : 'unavailable'}" 
                  ${this.skills[s.id] || locked ? 'disabled' : ''}>
            ${this.skills[s.id] ? '✓' : locked ? '🔒' : 'OK'}
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

  toJSON() {
    return { points: this.points, skills: { ...this.skills } };
  }

  fromJSON(data) {
    if (!data) return;
    this.points = data.points ?? 0;
    this.skills = data.skills ?? {};
    // Reapply all unlocked skills
    Object.keys(this.skills).forEach(skillId => {
      if (this.skills[skillId]) {
        this.applySkillEffects(skillId);
      }
    });
  }
}
