/** Main menu, loading screen, settings */
export class MainMenu {
  constructor(game) {
    this.game = game;
    this.loadingScreen = document.getElementById('loading-screen');
    this.mainMenu = document.getElementById('main-menu');
    this.menuBg = document.getElementById('menu-bg');
    this.loadingFill = document.getElementById('loading-fill');
    this.loadingText = document.getElementById('loading-text');
    this.bgIndex = 0;
    this.bgColors = [
      'linear-gradient(135deg, #0a0e1a, #1a1040, #0a3040)',
      'linear-gradient(135deg, #1a0820, #2a1040, #081830)',
      'linear-gradient(135deg, #081820, #102840, #1a0830)',
    ];
    this._bindEvents();
    this._createParticles();
  }

  _bindEvents() {
    document.getElementById('btn-start').addEventListener('click', () => this.startNewGame());
    document.getElementById('btn-continue').addEventListener('click', () => this.continueGame());
    document.getElementById('btn-settings').addEventListener('click', () => this.showSettings());
    document.getElementById('btn-credits').addEventListener('click', () => this.showCredits());
    document.getElementById('btn-settings-close').addEventListener('click', () => this.hideModal('settings-modal'));
    document.getElementById('btn-credits-close').addEventListener('click', () => this.hideModal('credits-modal'));

    ['vol-master', 'vol-music', 'vol-sfx'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        const key = id.replace('vol-', '');
        this.game.audio?.setVolume(key === 'master' ? 'master' : key, e.target.value / 100);
      });
    });

    setInterval(() => this._cycleBg(), 6000);
  }

  _createParticles() {
    const container = document.getElementById('menu-particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: ${Math.random() > 0.5 ? '#00f5ff' : '#ff2d95'};
        animation-delay: ${Math.random() * 3}s;
        opacity: ${0.3 + Math.random() * 0.5};
      `;
      container.appendChild(p);
    }
  }

  _cycleBg() {
    this.bgIndex = (this.bgIndex + 1) % this.bgColors.length;
    if (this.menuBg) this.menuBg.style.background = this.bgColors[this.bgIndex];
  }

  async showLoading() {
    const steps = [
      'Initializing Returners Protocol...',
      'Loading Echo Worlds...',
      'Spawning NPC schedules...',
      'Calibrating time portals...',
      'Syncing lost item registry...',
      'Ready.',
    ];
    for (let i = 0; i < steps.length; i++) {
      if (this.loadingText) this.loadingText.textContent = steps[i];
      if (this.loadingFill) this.loadingFill.style.width = `${((i + 1) / steps.length) * 100}%`;
      await new Promise(r => setTimeout(r, 400 + Math.random() * 200));
    }
    await new Promise(r => setTimeout(r, 300));
    this.loadingScreen?.classList.remove('active');
    this.mainMenu?.classList.add('active');
    if (this.menuBg) this.menuBg.style.background = this.bgColors[0];
    this._checkSave();
  }

  _checkSave() {
    const btn = document.getElementById('btn-continue');
    if (btn && localStorage.getItem('echoWorlds_save')) {
      btn.disabled = false;
    }
  }

  startNewGame() {
    this._transitionToGame(false);
  }

  continueGame() {
    this._transitionToGame(true);
  }

  _transitionToGame(loadSave) {
    this.mainMenu?.classList.remove('active');
    document.getElementById('game-container')?.classList.remove('hidden');
    this.game.start(loadSave);
  }

  showSettings() {
    document.getElementById('settings-modal')?.classList.remove('hidden');
  }

  showCredits() {
    document.getElementById('credits-modal')?.classList.remove('hidden');
  }

  hideModal(id) {
    document.getElementById(id)?.classList.add('hidden');
  }
}
