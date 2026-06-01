/** Day/Night Cycle dan Location Management System */
export class DayNightCycleSystem {
  constructor(game) {
    this.game = game;
    
    // Game schedule
    this.schoolStartTime = 7 + 10/60; // 07:10 AM
    this.schoolEndTime = 15; // 03:00 PM
    this.sleepTime = 23; // 11:00 PM
    this.wakeTime = 6; // 06:00 AM
    
    // Current state
    this.gameHour = this.wakeTime;
    this.gameDay = 1;
    this.phase = 'morning'; // morning, school, evening, night
    this.atSchool = false;
    this.canLeaveSchool = false;
    
    // Transition state
    this.isTransitioning = false;
    this.transitionDuration = 1.5;
    this.transitionElapsed = 0;
    
    // UI elements
    this.timeDisplay = document.getElementById('hud-time');
    this.phaseIndicator = document.createElement('div');
    this.phaseIndicator.id = 'phase-indicator';
    this.phaseIndicator.className = 'phase-indicator';
    document.getElementById('hud')?.appendChild(this.phaseIndicator);
  }

  update(dt, gameHour) {
    this.gameHour = gameHour;
    
    // Update time display with better formatting
    const hour = Math.floor(gameHour);
    const minute = Math.floor((gameHour - hour) * 60);
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    if (this.timeDisplay) this.timeDisplay.textContent = timeStr;
    
    // Handle school entry
    if (!this.atSchool && gameHour >= this.schoolStartTime && gameHour < this.schoolEndTime) {
      if (!this.atSchool) {
        this._enterSchool();
      }
      this.phase = 'school';
      this.canLeaveSchool = false;
    }
    
    // Can leave school after school hours
    if (gameHour >= this.schoolEndTime) {
      this.canLeaveSchool = true;
      if (gameHour < 17) this.phase = 'evening';
      else this.phase = 'night';
    }
    
    // Morning phase
    if (gameHour >= this.wakeTime && gameHour < this.schoolStartTime) {
      this.phase = 'morning';
    }
    
    // Handle sleep/new day
    if (gameHour >= this.sleepTime || gameHour < this.wakeTime) {
      this.phase = 'night';
    }
    
    // Update phase indicator
    this._updatePhaseIndicator();
    
    // Handle transition animations
    if (this.isTransitioning) {
      this.transitionElapsed += dt;
      if (this.transitionElapsed >= this.transitionDuration) {
        this.isTransitioning = false;
        this.transitionElapsed = 0;
      }
    }
  }

  _enterSchool() {
    this.atSchool = true;
    this.game.ui?.notify('🏫 Masuk Sekolah! Waktu: 07:10 AM', 'info');
    this._playEnterAnimation();
    
    // Reset to school location if needed
    if (this.game.world.currentLocation !== 'school') {
      this.game.world.currentLocation = 'school';
      this.game.player.reset(960, 720, 0);
    }
  }

  _playEnterAnimation() {
    // Create a simple fade/transition effect for entering school
    const overlay = document.createElement('div');
    overlay.className = 'location-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 100;
      animation: fadeOut 1s ease-out forwards;
      pointer-events: none;
    `;
    
    const text = document.createElement('div');
    text.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--neon-cyan);
      font-family: var(--font-display);
      font-size: 1.5rem;
      letter-spacing: 0.1em;
      text-align: center;
      animation: fadeInOut 1.5s ease-out forwards;
    `;
    text.textContent = '━━━ MASUK SEKOLAH ━━━';\n    overlay.appendChild(text);
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.remove(), 1500);
  }

  leaveSchool() {
    if (!this.canLeaveSchool) {
      this.game.ui?.notify(`Harus menunggu jam ${this.schoolEndTime}:00 untuk pulang!`, 'warning');
      return false;
    }
    
    this.atSchool = false;
    this.game.ui?.notify('🏠 Pulang dari Sekolah', 'info');
    this._playExitAnimation();
    
    // Move to home location
    this.game.world.currentLocation = 'home';
    // Teleport to home area (can be added later)
    
    return true;
  }

  _playExitAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'location-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 100;
      animation: fadeOut 1s ease-out forwards;
      pointer-events: none;
    `;
    
    const text = document.createElement('div');
    text.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--text-primary);
      font-family: var(--font-display);
      font-size: 1.2rem;
      letter-spacing: 0.1em;
      text-align: center;
      animation: fadeInOut 1.5s ease-out forwards;
    `);
    text.textContent = '━━━ PULANG KE RUMAH ━━━';
    overlay.appendChild(text);
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.remove(), 1500);
  }\n\n  goToCity() {\n    if (this.phase === 'night') {\n      this.game.world.currentLocation = 'city';\n      this.game.ui?.notify('🌃 Menjelajahi Kota Malam', 'info');\n      return true;\n    } else {\n      this.game.ui?.notify('Hanya bisa menjelajahi kota pada malam hari!', 'warning');\n      return false;\n    }\n  }\n\n  _updatePhaseIndicator() {\n    const phaseTexts = {\n      morning: '🌅 PAGI',\n      school: '🏫 SEKOLAH',\n      evening: '🌅 SORE',\n      night: '🌙 MALAM'\n    };\n    const phaseColors = {\n      morning: '#ffaa00',\n      school: '#00f5ff',\n      evening: '#ff6b44',\n      night: '#6644ff'\n    };\n    \n    this.phaseIndicator.textContent = phaseTexts[this.phase] || 'UNKNOWN';\n    this.phaseIndicator.style.color = phaseColors[this.phase];\n    this.phaseIndicator.style.textShadow = `0 0 10px ${phaseColors[this.phase]}88`;\n  }\n\n  getPhaseInfo() {\n    return {\n      phase: this.phase,\n      hour: this.gameHour,\n      day: this.gameDay,\n      atSchool: this.atSchool,\n      canLeaveSchool: this.canLeaveSchool,\n    };\n  }\n\n  toJSON() {\n    return {\n      gameHour: this.gameHour,\n      gameDay: this.gameDay,\n      atSchool: this.atSchool,\n      phase: this.phase,\n    };\n  }\n\n  fromJSON(data) {\n    if (!data) return;\n    this.gameHour = data.gameHour ?? this.wakeTime;\n    this.gameDay = data.gameDay ?? 1;\n    this.atSchool = data.atSchool ?? false;\n    this.phase = data.phase ?? 'morning';\n  }\n}\n